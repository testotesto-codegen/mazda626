import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdClose, MdAdd, MdHome } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    selectTickerSessions,
    selectActiveSessionId,
    setActiveSession,
    closeSession,
    createPlaceholderSession
} from '../../../redux/slices/tickerSessionsSlice';

// Navigation links moved from DashboardNavbar to TickerTabs
const dashboardLinks = [
    {
        id: 1,
        title: 'Valuation',
        path: '/valuation',
        disabled: false
    },
    {
        id: 2,
        title: 'News',
        path: '/news',
        disabled: false
    },
    {
        id: 3,
        title: 'Files',
        path: '/files',
        disabled: false
    },
    {
        id: 4,
        title: 'Equity Report',
        path: '/equity-report',
        disabled: true, // Disabled
        comingSoon: true // Show "Coming Soon" tooltip
    },
    {
        id: 5,
        title: 'Charts',
        path: '/charts',
        disabled: true, // Disabled
        comingSoon: true // Show "Coming Soon" tooltip
    },
];

// Only valuation for private data
const privateDataLinks = [
    {
        id: 1,
        title: 'Valuation',
        path: '/valuation',
        disabled: false
    }
];

// Added for displaying the widget dashboard
const homeLinks = [
    {
        id: 1,
        title: 'Widget Dashboard',
        path: '/dashboard',
        disabled: false
    }
];

const TickerTabs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const sessions = useSelector(selectTickerSessions);
    const activeSessionId = useSelector(selectActiveSessionId);
    const [tooltipVisible, setTooltipVisible] = useState(null);
    const [isHomeActive, setIsHomeActive] = useState(location.pathname === '/dashboard');

    const handleHomeClick = () => {
        setIsHomeActive(true);
        navigate('/dashboard');
    };

    const handleTabClick = (sessionId) => {
        setIsHomeActive(false);

        const clickedSession = sessions.find(session => session.id === sessionId);
        const currentSession = sessions.find(session => session.id === activeSessionId);
        const isClickingPrivateData = clickedSession && clickedSession.ticker === 'PRIVATE_DATA';
        const isCurrentlyPrivateData = currentSession && currentSession.ticker === 'PRIVATE_DATA';
        const isClickingPlaceholder = clickedSession && clickedSession.ticker === 'PLACEHOLDER';

        // If clicking a placeholder, don't do anything (it's already active)
        if (isClickingPlaceholder) return;

        // Set the clicked session as active
        dispatch(setActiveSession(sessionId));

        // Handle navigation based on the session type
        if (location.pathname === '/dashboard') {
            // If we're on the dashboard, always navigate to valuation
            navigate('/valuation');
        } else if (isClickingPrivateData) {
            // If clicking a private data tab, always go to private valuation
            navigate('/valuation/private');
        } else if (isCurrentlyPrivateData && !isClickingPrivateData) {
            // If switching from private data to public data, go to the public valuation home
            if (location.pathname.includes('/valuation')) {
                navigate('/valuation');
            }
        }
    };

    const handleCloseTab = (e, sessionId) => {
        e.stopPropagation(); // Prevent tab activation on close click
        dispatch(closeSession(sessionId));
    };

    const handleAddNewTicker = (e) => {
        e.stopPropagation(); // Prevent other click handlers from firing
        console.log("Add new ticker clicked");

        // Find any existing placeholder session
        const existingPlaceholder = sessions.find(session => session.ticker === 'PLACEHOLDER');

        // If there's already a placeholder, close it first to ensure we create a fresh one
        if (existingPlaceholder) {
            console.log("Closing existing placeholder:", existingPlaceholder.id);
            dispatch(closeSession(existingPlaceholder.id));
        }

        // Always create a new placeholder session
        console.log("Creating new placeholder session");
        dispatch(createPlaceholderSession());

        // Set isHomeActive to false since we're creating a new tab,
        // not switching to the home tab
        setIsHomeActive(false);

        // Navigate to dashboard with a newTab=true parameter to indicate
        // we're creating a new tab rather than viewing the home widgets
        console.log("Navigating to dashboard with newTab=true");
        navigate('/dashboard?newTab=true');
    };

    const handleNavigation = (link) => {
        if (link.disabled) return; // Don't navigate if the link is disabled

        // If already on this path, do nothing
        if (isActivePath(link.path)) return;

        navigate(link.path);
    };

    // Check if the current route matches a navigation link
    const isActivePath = (path) => {
        return location.pathname.startsWith(path);
    };

    // Update the useEffect that sets isHomeActive to account for the newTab parameter
    useEffect(() => {
        // Only set the home tab as active if we're on the dashboard route without the newTab parameter
        const params = new URLSearchParams(location.search);
        const isCreatingNewTab = params.get('newTab') === 'true';

        setIsHomeActive(location.pathname === '/dashboard' && !isCreatingNewTab);
    }, [location.pathname, location.search]);

    // REMOVED: We no longer return null when sessions are empty
    // Instead, we'll always show at least the Home tab

    const activeSession = sessions.find(session => session.id === activeSessionId);

    // Determine if this is a private data session
    const isPrivateData = activeSession && activeSession.ticker === 'PRIVATE_DATA';
    const isPlaceholder = activeSession && activeSession.ticker === 'PLACEHOLDER';

    // Choose which links to display based on session type
    // Don't show any links for placeholder
    const linksToDisplay = isPlaceholder ? [] : isPrivateData ? privateDataLinks : dashboardLinks;

    return (
        <div className="bg-[#121416]">
            {/* Ticker tabs */}
            <div className="w-full flex items-center px-4 pt-2 overflow-x-auto">
                <div className="flex space-x-2">
                    {/* Home Tab - Always present */}
                    <div
                        onClick={handleHomeClick}
                        className={`flex items-center px-4 py-2 rounded-t-lg cursor-pointer transition-colors duration-200 ${
                            isHomeActive
                                ? 'bg-[#40FED1] text-[#121416]'
                                : 'bg-[#1D2022] text-[#F2F2F2] hover:bg-[#393A3D]'
                        }`}
                    >
                        <MdHome className="mr-1" />
                        <span className="font-medium">Home</span>
                    </div>

                    {/* Regular Session Tabs */}
                    {sessions.map((session) => {
                        // Check if this is an active placeholder (for styling purposes)
                        const isActivePlaceholder = session.ticker === 'PLACEHOLDER' &&
                                                   session.id === activeSessionId &&
                                                   !isHomeActive;

                        return (
                            <div
                                key={session.id}
                                onClick={() => handleTabClick(session.id)}
                                className={`flex items-center px-4 py-2 rounded-t-lg cursor-pointer transition-colors duration-200 ${
                                    (session.id === activeSessionId && !isHomeActive) || isActivePlaceholder
                                        ? 'bg-[#40FED1] text-[#121416]'
                                        : 'bg-[#1D2022] text-[#F2F2F2] hover:bg-[#393A3D]'
                                }`}
                            >
                                <span className="font-medium">
                                    {session.ticker === 'PLACEHOLDER' ? 'New Tab' :
                                     session.ticker === 'PRIVATE_DATA' ? 'Private Data' :
                                     session.ticker}
                                </span>
                                <button
                                    onClick={(e) => handleCloseTab(e, session.id)}
                                    className={`ml-2 p-1 rounded-full hover:bg-[#121416] hover:text-white transition-colors duration-200 ${
                                        (session.id === activeSessionId && !isHomeActive) || isActivePlaceholder
                                            ? 'text-[#121416]'
                                            : 'text-[#667177]'
                                    }`}
                                >
                                    <MdClose />
                                </button>
                            </div>
                        );
                    })}
                    <button
                        onClick={handleAddNewTicker}
                        className="flex items-center px-3 py-2 bg-[#1D2022] text-[#667177] rounded-t-lg hover:bg-[#393A3D] transition-colors duration-200"
                    >
                        <MdAdd size={20} />
                    </button>
                </div>
            </div>

            {/* Navigation links - based on active tab type */}
            {/* If home is active, show home links */}
            {isHomeActive && (
                <ul className="flex items-center justify-start gap-4 px-4 pb-3 pt-2 text-white">
                    {homeLinks.map((link) => (
                        <li
                            key={link.id}
                            className={`relative flex justify-center items-center font-normal text-sm
                                ${isActivePath(link.path)
                                    ? 'bg-[#40FED1] text-[#121416]'
                                    : 'bg-[#1D2022] text-[#F2F2F2]'
                                }
                                ${link.disabled
                                    ? 'opacity-60 cursor-not-allowed'
                                    : 'hover:outline hover:outline-2 hover:outline-[#40FED1] cursor-pointer'
                                }
                                rounded-full px-7 py-2`}
                            onClick={() => handleNavigation(link)}
                        >
                            {link.title}
                        </li>
                    ))}
                </ul>
            )}

            {/* Show regular session links if a non-home tab is active */}
            {activeSession && !isPlaceholder && !isHomeActive && (
                <ul className="flex items-center justify-start gap-4 px-4 pb-3 pt-2 text-white">
                    {linksToDisplay.map((link) => (
                        <li
                            key={link.id}
                            onMouseEnter={() => link.comingSoon ? setTooltipVisible(link.id) : null}
                            onMouseLeave={() => setTooltipVisible(null)}
                            className={`relative flex justify-center items-center font-normal text-sm
                                ${isActivePath(link.path) && !link.disabled
                                    ? 'bg-[#40FED1] text-[#121416]'
                                    : 'bg-[#1D2022] text-[#F2F2F2]'
                                }
                                ${link.disabled
                                    ? 'opacity-60 cursor-not-allowed'
                                    : 'hover:outline hover:outline-2 hover:outline-[#40FED1] cursor-pointer'
                                }
                                rounded-full px-7 py-2`}
                            onClick={() => handleNavigation(link)}
                        >
                            {link.title}

                            {/* Coming Soon tooltip */}
                            {tooltipVisible === link.id && link.comingSoon && (
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                                    Coming Soon
                                    <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black rotate-45"></div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TickerTabs;
