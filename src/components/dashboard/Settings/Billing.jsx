import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import client from '../../../client/Client';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const Billing = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [subscription, setSubscription] = useState(null);
	const [errorMsg, setErrorMsg] = useState('');
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	
	// Fetch subscription information
	useEffect(() => {
		const fetchSubscription = async () => {
			try {
				setIsLoading(true);
				console.log("Fetching subscription details...");
				// Use the new getSubscriptionDetails method
				const response = await client.getSubscriptionDetails();
				console.log("Subscription details response:", response.status, response.data ? "Has data" : "No data");
				
				if (response.status === 200) {
					setSubscription(response.data);
					setErrorMsg('');
				} else {
					console.error("Error fetching subscription details:", response.status, response.message);
					setErrorMsg('Failed to load subscription information');
					
					// Try fallback method if main endpoint is not available
					try {
						console.log("Attempting fallback subscription check...");
						const fallbackCheck = await client.checkSubscription();
						console.log("Fallback check result:", fallbackCheck);
						
						if (fallbackCheck.has_subscription) {
							// Create a placeholder subscription object
							setSubscription({
								status: 'active',
								plan: 'Accelno Monthly Subscription',
								current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
								amount: 50.00,
								currency: 'usd'
							});
							setErrorMsg('');
						}
					} catch (fallbackErr) {
						console.error("Fallback subscription check failed:", fallbackErr);
					}
				}
			} catch (error) {
				console.error('Error fetching subscription:', error);
				setErrorMsg('Error loading subscription details');
				
				// Try fallback method if main method fails with error
				try {
					console.log("Attempting fallback subscription check after error...");
					const fallbackCheck = await client.checkSubscription();
					console.log("Fallback check result after error:", fallbackCheck);
					
					if (fallbackCheck.has_subscription) {
						// Create a placeholder subscription object
						setSubscription({
							status: 'active',
							plan: 'Accelno Monthly Subscription',
							current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
							amount: 50.00,
							currency: 'usd'
						});
						setErrorMsg('');
					}
				} catch (fallbackErr) {
					console.error("Fallback subscription check failed:", fallbackErr);
				}
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchSubscription();
	}, []);
	
	const handleManageSubscription = async () => {
		try {
			setIsLoading(true);
			console.log("Creating customer portal session...");
			// Use the customer portal session
			const response = await client.createCustomerPortalSession();
			console.log("Customer portal session response:", response);
			
			if (response.status === 200 && response.url) {
				// Redirect to Stripe customer portal
				window.location.href = response.url;
			} else {
				console.error("Error creating customer portal session:", response.status, response.message);
				// Fallback if the portal isn't set up yet
				navigate('/subscription');
			}
		} catch (error) {
			console.error('Error navigating to manage subscription:', error);
			setErrorMsg('Error opening subscription management');
			setIsLoading(false);
		}
	};
	
	const handleUpdatePaymentMethod = async () => {
		try {
			setIsLoading(true);
			console.log("Creating customer portal session for payment method update...");
			// Use the customer portal session with specific focus on payment method
			const response = await client.createCustomerPortalSession(
				window.location.origin + '/settings'
			);
			console.log("Customer portal session response:", response);
			
			if (response.status === 200 && response.url) {
				// Redirect to Stripe customer portal
				window.location.href = response.url;
			} else {
				console.error("Error creating customer portal session:", response.status, response.message);
				setErrorMsg('Payment method update is not available at this time');
				setIsLoading(false);
			}
		} catch (error) {
			console.error('Error updating payment method:', error);
			setErrorMsg('Error updating payment method');
			setIsLoading(false);
		}
	};
	
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-8">
				<FaSpinner className="animate-spin text-[#40FED1] text-4xl" />
			</div>
		);
	}
	
	// Format date for display
	const formatDate = (dateString) => {
		if (!dateString) return 'Not available';
		
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch (error) {
			console.error('Error formatting date:', error);
			return 'Invalid date';
		}
	};
	
	return (
		<div className="flex flex-col border-t border-[#A7A8AB] py-4 gap-6 font-inter">
			<h3 className="text-xl font-semibold text-white mb-4">Subscription Details</h3>
			
			{errorMsg && (
				<div className="bg-red-800 bg-opacity-30 p-3 rounded mb-4 text-red-300">
					{errorMsg}
				</div>
			)}
			
			{subscription ? (
				<div className="bg-[#1D2022] p-6 rounded-lg">
					<div className="flex flex-col gap-4 mb-6">
						<div className="flex justify-between items-center">
							<span className="text-[#667177]">Plan:</span>
							<span className="text-white font-medium">{subscription.plan}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-[#667177]">Status:</span>
							<span className="bg-[#40FED1] text-[#121416] px-3 py-1 rounded-full text-xs font-semibold">
								{subscription.status}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-[#667177]">Amount:</span>
							<span className="text-white font-medium">
								${subscription.amount}/{subscription.currency === 'usd' ? 'USD' : subscription.currency}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-[#667177]">Billing period:</span>
							<span className="text-white font-medium">Monthly</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-[#667177]">Next billing date:</span>
							<span className="text-white font-medium">{formatDate(subscription.current_period_end)}</span>
						</div>
					</div>
					
					<div className="flex flex-col gap-3 mt-6">
						<button 
							onClick={handleUpdatePaymentMethod}
							className="w-full bg-[#1D2022] border border-[#40FED1] text-[#40FED1] py-2 px-4 rounded-full font-medium hover:bg-[#40FED1] hover:text-[#121416] transition"
							disabled={isLoading}
						>
							{isLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Update Payment Method"}
						</button>
						
						<button 
							onClick={handleManageSubscription}
							className="w-full bg-[#1D2022] border border-[#A16BFB] text-[#A16BFB] py-2 px-4 rounded-full font-medium hover:bg-[#A16BFB] hover:text-white transition"
							disabled={isLoading}
						>
							{isLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Manage Subscription"}
						</button>
					</div>
				</div>
			) : (
				<div className="bg-[#1D2022] p-6 rounded-lg">
					<p className="text-[#667177] mb-4">
						You don't currently have an active subscription. Subscribe to access all features.
					</p>
					<button
						onClick={() => navigate('/subscription')}
						className="w-full bg-[#40FED1] text-[#121416] py-2 px-4 rounded-full font-semibold hover:bg-opacity-90 transition"
					>
						Subscribe Now
					</button>
				</div>
			)}
		</div>
	);
};

export default Billing;
