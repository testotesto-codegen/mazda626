import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sessions: [], // Array of ticker sessions: [{ id, ticker, createdAt, isActive, sessionData }]
    activeSessionId: null, // ID of the currently active session
    hasPlaceholder: false, // Track if we have a placeholder session
};

const tickerSessionsSlice = createSlice({
    name: 'tickerSessions',
    initialState,
    reducers: {
        createSession: (state, action) => {
            // Generate a unique session ID
            const sessionId = Date.now().toString();
            
            // Create a new session with empty sessionData for different features
            const newSession = {
                id: sessionId,
                ticker: action.payload,
                createdAt: new Date().toISOString(),
                isActive: true,
                sessionData: {
                    chat: {
                        messages: [],
                        isChatOpen: false,
                        showChatTips: true
                    },
                    // Add more session-specific data as needed for other tabs/features
                    filingView: {
                        scrollPosition: 0
                    },
                    news: {
                        articles: [],
                        activeFilter: 'Latest',
                        isLoading: false,
                        lastFetched: null
                    },
                    // Add data for other tabs as needed
                    charts: {
                        selectedTimeframe: '1Y',
                        indicators: []
                    },
                    equity: {
                        selectedTab: 'overview'
                    }
                }
            };
            
            // Mark all other sessions as inactive
            state.sessions = state.sessions.map(session => ({
                ...session,
                isActive: false
            }));
            
            // Remove placeholder if it exists before adding new session
            if (state.hasPlaceholder) {
                state.sessions = state.sessions.filter(session => session.ticker !== 'PLACEHOLDER');
                state.hasPlaceholder = false;
            }
            
            // Add the new session to the list
            state.sessions.push(newSession);
            
            // Set as active session
            state.activeSessionId = sessionId;
        },
        
        createPlaceholderSession: (state) => {
            // Remove any existing placeholder first
            if (state.hasPlaceholder) {
                state.sessions = state.sessions.filter(session => session.ticker !== 'PLACEHOLDER');
            }
            
            // Generate a unique session ID
            const sessionId = Date.now().toString();
            
            // Create a placeholder session
            const placeholderSession = {
                id: sessionId,
                ticker: 'PLACEHOLDER',
                createdAt: new Date().toISOString(),
                isActive: true,
                isPlaceholder: true,
                sessionData: {
                    chat: { messages: [], isChatOpen: false, showChatTips: true },
                    filingView: { scrollPosition: 0 },
                    news: { articles: [], activeFilter: 'Latest', isLoading: false, lastFetched: null },
                    charts: { selectedTimeframe: '1Y', indicators: [] },
                    equity: { selectedTab: 'overview' }
                }
            };
            
            // Mark all other sessions as inactive
            state.sessions = state.sessions.map(session => ({
                ...session,
                isActive: false
            }));
            
            // Add the placeholder session to the list
            state.sessions.push(placeholderSession);
            
            // Set as active session
            state.activeSessionId = sessionId;
            
            // Track that we have a placeholder
            state.hasPlaceholder = true;
        },
        
        setActiveSession: (state, action) => {
            const sessionId = action.payload;
            
            // Mark all sessions as inactive except the active one
            state.sessions = state.sessions.map(session => ({
                ...session,
                isActive: session.id === sessionId
            }));
            
            // Set active session ID
            state.activeSessionId = sessionId;
        },
        
        closeSession: (state, action) => {
            const sessionId = action.payload;
            const sessionToClose = state.sessions.find(session => session.id === sessionId);
            
            // Check if we're closing the active session
            const isClosingActiveSession = state.activeSessionId === sessionId;
            
            // If we're closing a placeholder, unset hasPlaceholder
            if (sessionToClose && sessionToClose.ticker === 'PLACEHOLDER') {
                state.hasPlaceholder = false;
            }
            
            // Remove the session
            state.sessions = state.sessions.filter(session => session.id !== sessionId);
            
            // If we closed the active session and there are other sessions,
            // make the most recently created one active
            if (isClosingActiveSession && state.sessions.length > 0) {
                // Sort by creation time (newest first) and take the first one
                const sortedSessions = [...state.sessions].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                
                state.activeSessionId = sortedSessions[0].id;
                
                // Mark it as active
                state.sessions = state.sessions.map(session => ({
                    ...session,
                    isActive: session.id === state.activeSessionId
                }));
            } else if (state.sessions.length === 0) {
                // If no sessions left, set activeSessionId to null
                state.activeSessionId = null;
            }
        },
        
        // New action to update session-specific data
        updateSessionData: (state, action) => {
            const { sessionId, dataPath, value } = action.payload;
            
            // Find the session
            const sessionIndex = state.sessions.findIndex(session => session.id === sessionId);
            
            if (sessionIndex !== -1) {
                // Parse the dataPath to traverse the nested structure
                // Example: "chat.messages" or "filingView.scrollPosition"
                const pathParts = dataPath.split('.');
                let current = state.sessions[sessionIndex].sessionData;
                
                // Traverse to the parent object of the property we want to update
                for (let i = 0; i < pathParts.length - 1; i++) {
                    // Create the nested structure if it doesn't exist
                    if (!current[pathParts[i]]) {
                        current[pathParts[i]] = {};
                    }
                    current = current[pathParts[i]];
                }
                
                // Update the value at the final path
                current[pathParts[pathParts.length - 1]] = value;
            }
        },
        
        // New action to update the active session's data
        updateActiveSessionData: (state, action) => {
            const { dataPath, value } = action.payload;
            
            if (state.activeSessionId) {
                const sessionIndex = state.sessions.findIndex(session => session.id === state.activeSessionId);
                
                if (sessionIndex !== -1) {
                    // Parse the dataPath to traverse the nested structure
                    const pathParts = dataPath.split('.');
                    let current = state.sessions[sessionIndex].sessionData;
                    
                    // Traverse to the parent object of the property we want to update
                    for (let i = 0; i < pathParts.length - 1; i++) {
                        // Create the nested structure if it doesn't exist
                        if (!current[pathParts[i]]) {
                            current[pathParts[i]] = {};
                        }
                        current = current[pathParts[i]];
                    }
                    
                    // Update the value at the final path
                    current[pathParts[pathParts.length - 1]] = value;
                }
            }
        }
    }
});

// Selectors
export const selectTickerSessions = state => {
    return state.tickerSessions.sessions;
};

export const selectActiveSessionId = state => {
    return state.tickerSessions.activeSessionId;
};

export const selectActiveSession = state => {
    const sessions = state.tickerSessions.sessions;
    const activeSessionId = state.tickerSessions.activeSessionId;
    const activeSession = sessions.find(session => session.id === activeSessionId) || null;
    return activeSession;
};

export const selectHasActiveSessions = state => {
    // Previously this just checked if sessions.length > 0
    // But we need to ensure the sessions array exists first
    const hasSessions = Array.isArray(state.tickerSessions.sessions) && state.tickerSessions.sessions.length > 0;
    return hasSessions;
};

export const selectHasPlaceholder = state => {
    const hasPlaceholder = state.tickerSessions.hasPlaceholder;
    return hasPlaceholder;
};

// New selector to get session data for a specific session
export const selectSessionData = (state, sessionId, dataPath = null) => {
    const session = state.tickerSessions.sessions.find(s => s.id === sessionId);
    
    if (!session) return null;
    
    // If no dataPath is provided, return all session data
    if (!dataPath) return session.sessionData;
    
    // Otherwise, navigate to the specified path
    const pathParts = dataPath.split('.');
    let result = session.sessionData;
    
    for (const part of pathParts) {
        if (!result || !result[part]) return null;
        result = result[part];
    }
    
    return result;
};

// New selector to get data for the active session
export const selectActiveSessionData = (state, dataPath = null) => {
    const activeSessionId = state.tickerSessions.activeSessionId;
    if (!activeSessionId) return null;
    
    return selectSessionData(state, activeSessionId, dataPath);
};

export const { 
    createSession, 
    setActiveSession, 
    closeSession, 
    updateSessionData, 
    updateActiveSessionData,
    createPlaceholderSession
} = tickerSessionsSlice.actions;

export default tickerSessionsSlice.reducer; 