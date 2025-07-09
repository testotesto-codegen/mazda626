import githubIcon from '../../assets/social/github-icon.png';
import redditIcon from '../../assets/social/reddit-icon.png';
import twitterIcon from '../../assets/social/twitter-icon.png';
import discordIcon from '../../assets/social/discord-icon.png';
import { MdDehaze } from 'react-icons/md';
import accelnoLogo from '../../assets/logos/accelno-logo.svg';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaChevronUp, FaUsers, 
			FaHome, FaCalculator, FaMoneyBill, FaBalanceScale, FaMoneyBillWave, 
			FaNetworkWired, FaFilter, FaBrain, FaResearchgate } from 'react-icons/fa';
import { useState } from 'react';

const menuLinks = [
	{
		id: 1,
		text: 'Services',
		path: '/services',
	},
	{
		id: 2,
		text: 'Solutions',
		path: '/solutions',
	},
	{
		id: 3,
		text: 'Roadmap',
		path: '/roadmap',
	},
	{
		id: 4,
		text: 'Whitepaper',
		path: '/whitepaper',
	},
];

const socialLinks = [
	{
		id: 1,
		img: githubIcon,
	},

	{
		id: 2,
		img: discordIcon,
	},
	{
		id: 3,
		img: redditIcon,
	},
	{
		id: 4,
		img: twitterIcon,
	},
];

const useCases = [
	{
		text: "Hedge Funds",
		icon: <FaBriefcase className='text-[#7D7BFF]' />
	},
	{
		text: "Private Equity",
		icon: <FaUsers className='text-[#7D7BFF]' />
	},
	{
		text: "Home Offices",
		icon: <FaHome className='text-[#7D7BFF]' />
	},
	{
		text: "Excel Add-on",
		icon: <FaCalculator className='text-[#7D7BFF]' />
	}
]

const features = [
	{
		text: "DCF",
		icon: <FaMoneyBill className='text-[#7D7BFF]' />
	},
	{
		text: "LBO",
		icon: <FaMoneyBillWave className='text-[#7D7BFF]' />
	},
	{
		text: "COMPS",
		icon: <FaBalanceScale className='text-[#7D7BFF]' />
	},
	{
		text: "Accelno AI",
		icon: <FaNetworkWired className='text-[#7D7BFF]' />
	},
	{
		text: "Screeners",
		icon: <FaFilter className='text-[#7D7BFF]' />
	},
	{
		text: "Smart Widgets",
		icon: <FaBrain className='text-[#7D7BFF]' />
	},
	{
		text: "AI Research",
		icon: <FaResearchgate className='text-[#7D7BFF]' />
	}
]

const Navbar = () => {
	const [currentlyViewing, setCurrentlyViewing] = useState("");

	return (
		<div>
			<div className="relative top-0 right-0 left-0 font-poppins py-8 px-10 flex items-center">
				<Link to="/" className="text-white text-xl md:text-5xl font-medium">
					accelno
				</Link>

				<div className='ml-auto flex'>
					<Link to="/" className='text-white mr-8'>
						Home
					</Link>

					<button type='button'
							className='text-white flex mr-8'
							onClick={() => {
								if (currentlyViewing === "useCases") {
									setCurrentlyViewing("");
								} else {
									setCurrentlyViewing("useCases");
								}
								}}>
						Use Cases
						<div className={`${currentlyViewing == "useCases" ? 
											"rotate-180": 
											"rotate-0"} 
										ml-2 mt-1 transition-transform duration-300`}>
							<FaChevronUp></FaChevronUp>
						</div>
					</button>
					<button type='button'
							className='text-white flex'
							onClick={() => {
								if (currentlyViewing === "features") {
									setCurrentlyViewing("");
								} else {
									setCurrentlyViewing("features");
								}
								}}>
						Features
						<div className={`${currentlyViewing == "features" ? 
											"rotate-180": 
											"rotate-0"} 
										ml-2 mt-1 transition-transform duration-300`}>
							<FaChevronUp></FaChevronUp>
						</div>
					</button>
				</div>
				

				<Link to="/login" className='ml-auto'>
					<button className="py-1 px-4 md:py-3 md:px-12 text-white font-medium text-sm md:text-lg gradient-border rounded-2xl">
						Log In
					</button>
				</Link>
			</div>

			<div className={`
				transition-opacity duration-300 absolute w-full z-[100]
					${currentlyViewing === "useCases" ? 'opacity-100' : 'opacity-0'} 
					pointer-events-${currentlyViewing === "useCases" ? 'auto' : 'none'}
				flex flex-wrap justify-center bg-[#121416] p-10`}>
				{useCases.map((useCase) => {
					return (
						<Link to="/login" className='flex p-4 items-center m-2'>
							<span
								className='mr-4 p-4 bg-[#D9D9D9] rounded-lg'>
									{useCase.icon}
							</span>
							<span
								className='text-white'>
									{useCase.text}
							</span>
						</Link>
					)
				})}
			</div>


			<div className={`
				transition-opacity duration-300 absolute w-full z-[100]
					${currentlyViewing === "features" ? 'opacity-100' : 'opacity-0'} 
					pointer-events-${currentlyViewing === "features" ? 'auto' : 'none'}
				grid grid-cols-4 justify-center bg-[#121416] p-10`}>
				{features.map((feature) => {
					return (
						<Link to="/login" className='flex p-4 items-center m-2'>
							<span
								className='mr-4 p-4 bg-[#D9D9D9] rounded-lg'>
									{feature.icon}
							</span>
							<span
								className='text-white'>
									{feature.text}
							</span>
						</Link>
					)
				})}
			</div>


		</div>
	);
};

export default Navbar;

/*

<div className="flex justify-center px-3 md:hidden text-3xl text-white">
					<span>
						{' '}
						<MdDehaze />
					</span>
				</div>

				<div className="hidden md:flex  space-x-6">
					{menuLinks.map((item) => (
						<span key={item.id} className=" text-lg font-normal text-white">
							{item.text}
						</span>
					))}
				</div>
				<div className="hidden space-x-4 md:flex">
					{socialLinks.map((item) => (
						<img key={item.id} src={item.img} alt="social" className="h-5" />
					))}
				</div>


*/
