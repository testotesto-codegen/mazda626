import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { ErrorBoundary } from './components/common';

// Development mode indicator
const isDevelopment = import.meta.env.DEV;

if (isDevelopment) {
	console.log('🧪 App component loaded in development mode');
}

function App() {
	return (
		<ErrorBoundary
			title="Application Error"
			message="Something went wrong with the application. Please refresh the page or contact support if the problem persists."
		>
			<div className={isDevelopment ? 'test-mode' : ''}>
				{isDevelopment && (
					<div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm">
						🧪 DEVELOPMENT MODE - Enhanced error handling and debugging active
					</div>
				)}
				<RouterProvider router={router} />
			</div>
		</ErrorBoundary>
	);
}

export default App;

/*
<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/pricing" element={<PricingPlan />} />
				<Route path="/dashboard" element={<DashboardHome />} />
				<Route path="/dashboard/earning-calendar" element={<EarningCalendar />} />
				<Route path="/dashboard/todays-movers" element={<TodaysMovers />} />
				<Route path="/dashboard/market-dashboard" element={<MarketDashboard />} />
				<Route path="/dashboard/etf-bundles" element={<EtfBundles />} />
				<Route path="/dashboard/watchlist" element={<Watchlist />} />
				<Route path="/dashboard/ai-assistant" element={<AiAssistant />} />
				<Route path="/fileuploader" element={<FileUploader />} />
				<Route path="/createpayment" element={<StripeSubscription />} />
				<Route path="/updatepayment" element={<StripeUpdateTest />} />
			</Routes>
		</BrowserRouter>



*/
