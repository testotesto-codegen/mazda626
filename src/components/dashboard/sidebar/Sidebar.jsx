import { useState } from 'react';

import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../../../redux/slices/authSlice';
import { toggleDarkMode } from '../../../redux/slices/themeSlice';
import homeIcon from '../../../assets/icons/home-icon.svg';
import widgetsIcon from '../../../assets/icons/widget-icon.svg';
import vectorIcon from '../../../assets/icons/vector-icon.svg';
import chartsIcon from '../../../assets/icons/charts-icon.svg';
import calendarIcon from '../../../assets/icons/calendar-icon.svg';
import lightModeIcon from '../../../assets/icons/lightmode-icon.svg';
import userIcon from '../../../assets/icons/user-icon.svg';
import accountIcon from '../../../assets/icons/account-icon.svg';
import logoutIcon from '../../../assets/icons/logout-icon.svg';
import accelnoLogo from '../../../assets/icons/accelno-logo.svg';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

const sidebarItems = [
	{
		id: 1,
		icon: homeIcon,
		title: 'Dashboard',
	},
	{
		id: 2,
		icon: widgetsIcon,
		title: 'Widgets',
	},
	{
		id: 3,
		icon: vectorIcon,
		title: 'Valuation',
	},
	{
		id: 4,
		icon: chartsIcon,
		title: 'Charts',
	},
	{
		id: 5,
		icon: calendarIcon,
		title: 'Calendar',
	},
];

const sidebarItems2 = [
	{
		id: 6,
		icon: lightModeIcon,
		title: 'Light/Dark Mode',
	},
	{
		id: 7,
		icon: userIcon,
		title: 'Profile',
	},
	{
		id: 8,
		icon: accountIcon,
		title: 'Account',
	},
	{
		id: 9,
		icon: logoutIcon,
		title: 'Logout',
	},
];

const Sidebar = () => {
	const [active, setActive] = useState(false);
	const dispatch = useDispatch();
	return (
		<div
			className={`${!active ? ' -left-48' : 'left-0'} fixed top-0 bottom-0  z-50 bg-[#121416]   text-[#667177] w-64 h-screen space-y-4
			transition-all duration-200 ease-in
			`}
		>
			<div className={` py-3 flex  ${active ? 'justify-center' : 'justify-end'}`}>
				<img src={accelnoLogo} alt="Logo" className=" w-12 " />
			</div>

			<div
				onClick={() => setActive(!active)}
				className="cursor-pointer absolute top-12 -right-2 p-1 bg-[#393A3D] text-[#667177] flex items-center"
			>
				{active ? <MdArrowBackIos /> : <MdArrowForwardIos />}
			</div>
			<div className="flex flex-col justify-between gap-14 h-full max-h-[850px]">
				<div className="w-full h-full">
					{sidebarItems.map((item) => (
						<div
							key={item.id}
							className={`${!active && 'justify-end'} cursor-pointer hover:bg-[#1D2022]  flex items-center py-3 px-6 space-x-4 `}
						>
							<img src={item.icon} alt="" className="w-4" />
							{active && <span className="font-normal text-[#667177]"> {item.title} </span>}
						</div>
					))}
				</div>

				<div className="w-full h-full">
					{sidebarItems2.map((item) => (
						<div
							key={item.id}
							className={`${!active && 'justify-end'}  cursor-pointer hover:bg-[#1D2022]  flex items-center py-3 px-6 space-x-4 `}
							onClick={() => {
								if (item.title === 'Logout') {
									dispatch(logoutSuccess());
								} else if (item.title === 'Light/Dark Mode') {
									dispatch(toggleDarkMode());
								}
							}}
						>
							<img src={item.icon} alt="" className="w-4" />
							{active && (
								<div className="flex justify-between w-full">
									<span className="font-normal text-[#667177]"> {item.title} </span>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
