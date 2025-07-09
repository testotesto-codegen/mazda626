import { MdOutlineAdd } from 'react-icons/md';
import TickerInput from './TickerInput';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import client from '../../../../client/Client';
import { FaS, FaSpinner } from 'react-icons/fa6';
import { selectActiveSession } from '../../../../redux/slices/tickerSessionsSlice';

const Comps = () => {
	const [compData, setCompData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchParams] = useSearchParams();
	const tickerParam = searchParams.get('ticker');
	const activeSession = useSelector(selectActiveSession);
	const navigate = useNavigate();

	const queryCompsResult = async () => {
		// Get the current active session ticker
		const currentTabTicker = activeSession?.ticker || tickerParam;
		
		// Extract tickers from compData
		let tickers = compData.map(elem => elem.ticker);
		
		// If the current tab's ticker is not the first element (or not in the array),
		// reorganize the array to make it first
		if (currentTabTicker && currentTabTicker !== 'PLACEHOLDER' && currentTabTicker !== 'PRIVATE_DATA') {
			// Remove the current ticker if it exists in the array (to avoid duplicates)
			tickers = tickers.filter(ticker => ticker.toUpperCase() !== currentTabTicker.toUpperCase());
			
			// Add the current ticker as the first element
			tickers.unshift(currentTabTicker);
		}

		console.log("Sending tickers array with first ticker:", tickers);
		
		setIsLoading(true);
		const response = await client.generateComps(tickers);
		setIsLoading(false);
		console.log(response);
		
		// Create a Blob from the response data
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `${currentTabTicker} COMPS.xlsx`); // Use current tab ticker for filename
		document.body.appendChild(link);
		link.click(); // Trigger download
		link.remove(); // Clean up
	}

	useEffect(() => {
		if (activeSession.ticker) {
			setCompData([
				{
					id: 1,
					ticker: activeSession.ticker,
				},
			]);
		} else if (activeSession && activeSession.ticker && 
				  activeSession.ticker !== 'PLACEHOLDER' && 
				  activeSession.ticker !== 'PRIVATE_DATA') {
			// If no ticker in URL but we have an active session with a valid ticker
			setCompData([
				{
					id: 1,
					ticker: activeSession.ticker,
				},
			]);
		}
	}, [tickerParam, activeSession]);

	return (
		<div className="flex flex-col items-center pb-6">
			<h2 className="text-2xl font-semibold text-[#D2DDE5] my-10">Comparable Company Analysis</h2>
			{compData.length > 0 &&
				compData.map((comp) => (
					<TickerInput key={comp.id} id={comp.id} compData={compData} setCompData={setCompData} />
				))}

			<button
				onClick={() =>
					setCompData([
						...compData,
						{
							id: compData.length + 1,
							ticker: '',
						},
					])
				}
				className="w-32 h-20 flex justify-center items-center text-[#fff] rounded-full bg-[#2F363A] mt-8"
			>
				<MdOutlineAdd size={50} />
			</button>
			<button 
				onClick={queryCompsResult} 
				disabled={isLoading || compData.length === 0 || !compData.some(comp => comp.ticker)}
				className={`${
					isLoading || compData.length === 0 || !compData.some(comp => comp.ticker) 
					? 'bg-[#a97df3]' 
					: 'bg-[#803CF0]'
				} mt-24 rounded-full py-3 px-28 font-semibold text-sm text-[#F2F2F2] flex justify-center items-center`}
			>
				{isLoading ? <FaSpinner className='animate-spin' /> : "Generate"}
			</button>
			<button
				onClick={() => navigate(-1)}
				className="bg-[#B44ECD] mt-6 rounded-full py-3 px-20 font-semibold text-sm text-[#F2F2F2] flex justify-center items-center"
			>
				Back
			</button>
		</div>
	);
};

export default Comps;
