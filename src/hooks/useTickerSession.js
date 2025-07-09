import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    selectActiveSession, 
    selectHasActiveSessions 
} from '../redux/slices/tickerSessionsSlice';

/**
 * Custom hook to access ticker session data with automatic redirection.
 * If there's no active ticker session, it will redirect to the dashboard.
 * 
 * @param {Object} options
 * @param {boolean} options.redirectToDashboard - Whether to redirect to dashboard when no session exists
 * @param {boolean} options.updateDocumentTitle - Whether to update document title with active ticker
 * @param {string} options.titlePrefix - Prefix to use in document title (default: "accelno")
 * @returns {Object} Session data and utility functions
 */
export const useTickerSession = (options = { 
    redirectToDashboard: true,
    updateDocumentTitle: false,
    titlePrefix: "accelno"
}) => {
    const navigate = useNavigate();
    const hasActiveSessions = useSelector(selectHasActiveSessions);
    const activeSession = useSelector(selectActiveSession);
    
    // Redirect to dashboard if no active session
    useEffect(() => {
        if (options.redirectToDashboard && !hasActiveSessions) {
            navigate('/dashboard');
        }
    }, [hasActiveSessions, navigate, options.redirectToDashboard]);
    
    // Update document title with active ticker
    useEffect(() => {
        if (options.updateDocumentTitle && activeSession) {
            document.title = `${options.titlePrefix} | ${activeSession.ticker}`;
            
            // Restore original title on cleanup
            return () => {
                document.title = options.titlePrefix;
            };
        }
    }, [activeSession, options.updateDocumentTitle, options.titlePrefix]);
    
    return {
        activeSession,
        hasActiveSessions,
        activeTicker: activeSession?.ticker || null,
        isLoading: !activeSession && hasActiveSessions, // Loading state when we have sessions but active is not yet available
    };
};

export default useTickerSession; 