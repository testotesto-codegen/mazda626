import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { createSession, selectHasPlaceholder, closeSession, selectActiveSessionId } from '../redux/slices/tickerSessionsSlice';
import WidgetsComponent from './WidgetsComponent';

const DashboardHome = () => {
	const [ticker, setTicker] = useState('');
	const [error, setError] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const hasPlaceholder = useSelector(selectHasPlaceholder);
	const activeSessionId = useSelector(selectActiveSessionId);
	
	// Check if the user is trying to create a new tab
	const isCreatingNewTab = searchParams.get('newTab') === 'true';

	// Check for placeholder session
	useEffect(() => {
		// If we navigate away, close the placeholder
		return () => {
			if (hasPlaceholder) {
				dispatch(closeSession(activeSessionId));
			}
		};
	}, [hasPlaceholder, dispatch, activeSessionId]);

	const handleSubmit = (e) => {
		e.preventDefault();
		
		// Validate ticker
		if (!ticker.trim()) {
			setError('Please enter a ticker symbol');
			return;
		}

		// Create a new ticker session
		dispatch(createSession(ticker.toUpperCase()));
		
		// Navigate to the valuation screen for this ticker
		navigate('/valuation');
	};

	const handlePrivateData = () => {
		// Create a special session for private data
		dispatch(createSession('PRIVATE_DATA'));
		
		// Navigate directly to the custom valuation screen
		navigate('/valuation/private');
	};

	const handleChange = (e) => {
		setTicker(e.target.value);
		if (error) setError(false);
	};

	// Show the form if there's a placeholder session OR if the user is creating a new tab
	if (hasPlaceholder || isCreatingNewTab) {
		return (
			<div className="flex items-center justify-center h-full bg-[#1D2022] flex-grow">
				<div className="flex flex-col items-center bg-[#121416] p-8 rounded-lg shadow-lg w-full max-w-md">
					<h2 className="text-2xl font-bold text-white mb-6">Create a New Session</h2>
					
					<div className="w-full mb-6">
						<div className="flex items-center mb-3">
							<h3 className="text-xl font-semibold text-white">Public Data</h3>
							<span className="ml-2 px-2 py-1 text-xs font-medium bg-[#40FED1] text-[#121416] rounded-full">
								Market Data
							</span>
						</div>
						<p className="text-[#667177] mb-4">
							Enter a ticker symbol to analyze public market data.
						</p>
						
						<form onSubmit={handleSubmit} className="w-full">
							<div className="mb-4">
								<input
									type="text"
									value={ticker}
									onChange={handleChange}
									placeholder="e.g. AAPL, MSFT, TSLA"
									className={`w-full py-3 px-4 bg-[#1D2022] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#40FED1] ${
										error ? 'border border-red-500' : ''
									}`}
									autoFocus // Auto-focus the ticker input
								/>
								{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
							</div>

							<button
								type="submit"
								className="w-full bg-[#40FED1] text-[#121416] py-3 px-4 rounded-full font-bold hover:bg-opacity-90 transition duration-200"
							>
								Analyze Public Data
							</button>
						</form>
					</div>
					
					<div className="w-full">
						<div className="border-t border-[#667177] opacity-30 my-6"></div>
						
						<div className="flex items-center mb-3">
							<h3 className="text-xl font-semibold text-white">Private Data</h3>
							<span className="ml-2 px-2 py-1 text-xs font-medium bg-[#A16BFB] text-white rounded-full">
								Your Files
							</span>
						</div>
						<p className="text-[#667177] mb-4">
							Upload and analyze your own financial statements.
						</p>
						
						<button
							onClick={handlePrivateData}
							className="w-full bg-[#A16BFB] text-white py-3 px-4 rounded-full font-bold hover:bg-opacity-90 transition duration-200 flex items-center justify-center"
						>
							<span>Use Private Data</span>
							<svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
		);
	} else {
		// Show the widgets dashboard when on the home tab and not creating a new tab
		return <WidgetsComponent screen="dashboard" />;
	}
};

export default DashboardHome;

{
	/*
			<StockTicker />
			<div className="flex py-3 justify-center space-x-4">
				<div className="flex flex-col space-y-4 pl-14">
					<div className="flex justify-center gap-2">
						<div>
							<AvgMonthlyRevenue  />
						</div>
						<div>
							<SingleStockStackedChart containerWidth={460} chartWidth={430} />
						</div>
					</div>

					<div className="flex flex-wrap gap-2">
						<SingleStockChart />
						<SingleStockChart />
						<SingleStockChart />
					</div>
				</div>
				<div>
					<RecentActivities />
				</div>
			</div>
			<div className="flex flex-wrap gap-2 pb-4 pl-14">
				<HeatmapContainer />
				<GainerLoser />
				<FiftyTwoWeeklyStats />
				<FinancialTableMini />
			</div>
			
			*/
}
