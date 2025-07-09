import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../../client/Client';
import { FaSpinner } from 'react-icons/fa';

const Plan = () => {
	const [selectedPlan, setSelectedPlan] = useState('standard');
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [subscriptionDetails, setSubscriptionDetails] = useState(null);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	
	// Fetch current subscription status on load
	useEffect(() => {
		const checkSubscription = async () => {
			try {
				setIsLoading(true);
				const response = await client.getSubscriptionDetails();
				
				if (response.status === 200) {
					setSubscriptionDetails(response.data);
					// If subscription exists, set selected plan accordingly
					setSelectedPlan(response.data ? 'standard' : 'basic');
				} else {
					// Fallback to simple subscription check
					console.log("Falling back to basic subscription check");
					const fallbackCheck = await client.checkSubscription();
					if (fallbackCheck.has_subscription) {
						setSubscriptionDetails({
							status: 'active',
							plan: 'Accelno Monthly Subscription'
						});
						setSelectedPlan('standard');
					} else {
						setSubscriptionDetails(null);
						setSelectedPlan('basic');
					}
				}
			} catch (err) {
				console.error('Error checking subscription:', err);
				setError('Error fetching subscription details');
				
				// Try fallback method if main method fails
				try {
					const fallbackCheck = await client.checkSubscription();
					if (fallbackCheck.has_subscription) {
						setSubscriptionDetails({
							status: 'active',
							plan: 'Accelno Monthly Subscription'
						});
						setSelectedPlan('standard');
					}
				} catch (fallbackErr) {
					console.error('Error in fallback subscription check:', fallbackErr);
				}
			} finally {
				setIsLoading(false);
			}
		};
		
		checkSubscription();
	}, []);
	
	const handlePlanSelection = (plan) => {
		setSelectedPlan(plan);
	};
	
	const handleSavePlan = async () => {
		try {
			setIsSaving(true);
			setError('');
			
			if (selectedPlan === 'basic') {
				// Basic plan is free, so just show success
				setTimeout(() => {
					setIsSaving(false);
				}, 1000);
				return;
			}
			
			// For paid plans, redirect to subscription page
			navigate('/subscription');
		} catch (err) {
			console.error('Error saving plan:', err);
			setError('Failed to save plan. Please try again.');
			setIsSaving(false);
		}
	};
	
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-8">
				<FaSpinner className="animate-spin text-[#40FED1] text-4xl" />
			</div>
		);
	}
	
	return (
		<div className="flex flex-col border-t border-[#A7A8AB] py-4 gap-6 font-inter">
			{error && (
				<div className="bg-red-800 bg-opacity-30 p-3 rounded mb-4 text-red-300">
					{error}
				</div>
			)}
			
			{subscriptionDetails && (
				<div className="bg-[#1D2022] p-4 rounded-lg mb-4">
					<div className="flex items-center justify-between">
						<span className="text-white font-medium">Current Plan:</span>
						<span className="text-[#40FED1] font-semibold">{subscriptionDetails.plan}</span>
					</div>
					<div className="flex items-center justify-between mt-2">
						<span className="text-white font-medium">Status:</span>
						<span className="bg-[#40FED1] text-[#121416] px-3 py-1 rounded-full text-xs font-semibold">
							{subscriptionDetails.status}
						</span>
					</div>
				</div>
			)}
			
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div
					className={`bg-[#1D2022] p-6 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
						selectedPlan === 'basic'
							? 'border-[#40FED1] border-opacity-70'
							: 'border-transparent'
					}`}
					onClick={() => handlePlanSelection('basic')}
				>
					<h3 className="text-xl font-semibold text-white mb-3">Basic</h3>
					<p className="text-[#40FED1] text-2xl font-bold mb-4">Free</p>
					<ul className="text-[#667177] space-y-2">
						<li>• 3 DCF analysis</li>
						<li>• 3 comps analysis</li>
						<li>• Limited dashboards</li>
					</ul>
				</div>
				
				<div
					className={`bg-[#1D2022] p-6 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
						selectedPlan === 'standard'
							? 'border-[#40FED1] border-opacity-70'
							: 'border-transparent'
					}`}
					onClick={() => handlePlanSelection('standard')}
				>
					<div className="absolute -top-3 right-4 bg-[#40FED1] text-[#121416] px-3 py-1 rounded-full text-xs font-semibold">
						Popular
					</div>
					<h3 className="text-xl font-semibold text-white mb-3">Standard</h3>
					<p className="text-[#40FED1] text-2xl font-bold mb-4">$50/month</p>
					<ul className="text-[#667177] space-y-2">
						<li>• Full access to all tools</li>
						<li>• Unlimited DCF analysis</li>
						<li>• Unlimited comps analysis</li>
						<li>• Customizable dashboard</li>
					</ul>
				</div>
				
				<div
					className={`bg-[#1D2022] p-6 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
						selectedPlan === 'premium'
							? 'border-[#40FED1] border-opacity-70'
							: 'border-transparent'
					}`}
					onClick={() => handlePlanSelection('premium')}
				>
					<h3 className="text-xl font-semibold text-white mb-3">Premium</h3>
					<p className="text-[#40FED1] text-2xl font-bold mb-4">Coming Soon</p>
					<ul className="text-[#667177] space-y-2">
						<li>• Everything in Standard</li>
						<li>• Private data analysis</li>
						<li>• Priority support</li>
						<li>• Advanced features</li>
					</ul>
					<div className="mt-4 text-[#A16BFB] text-sm">
						Our premium plan is currently in development
					</div>
				</div>
			</div>
			
			<div className="flex justify-end mt-4">
				<button
					onClick={handleSavePlan}
					disabled={isSaving || selectedPlan === 'premium' || (subscriptionDetails && selectedPlan === 'standard')}
					className={`px-6 py-2 rounded-full font-semibold ${
						isSaving || selectedPlan === 'premium' || (subscriptionDetails && selectedPlan === 'standard')
							? 'bg-[#1D2022] text-[#667177] cursor-not-allowed'
							: 'bg-[#40FED1] text-[#121416] hover:bg-opacity-90'
					} transition`}
				>
					{isSaving ? (
						<div className="flex items-center">
							<FaSpinner className="animate-spin mr-2" />
							Processing...
						</div>
					) : subscriptionDetails && selectedPlan === 'standard' ? (
						'Current Plan'
					) : selectedPlan === 'premium' ? (
						'Coming Soon'
					) : selectedPlan === 'basic' && subscriptionDetails ? (
						'Downgrade'
					) : selectedPlan === 'standard' ? (
						'Upgrade'
					) : (
						'Save'
					)}
				</button>
			</div>
		</div>
	);
};

export default Plan;
