import Pricing from '../components/common/Pricing';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const plans = [
	{
		id: 1,
		title: 'Basic',
		price: '50',
	},
	{
		id: 2,
		title: 'Standard',
		price: '79',
	},
	{
		id: 3,
		title: 'Premium',
		price: '99',
	},
];

const PricingPlan = () => {
	const navigate = useNavigate();
	const [selectedPlan, setSelectedPlan] = useState(null);
	const [loading, setLoading] = useState(false);
	const [searchParams] = useSearchParams();
	const checkout = searchParams.get('checkout');

	const handlePlanSelection = async () => {
		try {
			if (checkout === 'true') {
				navigate(`/checkout?plan=${selectedPlan}`);
			} else {
				setLoading(true);
				const response = await fetch(`${import.meta.env.VITE_API}/api/v1/early-user`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({
						planId: selectedPlan,
					}),
				});

				if (response.ok) {
					setLoading(false);
					navigate('/dashboard');
				} else {
					setLoading(false);
					alert('Something went wrong');
				}
			}
		} catch (error) {
			setLoading(false);
			console.error(error);
			alert(error.message);
		}
	};

	return (
		<div className="w-full min-h-screen p-10 flex flex-col gap-12 auth-wrapper">
			<div className="space-x-2 text-center font-semibold text-4xl w-full">
				<span className="text-white">Free For</span>
				<span className="gradient-text">Our Early Supporters</span>
			</div>
			<Pricing setSelectedPlan={setSelectedPlan} selectedPlan={selectedPlan} plansPage={true} />
			<button
				disabled={!selectedPlan || loading}
				className={`${
					selectedPlan ? 'gradient-bg' : loading ? 'bg-gray-600' : 'gradient-border'
				}  text-lg rounded-xl text-white  mx-auto py-2 px-36 `}
				onClick={handlePlanSelection}
			>
				{loading ? 'Please Wait...' : 'Next'}
			</button>
		</div>
	);
};

export default PricingPlan;
