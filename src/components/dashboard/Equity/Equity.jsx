import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import KeyStats from './KeyStats/KeyStats';
import IncomeStatement from './IncomeStatement/IncomeStatement';

const menuItems = [
	{
		id: 1,
		title: 'Key Stats',
		url: '/equity/key-stats',
		component: KeyStats,
	},
	{
		id: 2,
		title: 'I/S',
		url: '/equity/income-statement',
		component: IncomeStatement,
	},
	{
		id: 3,
		title: 'B/S',
		url: '/equity/balance-sheet',
	},
	{
		id: 4,
		title: 'C/F',
		url: '/equity/cash-flow',
	},
	{
		id: 5,
		title: 'Ratios',
		url: '/equity/ratios',
	},
	{
		id: 6,
		title: 'Segments',
		url: '/equity/segments',
	},
	{
		id: 7,
		title: 'Addl',
		url: '/equity/addl',
	},
	{
		id: 8,
		title: 'ESG',
		url: '/equity/esg',
	},
];

const subMenu = [
	{
		id: 1,
		title: 'Overview',
	},
	{
		id: 2,
		title: 'Company Model',
	},
	{
		id: 3,
		title: 'Earnings',
	},
	{
		id: 4,
		title: 'Enterprise Value',
	},
	{
		id: 5,
		title: 'EV Ex Operating Leases',
	},
	{
		id: 6,
		title: 'Multiples',
	},
	{
		id: 7,
		title: 'Per Share',
	},
	{
		id: 8,
		title: 'Stock Value',
	},
	{
		id: 9,
		title: 'Options',
	},
];

const Equity = () => {
	const location = useLocation();
	const pathname = location.pathname;
	const hash = location.hash;
	const fixedHash = hash.replace('#', '');
	const decodedHash = decodeURIComponent(fixedHash);
	const naviagte = useNavigate();
	const query = location.search;
	//console.log(query);
	const ticker = query.split('=')[1];
	console.log('ticker', ticker);

	return (
		<>
			<div className="flex justify-between items-center py-3 px-5 mb-3">
				<div className="flex items-center">
					<h2 className="text-2xl py-3 mr-5 text-white font-semibold border-b-4 border-[#8E5DEC] flex gap-2">
						{ticker}
						<span className="font-normal">US Equity</span>
					</h2>
					<div className="mt-3 space-x-3">
						<span className="text-[#8E5DEC] text-lg">423.53</span>
						<span className="text-[#8E5DEC] text-lg">+5.61</span>
					</div>
				</div>
				<button className="bg-[#803CF0] rounded-full py-2 px-5 h-full font-semibold text-sm text-[#F2F2F2] flex justify-center items-center">
					Generate Report
				</button>
			</div>
			<nav className="max-w-5xl  px-2">
				<ul className="flex justify-between">
					{menuItems.map((item) => (
						<NavLink
							className={({ isActive, isPending }) =>
								`${isActive ? 'bg-[#8E5DEC]' : ''} 
                                 ${isPending ? 'text-yellow-500' : ''} 
                                 text-white text-sm font-medium rounded-t-xl py-2 w-[100px] text-center bg-[#343434] hover:bg-[#8E5DEC]`
							}
							key={item.id}
							to={`${item.url + query}`}
						>
							{item.title}
						</NavLink>
					))}
				</ul>
				<ul className="bg-[#232729] flex gap-5 py-3 justify-between px-2 rounded-b-xl">
					{subMenu.map((item) => (
						<NavLink
							className={`${
								decodedHash === item.title ? 'bg-[#8E5DEC]' : ''
							} text-xs text-white font-medium py-1 px-2 rounded-lg hover:bg-[#8E5DEC] cursor-pointer`}
							key={item.id}
							//onClick={() => naviagte(`${query} + #${item.title}`)}
							to={`${pathname + query}#${item.title}`}
						>
							{item.title}
						</NavLink>
					))}
				</ul>
			</nav>
			{
				// Render the component based on the pathname
				menuItems.map((item) => {
					if (pathname === item.url) {
						const Component = item.component;
						return <Component key={item.id} hash={decodedHash} />;
					}
					return null;
				})
			}
		</>
	);
};

export default Equity;
//text-white text-sm font-medium rounded-t-xl py-2 w-[100px] text-center bg-[#343434] hover:bg-[#8E5DEC]
