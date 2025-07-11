/* eslint-disable react-refresh/only-export-components */
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Suspense, lazy, useEffect, useState } from 'react';
import FallbackSpinner from './components/common/FallbackSpinner';
import { lazyPatterns } from './utils/lazyLoader';
import ResetPassword from './pages/ResetPassword';
import TestTwo from './pages/Testtwo';
import Home from './pages/Home';
import Roadmap from './pages/Roadmap';
import ValuationHome from './components/dashboard/Valuation/ValuationHome';
import Charts from './screens/Charts';
import Comps from './components/dashboard/Valuation/Comps/Comps';
import SpreadsheetVisualisation from './components/dashboard/Valuation/SpreadsheetVisualisation';
import Dcf from './components/dashboard/Valuation/DCF/DCF';
import CustomValuation from './components/dashboard/Valuation/CustomValuation';
import Equity from './components/dashboard/Equity/Equity';
import TenKFiling from './screens/TenKFiling';
import News from './screens/News';
import client from './client/Client';
import LBOUserInputs from './components/dashboard/Valuation/LBO/LBOUserInputs';

// Authentication pages with enhanced error handling
const Login = lazyPatterns.authPage(() => import('./pages/Login'), 'Login');
const Logout = lazyPatterns.authPage(() => import('./pages/Logout'), 'Logout');
const Register = lazyPatterns.authPage(() => import('./pages/Register'), 'Register');
const ForgotPassword = lazyPatterns.authPage(() => import('./pages/ForgotPassword'), 'Forgot Password');
const ConfirmEmail = lazyPatterns.authPage(() => import('./pages/ConfirmEmail'), 'Confirm Email');
const VerifyEmail = lazyPatterns.authPage(() => import('./pages/VerifyEmail'), 'Verify Email');

// Dashboard pages with enhanced error handling
const DashboardHome = lazyPatterns.dashboardPage(() => import('./screens/DashboardHome'), 'Home');
const Watchlist = lazyPatterns.dashboardPage(() => import('./screens/Watchlist'), 'Watchlist');
const TodaysMovers = lazyPatterns.dashboardPage(() => import('./screens/TodaysMovers'), 'Today\'s Movers');
const MarketDashboard = lazyPatterns.dashboardPage(() => import('./screens/MarketDashboard'), 'Market Dashboard');
const Settings = lazyPatterns.dashboardPage(() => import('./screens/Settings'), 'Settings');
const Portfolio = lazyPatterns.dashboardPage(() => import('./screens/Portfolio'), 'Portfolio');
const Account = lazyPatterns.dashboardPage(() => import('./screens/Account'), 'Account');

// Other pages
const Checkout = lazy(() => import('./screens/Checkout'));
const PricingPlan = lazy(() => import('./pages/PricingPlan'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const SubscriptionPage = lazy(() => import('./screens/SubscriptionPage'));

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
	const { isLoggedIn } = useSelector((state) => state.auth);
	return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// eslint-disable-next-line react/prop-types
const SubscriptionProtectedRoute = ({ children }) => {
	const { isLoggedIn } = useSelector((state) => state.auth);
	const [hasSubscription, setHasSubscription] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const checkSubscription = async () => {
			if (!isLoggedIn) {
				console.log("User not logged in, skipping subscription check");
				setIsLoading(false);
				return;
			}

			try {
				console.log("Checking subscription status using subscription-details endpoint...");
				setIsLoading(true);

				// Use the getSubscriptionDetails method for more comprehensive info
				const response = await client.getSubscriptionDetails();
				console.log("Subscription details response:", response.status, response.data ? "Has data" : "No data");

				if (response.status === 200) {
					const hasActiveSubscription = !!response.data;
					console.log("Subscription check completed:", hasActiveSubscription ? "Active subscription" : "No subscription");
					setHasSubscription(hasActiveSubscription);
					setError(null);
				} else {
					console.error("Error checking subscription details, status:", response.status);
					console.error("Error details:", response.message || "No error message");

					// Fallback to the simple check if detailed check fails
					console.log("Attempting fallback subscription check...");
					const fallbackCheck = await client.checkSubscription();
					console.log("Fallback subscription check result:", fallbackCheck);

					setHasSubscription(fallbackCheck.has_subscription);
					setError(null);
				}
			} catch (error) {
				console.error("Exception checking subscription details:", error);

				// If we get an error, we'll try the simple check
				try {
					console.log("Attempting fallback subscription check after error...");
					const fallbackCheck = await client.checkSubscription();
					console.log("Fallback subscription check result:", fallbackCheck);

					setHasSubscription(fallbackCheck.has_subscription);
					setError(null);
				} catch (fallbackError) {
					console.error("Fallback subscription check failed:", fallbackError);
					setError("Unable to verify subscription status");

					// Default to allowing access if we can't check subscription
					// We can change this behavior if needed
					console.warn("Using safe default: Allowing access despite subscription check errors");
					setHasSubscription(true);
				}
			} finally {
				setIsLoading(false);
			}
		};

		checkSubscription();
	}, [isLoggedIn]);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-[#1D2022]">
				<FallbackSpinner />
				<p className="text-[#667177] mt-4">Verifying subscription...</p>
			</div>
		);
	}

	if (!isLoggedIn) {
		console.log("User not logged in, redirecting to login page");
		return <Navigate to="/login" replace />;
	}

	if (error) {
		console.log("Error during subscription check:", error);
		// We could show an error page or continue to the dashboard
		// For now, we'll just log the error and continue
	}

	if (hasSubscription === false) {
		console.log("No active subscription, redirecting to subscription page");
		return <Navigate to="/subscription" replace />;
	}

	console.log("Access granted - user has an active subscription or was allowed due to error handling");
	return children;
};

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			{' '}
			<Route path="/" element={<RootLayout />}>
				<Route path="/" element={<Home />} />
				<Route path="/test" element={<TestTwo />} />
				<Route path="/roadmap" element={<Roadmap />} />
			</Route>
			<Route path="/test" element={<TestTwo />} />
			<Route
				path="/login"
				element={
					<Suspense fallback={<FallbackSpinner />}>
						<Login />
					</Suspense>
				}
			/>
			<Route
				path="/logout"
				element={
					<Suspense fallback={<FallbackSpinner />}>
						<Logout />
					</Suspense>
				}>
			</Route>
			<Route
				path="/register"
				element={
					<Suspense fallback={<FallbackSpinner />}>
						<Register />
					</Suspense>
				}
			/>
			<Route
				path="/subscription"
				element={
					<Suspense fallback={<FallbackSpinner />}>
						<PrivateRoute>
							<SubscriptionPage />
						</PrivateRoute>
					</Suspense>
				}
			/>
			<Route
				path="/forgot-password"
				element={
					<Suspense fallback={<FallbackSpinner />}>
						<ForgotPassword />
					</Suspense>
				}
			/>
			<Route
				path="/reset-password"
				element={
					<Suspense fallback={<FallbackSpinner />}>
						<ResetPassword />
					</Suspense>
				}
			/>
			<Route
				path="/confirm-email"
				element={
					<Suspense fallback={<FallbackSpinner />}>
						<ConfirmEmail />
					</Suspense>
				}
			/>
			<Route
				path="/verify-email"
				element={
					<Suspense fallback={<FallbackSpinner />}>
						<VerifyEmail />
					</Suspense>
				}
			/>
			<Route
				path="/contact-us/enterprise"
				element={
					<Suspense fallback={<FallbackSpinner />}>
						<ContactUs />
					</Suspense>
				}
			/>
			<Route
				path="/contact-us"
				element={
					<Suspense fallback={<FallbackSpinner />}>
						<ContactUs />
					</Suspense>
				}
			/>
			<Route
				path="/plans"
				element={
					<Suspense fallback={<FallbackSpinner />}>
						<PricingPlan />
					</Suspense>
				}
			/>
			<Route
				path="/checkout"
				element={
					<Suspense fallback={<FallbackSpinner />}>
						<Checkout />
					</Suspense>
				}
			/>
			<Route
				path="/"
				element={
					<SubscriptionProtectedRoute>
						<DashboardLayout />
					</SubscriptionProtectedRoute>
				}
			>
				<Route
					path="/dashboard"
					element={
						<Suspense fallback={<FallbackSpinner />}>
							<DashboardHome />
						</Suspense>
					}
				/>
				{/* Ticker Tab Routes */}
				<Route path="/valuation" element={<ValuationHome />} />
				<Route path="/valuation/private" element={<CustomValuation />} />
				<Route path="/valuation/private/inputs" element={<LBOUserInputs />} />
				<Route path="/valuation/comparable" element={<Comps />} />
				<Route path="/valuation/dcf" element={<Dcf />} />
				<Route path="/news" element={<News />} />
				<Route path="/files" element={<TenKFiling />} />
				<Route path="/equity-report" element={<Equity />} />
				<Route path="/charts" element={<Charts />} />

				{/* Other Routes */}
				<Route path="/dashboard/chart" element={<Charts />} />
				<Route path="/equity" element={<Equity />} />
				<Route path="/equity/:type" element={<Equity />} />
				<Route
					path="/account"
					element={
						<Suspense fallback={<FallbackSpinner />}>
							<Account />
						</Suspense>
					}
				/>
				<Route
					path="portfolio"
					element={
						<Suspense fallback={<FallbackSpinner />}>
							<Portfolio />
						</Suspense>
					}
				/>
				<Route
					path="/watchlist"
					element={
						<Suspense fallback={<FallbackSpinner />}>
							<Watchlist />
						</Suspense>
					}
				/>
				<Route
					path="/todays-movers"
					element={
						<Suspense fallback={<FallbackSpinner />}>
							<TodaysMovers />
						</Suspense>
					}
				/>
				<Route
					path="/market"
					element={
						<Suspense fallback={<FallbackSpinner />}>
							<MarketDashboard />
						</Suspense>
					}
				/>
				<Route
					path="/settings"
					element={
						<Suspense fallback={<FallbackSpinner />}>
							<Settings />
						</Suspense>
					}
				/>
				<Route
					path="/settings/:element"
					element={
						<Suspense fallback={<FallbackSpinner />}>
							<Settings />
						</Suspense>
					}
				/>
			</Route>
		</>
	)
);

export default router;
