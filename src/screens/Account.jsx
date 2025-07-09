import userAvatar from '../assets/icons/user-avatar.png';
import { MdOutlineSend, MdOutlineMail, MdOutlineInbox } from 'react-icons/md';
import PaymentPlan from '../components/dashboard/Account/PaymentPlan';
import BillingHistory from '../components/dashboard/Account/BillingHistory';

const Account = () => {
	return (
		<div className="bg-[#000] text-white flex justify-center p-3">
			<aside className="flex flex-col gap-3 px-2">
				<div className="bg-[#232729] rounded-xl w-[320px]">
					<h2 className="bg-[#191B1D] py-2 px-3 rounded-t-xl text-sm text-[#D2DDE5]">My Account</h2>
					<div className="flex justify-between p-4">
						<div className="flex flex-col justify-between gap-5 text-xs">
							<span className="flex flex-col gap-2 text-[#667177] font-light">
								First Name
								<span className="text-[#D2DDE5] font-medium">John</span>
							</span>
							<span className="flex flex-col gap-2 text-[#667177] font-light">
								Last Name
								<span className="text-[#D2DDE5] font-medium">Doe</span>
							</span>
							<span className="flex flex-col gap-2 text-[#667177] font-light">
								Email
								<span className="text-[#D2DDE5] font-medium">john@gmail.com</span>
							</span>
						</div>
						<div className="flex flex-col justify-between items-center">
							<img src={userAvatar} alt="" className="h-16 w-16 rounded-full" />
							<button className="bg-[#191B1D] cursor-pointer py-2 px-5 rounded-full text-sm font-normal text-[#808080]">
								Edit Profile
							</button>
						</div>
					</div>
				</div>
				<div className="bg-[#232729] rounded-xl w-[320px]">
					<h2 className="bg-[#191B1D] py-2 px-3 rounded-t-xl text-sm">Credits</h2>
					<div className="p-4">
						<h3 className="text-3xl font-medium text-[#D2DDE5]">125</h3>
						<p className="mt-2 mb-4 text-[#667177] text-xs">Generation credits remain to be used</p>
						<button className="bg-[#191B1D] block ml-auto cursor-pointer py-2 px-5 rounded-full text-sm font-normal text-[#808080]">
							Get more
						</button>
					</div>
				</div>
				<div className="bg-[#232729] rounded-xl w-[320px]">
					<h2 className="bg-[#191B1D] py-2 px-3 rounded-t-xl text-sm">Refer</h2>
					<div className="p-4">
						<p className="mt-2 my-4 text-[#667177] text-xs">Invite your Friends</p>
						<p
							onClick={() => {
								navigator.clipboard.writeText('https://www.figma.com/');
							}}
							className="w-full rounded-full p-3 bg-[#1F2224] text-[#D2DDE5] text-xs font-normal"
						>
							com/shots/22623198-Finance-
						</p>
						<div className="flex justify-end gap-1 mt-2">
							<button className="bg-[#191B1D] text-[#D2DDE5] p-3 rounded-full">
								<MdOutlineInbox size={20} />
							</button>
							<button className="bg-[#191B1D] text-[#D2DDE5] p-3 rounded-full">
								<MdOutlineMail size={20} />
							</button>
							<button className="bg-[#191B1D] text-[#D2DDE5] p-3 rounded-full">
								<MdOutlineSend size={20} />
							</button>
						</div>
					</div>
				</div>
			</aside>
			<section className="min-h-full w-full max-w-7xl rounded-xl bg-[#232729]">
				<nav className="bg-[#191B1D] w-full p-2 rounded-t-xl">
					<ul className="flex gap-5">
						<li className="bg-[#232729] text-sm font-normal text-[#fff] text-center py-2 px-5 rounded-full cursor-pointer hover:outline hover:outline-2 hover:outline-[#40FED1] ">
							Membership
						</li>
						<li className="bg-[#232729] text-sm font-normal text-[#fff] text-center py-2 px-5 rounded-full cursor-pointer hover:outline hover:outline-2 hover:outline-[#40FED1] ">
							Payment Plan
						</li>
						<li className="bg-[#232729] text-sm font-normal text-[#fff] text-center py-2 px-5 rounded-full cursor-pointer hover:outline hover:outline-2 hover:outline-[#40FED1] ">
							Billing History
						</li>
						<li className="bg-[#232729] text-sm font-normal text-[#fff] text-center py-2 px-5 rounded-full cursor-pointer hover:outline hover:outline-2 hover:outline-[#40FED1] ">
							Payment Methods
						</li>
						<li className="bg-[#232729] text-sm font-normal text-[#fff] text-center py-2 px-5 rounded-full cursor-pointer hover:outline hover:outline-2 hover:outline-[#40FED1] ">
							Credits
						</li>
					</ul>
				</nav>
				<div className="pt-6 px-6 pb-10 border-b-2 border-[#2D3133]">
					<h2 className="text-[#D2DDE5] text-sm font-normal mb-5">Membership</h2>
					<div className="mb-3 text-xs w-1/2 flex justify-between">
						<span className="text-[#667177]">Member Since:</span>
						<span className="text-[#D2DDE5]">12/12/2021</span>
					</div>
					<div className="text-xs w-1/2 flex justify-between">
						<span className="text-[#667177]">Membership Expires:</span>
						<span className="text-[#D2DDE5]">12/12/2021</span>
					</div>
				</div>
				<PaymentPlan />
				<BillingHistory />
			</section>
		</div>
	);
};

export default Account;
