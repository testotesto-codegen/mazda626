import { MdOutlineCircle } from 'react-icons/md';
import { useState } from 'react';

const plans = [
	{
		id: 1,
		title: 'Basic',
		price: 80,
		description: [
			{
				id: 1,
				text: '3 Projects limit',
			},
			{
				id: 2,
				text: 'Free mockup items and content',
			},
			{
				id: 3,
				text: 'Only one page in projects',
			},
			{
				id: 4,
				text: 'Personal license for hobby usage',
			},
		],
	},
	{
		id: 2,
		title: 'Premium',
		price: 100,
		description: [
			{
				id: 1,
				text: '3 Projects limit',
			},
			{
				id: 2,
				text: 'Free mockup items and content',
			},
			{
				id: 3,
				text: 'Only one page in projects',
			},
			{
				id: 4,
				text: 'Personal license for hobby usage',
			},
		],
	},
	{
		id: 3,
		title: 'Enterprise',
		price: 499,
		description: [
			{
				id: 1,
				text: '3 Projects limit',
			},
			{
				id: 2,
				text: 'Free mockup items and content',
			},
			{
				id: 3,
				text: 'Only one page in projects',
			},
			{
				id: 4,
				text: 'Personal license for hobby usage',
			},
		],
	},
];

const PaymentPlan = () => {
	const [selectedPlan, setSelectedPlan] = useState(plans[1].id);

	return (
		<div className="pt-6 px-6 pb-10 border-b-2 border-[#2D3133] ">
			<h2 className="text-[#D2DDE5] text-sm font-normal mb-5">Payment Plan</h2>
			<ul className="flex justify-center gap-4">
				{plans.map((plan) => (
					<li
						onClick={() => setSelectedPlan(plan.id)}
						key={plan.id}
						className={`w-[300px] bg-[#1D2022] p-4 rounded-xl ${
							selectedPlan === plan.id ? 'outline outline-1 outline-[#37CAA8]' : ''
						}  hover:outline hover:outline-1 hover:outline-[#37CAA8]`}
					>
						<h2 className="text-[#D2DDE5] text-base font-medium mb-2">
							{plan.title}{' '}
							{selectedPlan === plan.id && (
								<span className="text-xs font-normal py-1 px-3 ml-1 rounded-full bg-[#37CAA833]">
									Active
								</span>
							)}
						</h2>
						<p className="text-xs font-medium text-[#667177] ">
							Everything you need to start creating
						</p>

						<h3 className="text-3xl text-[#D2DDE5] font-medium my-5">
							${plan.price}
							<span className="text-sm font-normal">/Monthly</span>
						</h3>
						<ul className="text-[#797979] text-xs font-medium flex flex-col gap-2">
							{plan.description.map((desc) => (
								<li key={desc.id} className="flex items-center gap-2">
									<MdOutlineCircle size={14} />
									{desc.text}
								</li>
							))}
						</ul>
						<button
							className={`${
								plan.id === selectedPlan
									? 'bg-[#37CAA8] text-[#232729]'
									: 'bg-[#232729] text-[#D2DDE5]'
							} mt-4 text-center w-full rounded-full py-2 text-sm font-normal`}
						>
							Upgrade
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default PaymentPlan;
