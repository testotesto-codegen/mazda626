import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import client from '../client/Client';
import { FaSpinner, FaCheck, FaTimesCircle } from 'react-icons/fa';

const SubscriptionPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    
    // Check for payment status from URL params
    const paymentCanceled = searchParams.get('payment_canceled') === 'true';
    const paymentSuccess = searchParams.get('payment_success') === 'true';
    
    // Check subscription on load
    useEffect(() => {
        const checkSubscription = async () => {
            setIsLoading(true);
            const response = await client.checkSubscription();
            
            // If user has subscription and no payment status in URL, redirect to dashboard
            if (response.has_subscription && !paymentSuccess && !paymentCanceled) {
                navigate('/dashboard');
            }
            
            setIsLoading(false);
        };
        
        checkSubscription();
    }, [navigate, paymentSuccess, paymentCanceled]);
    
    // If payment was successful, redirect to dashboard after 5 seconds
    useEffect(() => {
        if (paymentSuccess) {
            const timer = setTimeout(() => {
                navigate('/dashboard');
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [paymentSuccess, navigate]);
    
    const handleSubscribe = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            const response = await client.createCheckoutSession();
            
            if (response.status === 200 && response.url) {
                // Redirect to Stripe checkout
                window.location.href = response.url;
            } else {
                setError('Failed to initiate subscription process. Please try again.');
            }
        } catch (error) {
            console.error("Error creating checkout session:", error);
            setError('An error occurred while processing your request.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Payment success screen
    if (paymentSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#1D2022]">
                <div className="bg-[#121416] p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-[#40FED1] rounded-full p-4">
                            <FaCheck className="text-[#121416] text-4xl" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Payment Successful!</h2>
                    <p className="text-[#667177] mb-6">
                        Thank you for subscribing to Accelno. You now have full access to all features.
                    </p>
                    <p className="text-[#40FED1] mb-8">
                        Redirecting you to the dashboard...
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-[#40FED1] text-[#121416] py-3 px-4 rounded-full font-bold hover:bg-opacity-90 transition duration-200"
                    >
                        Go to Dashboard Now
                    </button>
                </div>
            </div>
        );
    }
    
    // Payment canceled screen
    if (paymentCanceled) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#1D2022]">
                <div className="bg-[#121416] p-8 rounded-lg shadow-lg w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <div className="bg-[#FF6B6B] bg-opacity-20 rounded-full p-4">
                            <FaTimesCircle className="text-[#FF6B6B] text-4xl" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4 text-center">Payment Canceled</h2>
                    <p className="text-[#667177] mb-6 text-center">
                        Your payment was canceled. You can try again when you're ready.
                    </p>
                    <button
                        onClick={handleSubscribe}
                        className="w-full bg-[#40FED1] text-[#121416] py-3 px-4 rounded-full font-bold hover:bg-opacity-90 transition duration-200"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full mt-4 bg-transparent border border-[#667177] text-[#667177] py-3 px-4 rounded-full font-bold hover:border-white hover:text-white transition duration-200"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }
    
    // Normal subscription page
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#1D2022]">
            <div className="bg-[#121416] p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Accelno Subscription</h2>
                
                {error && (
                    <div className="bg-[#2D3133] p-3 rounded-lg mb-6 text-[#FF6B6B] text-sm">
                        {error}
                    </div>
                )}
                
                <div className="bg-[#1D2022] p-4 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold text-white">Accelno Monthly Subscription</h3>
                    <p className="text-[#40FED1] text-2xl font-bold mt-2">$50/month</p>
                    <ul className="text-[#667177] mt-4 space-y-2">
                        <li>• Full access to all tools and features</li>
                        <li>• DCF and comps analysis</li>
                        <li>• Private data analysis</li>
                        <li>• Customizable dashboard</li>
                    </ul>
                </div>
                
                <button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="w-full bg-[#40FED1] text-[#121416] py-3 px-4 rounded-full font-bold hover:bg-opacity-90 transition duration-200 flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <FaSpinner className="animate-spin mr-2" />
                            Processing...
                        </>
                    ) : (
                        'Subscribe Now'
                    )}
                </button>
                
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full mt-4 bg-transparent border border-[#667177] text-[#667177] py-3 px-4 rounded-full font-bold hover:border-white hover:text-white transition duration-200"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default SubscriptionPage; 