import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import DashboardNavbar from '../components/dashboard/navbar/DashboardNavbar';
import TickerTabs from '../components/dashboard/TickerSessions/TickerTabs';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from './../redux/slices/themeSlice';
import { selectHasActiveSessions, selectActiveSession, selectTickerSessions } from '../redux/slices/tickerSessionsSlice';

const DashboardLayout = () => {
	const isDarkMode = useSelector(selectIsDarkMode);
	const hasActiveSessions = useSelector(selectHasActiveSessions);
	const activeSession = useSelector(selectActiveSession);
	const allSessions = useSelector(selectTickerSessions);
	const navigate = useNavigate();
	const location = useLocation();

	// Redirect to dashboard home if no active sessions and not already on dashboard
	useEffect(() => {
		const isOnDashboard = location.pathname === '/dashboard';
		
		if (!hasActiveSessions && !isOnDashboard) {
			navigate('/dashboard');
		}
	}, [hasActiveSessions, navigate, location.pathname]);

	return (
		<main className={`${isDarkMode ? 'dark' : ''} flex flex-col min-h-screen`}>
			<DashboardNavbar />
			<TickerTabs />
			<Outlet />
		</main>
	);
};

export default DashboardLayout;
