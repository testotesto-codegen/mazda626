import { RouterProvider } from 'react-router-dom';
import router from './routes';
import ErrorBoundary from './shared/components/ErrorBoundary';
import { AuthProvider } from './features/auth/hooks/useAuth';
import { getEnvironmentConfig } from './core/config';

const config = getEnvironmentConfig();

function App() {
	return (
		<ErrorBoundary>
			<AuthProvider>
				<div className="app">
					{config.showTestBanner && (
						<div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm">
							🧪 Development Environment
						</div>
					)}
					<RouterProvider router={router} />
				</div>
			</AuthProvider>
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
