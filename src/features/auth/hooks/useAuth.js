/**
 * Authentication Hook
 * Provides authentication state and actions
 */

import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/AuthService';
import { useApi } from '../../../shared/hooks/useApi';
import { createLogger } from '../../../core/logging';

const logger = createLogger('useAuth');

// Auth context for sharing auth state
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const isAuthenticated = authService.isAuthenticated();
        
        if (isAuthenticated && storedUser) {
          // Check if token is expired
          if (authService.isTokenExpired()) {
            try {
              await authService.refreshToken();
              const currentUser = await authService.getCurrentUser();
              
              setAuthState({
                user: currentUser,
                isAuthenticated: true,
                isLoading: false,
                error: null
              });
            } catch (error) {
              logger.warn('Token refresh failed during initialization', error);
              await authService.logout();
              
              setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
              });
            }
          } else {
            setAuthState({
              user: storedUser,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          }
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        logger.error('Auth initialization failed', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error
        });
      }
    };

    initializeAuth();
  }, []);

  const value = {
    ...authState,
    setAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Authentication hook
 * @returns {Object} Auth state and actions
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, isAuthenticated, isLoading, error, setAuthState } = context;

  // Login API call
  const loginApi = useApi(authService.login, {
    onSuccess: (response) => {
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      logger.info('User logged in successfully');
    },
    onError: (error) => {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error
      }));
      
      logger.error('Login failed', error);
    }
  });

  // Register API call
  const registerApi = useApi(authService.register, {
    onSuccess: (response) => {
      logger.info('User registered successfully');
    },
    onError: (error) => {
      logger.error('Registration failed', error);
    }
  });

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout failed', error);
      
      // Force logout even if API call fails
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  }, [setAuthState]);

  // Update profile
  const updateProfileApi = useApi(authService.updateProfile, {
    onSuccess: (updatedUser) => {
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
      
      logger.info('Profile updated successfully');
    },
    onError: (error) => {
      logger.error('Profile update failed', error);
    }
  });

  // Change password
  const changePasswordApi = useApi(authService.changePassword, {
    onSuccess: () => {
      logger.info('Password changed successfully');
    },
    onError: (error) => {
      logger.error('Password change failed', error);
    }
  });

  // Request password reset
  const requestPasswordResetApi = useApi(authService.requestPasswordReset, {
    onSuccess: () => {
      logger.info('Password reset requested successfully');
    },
    onError: (error) => {
      logger.error('Password reset request failed', error);
    }
  });

  // Reset password
  const resetPasswordApi = useApi(authService.resetPassword, {
    onSuccess: () => {
      logger.info('Password reset successfully');
    },
    onError: (error) => {
      logger.error('Password reset failed', error);
    }
  });

  // Verify email
  const verifyEmailApi = useApi(authService.verifyEmail, {
    onSuccess: () => {
      logger.info('Email verified successfully');
    },
    onError: (error) => {
      logger.error('Email verification failed', error);
    }
  });

  // Resend email verification
  const resendVerificationApi = useApi(authService.resendEmailVerification, {
    onSuccess: () => {
      logger.info('Email verification resent successfully');
    },
    onError: (error) => {
      logger.error('Failed to resend email verification', error);
    }
  });

  // Refresh current user data
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const currentUser = await authService.getCurrentUser();
      
      setAuthState(prev => ({
        ...prev,
        user: currentUser
      }));
      
      return currentUser;
    } catch (error) {
      logger.error('Failed to refresh user data', error);
      
      // If unauthorized, logout user
      if (error.status === 401) {
        await logout();
      }
      
      throw error;
    }
  }, [isAuthenticated, setAuthState, logout]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    if (!user || !user.roles) return false;
    return roles.some(role => user.roles.includes(role));
  }, [user]);

  // Check if user has all specified roles
  const hasAllRoles = useCallback((roles) => {
    if (!user || !user.roles) return false;
    return roles.every(role => user.roles.includes(role));
  }, [user]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || loginApi.isLoading || registerApi.isLoading,
    error: error || loginApi.error || registerApi.error,

    // Actions
    login: loginApi.execute,
    register: registerApi.execute,
    logout,
    updateProfile: updateProfileApi.execute,
    changePassword: changePasswordApi.execute,
    requestPasswordReset: requestPasswordResetApi.execute,
    resetPassword: resetPasswordApi.execute,
    verifyEmail: verifyEmailApi.execute,
    resendVerification: resendVerificationApi.execute,
    refreshUser,

    // Permission checks
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,

    // API states
    loginLoading: loginApi.isLoading,
    registerLoading: registerApi.isLoading,
    updateProfileLoading: updateProfileApi.isLoading,
    changePasswordLoading: changePasswordApi.isLoading,
    requestPasswordResetLoading: requestPasswordResetApi.isLoading,
    resetPasswordLoading: resetPasswordApi.isLoading,
    verifyEmailLoading: verifyEmailApi.isLoading,
    resendVerificationLoading: resendVerificationApi.isLoading,

    // API errors
    loginError: loginApi.error,
    registerError: registerApi.error,
    updateProfileError: updateProfileApi.error,
    changePasswordError: changePasswordApi.error,
    requestPasswordResetError: requestPasswordResetApi.error,
    resetPasswordError: resetPasswordApi.error,
    verifyEmailError: verifyEmailApi.error,
    resendVerificationError: resendVerificationApi.error
  };
};

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export const useRequireAuth = (redirectTo = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook to require specific permission
 */
export const useRequirePermission = (permission, fallback = null) => {
  const { hasPermission, isLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasAccess(hasPermission(permission));
    }
  }, [hasPermission, permission, isLoading]);

  if (isLoading) {
    return { hasAccess: false, isLoading: true };
  }

  if (!hasAccess && fallback) {
    return { hasAccess: false, isLoading: false, fallback };
  }

  return { hasAccess, isLoading: false };
};

/**
 * Hook to require specific role
 */
export const useRequireRole = (role, fallback = null) => {
  const { hasRole, isLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasAccess(hasRole(role));
    }
  }, [hasRole, role, isLoading]);

  if (isLoading) {
    return { hasAccess: false, isLoading: true };
  }

  if (!hasAccess && fallback) {
    return { hasAccess: false, isLoading: false, fallback };
  }

  return { hasAccess, isLoading: false };
};

export default useAuth;

