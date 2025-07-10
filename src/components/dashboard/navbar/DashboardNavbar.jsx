import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchInputContainer from './SearchInputContainer';
import { FaUserCircle } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import { selectActiveSession } from '../../../redux/slices/tickerSessionsSlice';
import { toggleDarkMode, selectIsDarkMode } from '../../../redux/slices/themeSlice';

const DashboardNavbar = () => {
	const user = useSelector((state) => state.user);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const dropdownRef = useRef(null);
	const dispatch = useDispatch();
	const activeSession = useSelector(selectActiveSession);
	const isDarkMode = useSelector(selectIsDarkMode);

	const handleThemeToggle = () => {
		dispatch(toggleDarkMode());
	};

	// Function to handle clicks outside the dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }

        // Add event listener when dropdown is open
        if (isProfileOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileOpen]);

	return (
		<div className="w-full bg-[#121416] text-[#667177] max-w-[1750px] xl:mx-auto">
			<div className="flex items-center p-4 h-[80px] relative" style={{ backgroundColor: '#000000' }}>
				<div className="absolute left-4">
					<SearchInputContainer />
				</div>
				<h2 className="text-3xl font-semibold text-white mx-auto">
					<Link to="/dashboard">accelno</Link>
					{activeSession && (
						<span className="ml-4 text-lg font-normal text-[#40FED1]">
							{activeSession.ticker}
						</span>
					)}
				</h2>
				<div className="absolute right-4 flex items-center gap-3">
					{/* Theme Toggle Button */}
					<button
						onClick={handleThemeToggle}
						className="
							relative inline-flex items-center justify-center
							w-10 h-10 rounded-lg
							bg-gray-100 hover:bg-gray-200 
							dark:bg-gray-800 dark:hover:bg-gray-700
							text-gray-600 dark:text-gray-300
							transition-all duration-200 ease-in-out
							focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
							dark:focus:ring-offset-gray-800
						"
						title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
						aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
					>
						<div className="relative w-5 h-5">
							{isDarkMode ? (
								<FiSun className="w-5 h-5 transition-transform duration-200 rotate-0" />
							) : (
								<FiMoon className="w-5 h-5 transition-transform duration-200 rotate-0" />
							)}
						</div>
					</button>

					{/* User Profile Dropdown */}
					<div className="bg-[#1D2022] px-4 h-full py-1 rounded-full flex items-center gap-2 relative" onClick={() => setIsProfileOpen(!isProfileOpen)} ref={dropdownRef}>
						<h2 className="text-xs font-semibold text-white">{user.user.username}</h2>
						<FaUserCircle size={40} className="text-gray-500" />
						{isProfileOpen && (
							<div className="absolute right-0 top-[90%] mt-2 w-40 bg-[#1D2022] shadow-lg rounded-lg z-50">
								<ul className="py-2 text-white">
									<Link to="/logout"><li className="p-2 px-4 m-2 rounded-full border-[#1D2022] border-2 hover:border-red-800 cursor-pointer">Logout</li></Link>
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardNavbar;
