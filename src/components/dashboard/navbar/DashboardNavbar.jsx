import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchInputContainer from './SearchInputContainer';
import { FaUserCircle } from 'react-icons/fa';
import { selectActiveSession } from '../../../redux/slices/tickerSessionsSlice';

const DashboardNavbar = () => {
	const user = useSelector((state) => state.user);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const dropdownRef = useRef(null);
	const dispatch = useDispatch();
	const activeSession = useSelector(selectActiveSession);

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
				<div className="absolute right-4">
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
