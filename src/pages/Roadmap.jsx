import { motion } from 'framer-motion';
import { MdArrowForwardIos } from 'react-icons/md';

const Roadmap = () => {
	return (
		<>
			<div className="pt-36 pb-16 px-16 w-full max-w-[1440px] mx-auto">
				<motion.h1
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ease: 'easeOut', duration: 1.5 }}
					viewport={{ once: true }}
					className=" text-center gradient-text font-bold text-3xl lg:text-5xl p-2"
				>
					Finance Is Becoming Faster
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ease: 'easeOut', duration: 1.8 }}
					viewport={{ once: true }}
					className=" text-center text-[#8E8E8E] text-sm lg:text-base font-normal mt-1"
				>
					We&apos;re making sure of it
				</motion.p>

				<motion.h2
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 3 }}
					viewport={{ once: true }}
					className="font-bold text-left text-white text-2xl lg:text-4xl mt-8"
				>
					Our Roadmap
				</motion.h2>

				<section className="flex flex-col lg:flex-row  items-start mt-10 gap-36 text-white">
					<motion.div
						initial={{ opacity: 0, y: 100 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 3.5 }}
						viewport={{ once: true }}
						className="flex flex-col gap-5"
					>
						<h3 className="gradient-text text-3xl font-semibold">Valuation</h3>
						<div className="flex flex-col gap-3">
							<h4 className="font-semibold text-2xl"> DCF Automation - Public Companies </h4>
							<div className="ml-10 flex flex-col font-light text-xl gap-1 ">
								<span className="  hover:text-[#3473EA] cursor-default flex items-center group/item transition-colors">
									<MdArrowForwardIos size={20} className="bg-[#381EDA] p-1 text-white mr-2 invisible group-hover/item:visible " />

									<span>Public Companies</span>
								</span>
								<span className="hover:text-[#3473EA] cursor-default flex items-center group/item transition-colors">
									<MdArrowForwardIos size={20} className="bg-[#381EDA] p-1 text-white mr-2 invisible group-hover/item:visible " />

									<span>Private Companies</span>
								</span>
								<span className="hover:text-[#3473EA] cursor-default flex items-center group/item transition-colors">
									<MdArrowForwardIos size={20} className="bg-[#381EDA] p-1 text-white mr-2 invisible group-hover/item:visible " />

									<span>AI Research-Based Assumptions</span>
								</span>
							</div>
						</div>
						<div className="flex flex-col gap-3">
							<h4 className="font-semibold text-2xl"> More Financial Models</h4>
							<div className="ml-10 flex flex-col font-light text-xl gap-1">
								<span className="hover:text-[#3473EA] cursor-default flex items-center group/item transition-colors">
									<MdArrowForwardIos size={20} className="bg-[#381EDA] p-1 text-white mr-2 invisible group-hover/item:visible " />
									<span>Comparable Company Analysis</span>
								</span>
								<span className="hover:text-[#3473EA] cursor-default flex items-center group/item transition-colors">
									<MdArrowForwardIos size={20} className="bg-[#381EDA] p-1 text-white mr-2 invisible group-hover/item:visible " />
									<span>Leveraged Buyout</span>
								</span>
							</div>
						</div>
						<h4 className="font-semibold text-2xl"> Built-In Training</h4>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 100 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 4 }}
						viewport={{ once: true }}
						className="flex flex-col gap-5"
					>
						<h3 className="gradient-text text-3xl font-semibold">Terminal</h3>
						<div className="flex flex-col gap-3">
							<h4 className="font-semibold text-2xl">The Widget System</h4>
							<div className="ml-10 flex flex-col font-light text-xl gap-1">
								<span className="hover:text-[#3473EA] cursor-default flex items-center group/item transition-colors">
									<MdArrowForwardIos size={20} className="bg-[#381EDA] p-1 text-white mr-2 invisible group-hover/item:visible " />
									<span>Efficient Widgets</span>
								</span>
								<span className="hover:text-[#3473EA] cursor-default flex items-center group/item transition-colors">
									<MdArrowForwardIos size={20} className="bg-[#381EDA] p-1 text-white mr-2 invisible group-hover/item:visible " />
									<span>AI-Powered Widgets</span>
								</span>
								<span className="hover:text-[#3473EA] cursor-default flex items-center group/item transition-colors">
									<MdArrowForwardIos size={20} className="bg-[#381EDA] p-1 text-white mr-2 invisible group-hover/item:visible " />
									<span>Integration internally & externally</span>
								</span>
							</div>
						</div>
						<div className="flex flex-col gap-3">
							<h4 className="font-semibold text-2xl"> Community</h4>
							<div className=" ml-10 flex flex-col font-light text-xl gap-1">
								<span className="hover:text-[#3473EA] cursor-default flex items-center group/item transition-colors">
									<MdArrowForwardIos size={20} className="bg-[#381EDA] p-1 text-white mr-2 invisible group-hover/item:visible " />
									<span>MarketPlace</span>
								</span>
								<span className="hover:text-[#3473EA] cursor-default flex items-center group/item transition-colors">
									<MdArrowForwardIos size={20} className="bg-[#381EDA] p-1 text-white mr-2 invisible group-hover/item:visible " />
									<span>Selected External Tools</span>
								</span>
							</div>
						</div>
						<h4 className="font-semibold text-2xl"> Education</h4>
					</motion.div>
				</section>
			</div>

			<footer className="px-8 max-w-[1240px] text-[#888888] text-xs font-medium border-t border-[#424242] py-4 w-full  mx-auto flex flex-col gap-4 md:gap-0 md:flex-row  md:justify-between">
				<p className="">Copyright Accelno 2023</p>
				<p className="text-[#F0F0F0] text-sm font-normal">Questions & Comments</p>
				<div className="flex flex-col md:flex-row gap-3">
					<span>Privacy Policy</span>
					<span>Terms of Service</span>
				</div>
			</footer>
		</>
	);
};

export default Roadmap;
