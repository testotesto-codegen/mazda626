import { Link } from 'react-router-dom';
import checkIcon from '../../assets/icons/check-icon.svg';
import { motion } from 'framer-motion';

const pricingData = [
	{
		id: 3,
		title: 'Students',
		price: '$0',
		desc: 'Just what you need to save time for your classes and ace your interviews.',
		perks: ['3 models a month', 'Access to new features'],
		path: '/register',
	},
	{
		id: 5,
		title: 'Other',
		price: '$49',
		desc: 'All the essentials for your own analysis, or even secretly at your 9-5... I mean 8-11',
		perks: ['3 models a month', 'Access to new features'],
		path: '/register',
	},
	{
		id: 6,
		title: 'Enterprises',
		desc: 'Fire analysts, hire us.',
		perks: ['X models a month', 'Custom templates', 'Access to new features'],
		path: '/contact-us',
	},
];

// eslint-disable-next-line react/prop-types
const Pricing = ({ plansPage, selectedPlan, setSelectedPlan }) => {
	if (plansPage)
		return (
			<div className="w-full h-full p-3 flex flex-col md:flex-row justify-center items-center gap-6 mt-20 ">
				{pricingData.map((pricing) => (
					<div
						key={pricing.id}
						className={`relative w-80 h-[410px] ${
							selectedPlan === pricing.id ? 'gradient-bg' : 'bg-[#1D2022] hover:gradient-button-border'
						}  px-5 rounded-2xl cursor-pointer `}
						onClick={() => setSelectedPlan(pricing.id)}
					>
						<div className="flex h-[180px] flex-col gap-3 py-4 border-b border-[#373737]">
							<h2 className="text-[#D9D9D9] font-semibold text-lg">{pricing.title}</h2>
							{pricing.title === 'Enterprises' ? (
								<div className=" py-2 text-white text-lg">Contact Us</div>
							) : (
								<div className="flex items-end gap-1 ">
									<span className={`${pricing.title === 'Other' ? 'custom-pricing text-[#727272] ' : 'text-white'}  text-5xl font-normal`}>
										{' '}
										{pricing.price}
									</span>
									<span className="text-lg font-normal text-white">
										{pricing.title === 'Other' && <span className="text-5xl">$0</span>}/ month
									</span>
								</div>
							)}
							<p className={`${selectedPlan === pricing.id ? 'text-white' : 'text-[#7A7A7A]'}  text-sm font-medium`}>{pricing.desc}</p>
						</div>
						<div className="flex flex-col justify-between h-[230px] pb-4 ">
							<div className="py-3 flex flex-col gap-2">
								{pricing.perks.map((perk) => (
									<div key={perk} className={`${selectedPlan === pricing.id ? 'text-white' : 'text-[#808080]'} flex gap-2 `}>
										<img src={checkIcon} alt="check" className="w-4 h-4 pointer-events-none" />
										<span className="text-sm">{perk}</span>
									</div>
								))}
							</div>
							<button
								className={` ${
									selectedPlan === pricing.id
										? ' bg-white text-darkGrey'
										: pricing.title === 'Other'
										? 'gradient-bg rounded-lg text-white'
										: 'gradient-button-border text-white'
								}  w-full py-3  font-normal rounded-md`}
							>
								{pricing.title === 'Enterprises' ? 'Contact Us' : 'Get Started'}
							</button>
						</div>
					</div>
				))}
			</div>
		);

	return (
		<motion.div
			initial={{ opacity: 0, y: 100 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ ease: 'easeOut', duration: 1.5 }}
			viewport={{ once: true }}
			className="w-full h-full p-3 flex flex-col md:flex-row justify-center items-center gap-6 mt-20 "
		>
			{pricingData.map((pricing) => (
				<Link key={pricing.id} to={pricing.path}>
					<div className="relative w-80 h-[410px] bg-[#1D2022]  px-5 rounded-2xl cursor-pointer hover:gradient-button-border">
						<div className="flex h-[180px] flex-col gap-3 py-4 border-b border-[#373737]">
							<h2 className="text-[#D9D9D9] font-semibold text-lg">{pricing.title}</h2>
							{pricing.title === 'Enterprises' ? (
								<div className=" py-2 text-white text-lg">Contact Us</div>
							) : (
								<div className="flex items-end gap-1 ">
									<span className={`${pricing.title === 'Other' ? 'custom-pricing text-[#727272] ' : 'text-white'}  text-5xl font-normal`}>
										{' '}
										{pricing.price}
									</span>
									<span className="text-lg font-normal text-white">
										{pricing.title === 'Other' && <span className="text-5xl">$0</span>}/ month
									</span>
								</div>
							)}
							<p className="text-sm text-[#7A7A7A] font-medium">{pricing.desc}</p>
						</div>
						<div className="flex flex-col justify-between h-[230px] pb-4 ">
							<div className="py-3 flex flex-col gap-2">
								{pricing.perks.map((perk) => (
									<div key={perk} className="flex gap-2 text-[#808080]">
										<img src={checkIcon} alt="check" className="w-4 h-4 pointer-events-none" />
										<span className="text-sm">{perk}</span>
									</div>
								))}
							</div>
							<button
								className={` w-full py-3 text-white font-normal ${
									pricing.title === 'Other' ? 'bg-[#813CF0] hover:bg-[#6324c9]  rounded-lg' : 'gradient-button-border'
								}`}
							>
								{pricing.title === 'Enterprises' ? 'Contact Us' : 'Get Started'}
							</button>
						</div>
					</div>
				</Link>
			))}
		</motion.div>
	);
};

export default Pricing;
