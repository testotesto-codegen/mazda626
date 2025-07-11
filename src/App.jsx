import { RouterProvider } from 'react-router-dom';
import router from './routes';
import DevBanner from './components/common/DevBanner';
import { isDevelopment, getCurrentConfig } from './config/environment';

function App() {
	const isDevMode = isDevelopment();
	const config = getCurrentConfig();
	
	// Development logging
	if (config.enableDebugLogs) {
		console.log('🧪 App component loaded in development mode');
	}
	
	return (
		<div className={isDevMode ? 'app-development' : 'app-production'}>
			{config.showDevBanner && <DevBanner />}
			<RouterProvider router={router} />
		</div>
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
