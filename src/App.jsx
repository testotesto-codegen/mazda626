import { RouterProvider } from 'react-router-dom';
import router from './routes';
import ThemeProvider from './components/theme/ThemeProvider';

// TEST: Added console log for debugging
console.log('🧪 App component loaded in TEST mode');

function App() {
	// TEST: Added development mode indicator
	const isDevelopment = import.meta.env.DEV;
	
	return (
		<ThemeProvider>
			<div className={isDevelopment ? 'test-mode' : ''}>
				{isDevelopment && (
					<div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm">
						🚀 Development Mode - Live Preview Active
					</div>
				)}
				<RouterProvider router={router} />
			</div>
		</ThemeProvider>
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
