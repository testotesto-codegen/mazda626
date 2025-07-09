import StripeSubscription from '../services/StripeSubscription';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

const plans = [
	{
		id: 3,
		title: 'Students',
		price: '0',
	},
	{
		id: 5,
		title: 'Other',
		price: '0',
	},
];

const Checkout = () => {
	const [searchParams] = useSearchParams();
	const plan = searchParams.get('plan');

	const [selectedPlan, setSelectedPlan] = useState(plan);

	return (
		<div className="auth-wrapper min-h-screen w-full flex justify-center items-center gap-20 ">
			<div className="flex flex-col gap-6 max-w-4xl">
				{plans.map((plan) => (
					<div
						key={plan.id}
						className={`${
							Number(selectedPlan) === plan.id ? 'gradient-bg ' : 'bg-[#1D2022]'
						}  w-[400px] px-3 py-4 rounded-2xl flex flex-col gap-3 cursor-pointer `}
					>
						<h2 className="text-lg font-medium text-[#D9D9D9]">{plan.title}</h2>
						<p className="text-5xl text-white">
							${plan.price}
							<span className="text-lg">/month</span>
						</p>
					</div>
				))}
			</div>
			<StripeSubscription />
		</div>
	);
};

export default Checkout;
