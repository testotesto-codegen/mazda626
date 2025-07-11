/**
 * Authentication Service
 * Handles all authentication-related API operations
 */

import { BaseService } from '../../../core/api/services/BaseService';
import { AUTH_CONFIG } from '../../../core/config';
import { createLogger } from '../../../core/logging';

const logger = createLogger('AuthService');

/**
 * Authentication service class
 */
export class AuthService extends BaseService {
  constructor() {
    super('/auth', { cache: false }); // Don't cache auth requests
  }

  /**
   * Login user with credentials
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @param {boolean} credentials.rememberMe - Remember user
   * @returns {Promise<Object>} Authentication response
   */
  async login(credentials) {
    this.validateParams(credentials, ['email', 'password']);
    
    try {
      const response = await this.post('/login', credentials);
      
      // Store tokens
      if (response.token) {
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.token);
      }
      
      if (response.refreshToken) {
        localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.refreshToken);
      }
      
      // Store user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      logger.info('User logged in successfully', {
        userId: response.user?.id,
        email: credentials.email
      });
      
      return response;
    } catch (error) {
      logger.error('Login failed', {
        email: credentials.email,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.firstName - User first name
   * @param {string} userData.lastName - User last name
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    this.validateParams(userData, ['email', 'password', 'firstName', 'lastName']);
    
    try {
      const response = await this.post('/register', userData);
      
      logger.info('User registered successfully', {
        email: userData.email
      });
      
      return response;
    } catch (error) {
      logger.error('Registration failed', {
        email: userData.email,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      // Call logout endpoint if token exists
      const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
      if (token) {
        await this.post('/logout');
      }
    } catch (error) {
      logger.warn('Logout API call failed', error);
      // Continue with local logout even if API fails
    } finally {
      // Clear local storage
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      localStorage.removeItem('user');
      
      logger.info('User logged out');
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} New token data
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await this.post('/refresh', { refreshToken });
      
      // Update stored tokens
      if (response.token) {
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.token);
      }
      
      if (response.refreshToken) {
        localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.refreshToken);
      }
      
      logger.info('Token refreshed successfully');
      
      return response;
    } catch (error) {
      logger.error('Token refresh failed', error);
      
      // Clear invalid tokens
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      
      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getCurrentUser() {
    try {
      const response = await this.get('/me');
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response));
      
      return response;
    } catch (error) {
      logger.error('Failed to get current user', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(profileData) {
    try {
      const response = await this.put('/profile', profileData);
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response));
      
      logger.info('Profile updated successfully');
      
      return response;
    } catch (error) {
      logger.error('Profile update failed', error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<void>}
   */
  async changePassword(passwordData) {
    this.validateParams(passwordData, ['currentPassword', 'newPassword']);
    
    try {
      await this.post('/change-password', passwordData);
      
      logger.info('Password changed successfully');
    } catch (error) {
      logger.error('Password change failed', error);
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  async requestPasswordReset(email) {
    this.validateParams({ email }, ['email']);
    
    try {
      await this.post('/forgot-password', { email });
      
      logger.info('Password reset requested', { email });
    } catch (error) {
      logger.error('Password reset request failed', { email, error: error.message });
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {Object} resetData - Password reset data
   * @param {string} resetData.token - Reset token
   * @param {string} resetData.password - New password
   * @returns {Promise<void>}
   */
  async resetPassword(resetData) {
    this.validateParams(resetData, ['token', 'password']);
    
    try {
      await this.post('/reset-password', resetData);
      
      logger.info('Password reset successfully');
    } catch (error) {
      logger.error('Password reset failed', error);
      throw error;
    }
  }

  /**
   * Verify email address
   * @param {string} token - Verification token
   * @returns {Promise<void>}
   */
  async verifyEmail(token) {
    this.validateParams({ token }, ['token']);
    
    try {
      await this.post('/verify-email', { token });
      
      logger.info('Email verified successfully');
    } catch (error) {
      logger.error('Email verification failed', error);
      throw error;
    }
  }

  /**
   * Resend email verification
   * @returns {Promise<void>}
   */
  async resendEmailVerification() {
    try {
      await this.post('/resend-verification');
      
      logger.info('Email verification resent');
    } catch (error) {
      logger.error('Failed to resend email verification', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    return !!token;
  }

  /**
   * Get stored user data
   * @returns {Object|null} User data
   */
  getStoredUser() {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      logger.error('Failed to parse stored user data', error);
      return null;
    }
  }

  /**
   * Get stored auth token
   * @returns {string|null} Auth token
   */
  getStoredToken() {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  /**
   * Check if token is expired (basic check)
   * @returns {boolean} Whether token appears expired
   */
  isTokenExpired() {
    const token = this.getStoredToken();
    if (!token) return true;
    
    try {
      // Basic JWT expiration check (decode payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp < currentTime;
    } catch (error) {
      logger.warn('Failed to check token expiration', error);
      return true; // Assume expired if can't parse
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

export default authService;

