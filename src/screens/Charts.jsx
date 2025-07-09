import { useGetCandleStickHistoricalDataQuery } from '../api/endpoints/widgetDataApi';
import CandleStickChart from '../components/dashboard/CandleStickChart';
import { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useSearchParams } from 'react-router-dom';

/*
const initialData = [
	{ open: 9.5, high: 9.82, low: 8.53, close: 9.81, time: 1642427876 },
	{ open: 9.81, high: 10.21, low: 9.36, close: 9.96, time: 1642427936 },
	{ open: 9.96, high: 10.1, low: 9.37, close: 9.89, time: 1642427996 },
	{ open: 9.89, high: 10.44, low: 9.72, close: 10.14, time: 1642428056 },
	{ open: 10.14, high: 10.42, low: 9.95, close: 10.09, time: 1642428116 },
	{ open: 10.09, high: 10.44, low: 9.53, close: 10.03, time: 1642428176 },
	{ open: 10.03, high: 10.81, low: 9.77, close: 10.73, time: 1642428236 },
	{ open: 10.73, high: 11.24, low: 9.95, close: 10.24, time: 1642428296 },
	{ open: 10.24, high: 10.63, low: 9.46, close: 10.45, time: 1642428356 },
	{ open: 10.45, high: 10.49, low: 10.05, close: 10.1, time: 1642428416 },
	{ open: 10.1, high: 10.87, low: 9.8, close: 10.57, time: 1642428476 },
	{ open: 10.57, high: 10.9, low: 10.03, close: 10.18, time: 1642428536 },
	{ open: 10.18, high: 10.27, low: 9.62, close: 9.7, time: 1642428596 },
	{ open: 9.7, high: 10.16, low: 9.53, close: 10.16, time: 1642428656 },
	{ open: 10.16, high: 10.44, low: 9.39, close: 10.25, time: 1642428716 },
	{ open: 10.25, high: 10.98, low: 9.27, close: 9.87, time: 1642428776 },
	{ open: 9.87, high: 10.76, low: 9.8, close: 10.2, time: 1642428836 },
	{ open: 10.2, high: 10.57, low: 9.68, close: 10.31, time: 1642428896 },
	{ open: 10.31, high: 10.88, low: 10.23, close: 10.6, time: 1642428956 },
	{ open: 10.6, high: 11.01, low: 9.88, close: 10.41, time: 1642429016 },
	{ open: 10.41, high: 10.41, low: 9.96, close: 10.25, time: 1642429076 },
	{ open: 10.25, high: 10.56, low: 10.11, close: 10.27, time: 1642429136 },
	{ open: 10.27, high: 10.3, low: 9.67, close: 10.11, time: 1642429196 },
	{ open: 10.11, high: 10.79, low: 9.85, close: 10.55, time: 1642429256 },
	{ open: 10.55, high: 10.79, low: 10.03, close: 10.56, time: 1642429316 },
	{ open: 10.56, high: 11.12, low: 10.43, close: 11.11, time: 1642429376 },
	{ open: 11.11, high: 11.85, low: 11.06, close: 11.12, time: 1642429436 },
	{ open: 11.12, high: 11.83, low: 10.97, close: 11.76, time: 1642429496 },
	{ open: 11.76, high: 12.13, low: 10.9, close: 11.46, time: 1642429556 },
	{ open: 11.46, high: 11.65, low: 10.74, close: 11.22, time: 1642429616 },
];

*/

const dataPeriod = [
	{ label: '1d', value: '1 day in 1 minutes intervals' },
	{ label: '5d', value: '5 days in 5 minutes intervals' },
	{ label: '1m', value: '1 month in 30 minutes intervals' },
	{ label: '3m', value: '3 months in 1 hour intervals' },
	{ label: '6m', value: '6 months in 2 hours intervals' },
	{ label: '1y', value: '1 year in 1 day intervals' },
	{ label: '5y', value: '5 years in 1 week intervals' },
	{ label: 'All', value: 'All data in 1 month intervals' },
];

const Charts = () => {
	const [selectedPeriod, setSelectedPeriod] = useState('1m');
	const [ticker, setTicker] = useState(null);
	const [lastCandle, setLastCandle] = useState(null);
	const { data, isFetching, error } = useGetCandleStickHistoricalDataQuery({ ticker: ticker, dataType: selectedPeriod });
	let [searchParams, setSearchParam] = useSearchParams();
	const tickerParam = searchParams.get('ticker');

	useEffect(() => {
		if (tickerParam) {
			setTicker(tickerParam);
		}
	}, [tickerParam]);

	useEffect(() => {
		const socket = new WebSocket(import.meta.env.VITE_WS_URL);

		socket.onopen = () => {
			socket.send(JSON.stringify({ action: 'subscribe', params: `AM.${ticker}` }));
			console.log('WebSocket connection established, ticker subscribed:', ticker);
		};

		socket.onmessage = (event) => {
			setLastCandle(JSON.parse(event.data));
			console.log('WebSocket message received:', lastCandle);
		};

		socket.onclose = () => {
			console.log('WebSocket connection closed');
		};

		socket.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		return () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.close();
			}
		};
	}, [ticker, lastCandle]);

	const override = {
		display: 'block',
		margin: '0 auto',
		borderColor: '#2151C0',
	};

	return (
		<>
			{isFetching ? (
				<div className="h-full flex items-center justify-center ">
					<ClipLoader
						color="#fff"
						loading={isFetching}
						cssOverride={override}
						size={30}
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			) : (
				<>
					<CandleStickChart data={data} lastCandle={lastCandle}></CandleStickChart>
					<div className="w-full bg-[#232729] border-t border-[#444] flex px-2">
						{dataPeriod.map((period) => (
							<button
								onClick={() => setSelectedPeriod(period.label)}
								key={period.label}
								className={'group/item p-2 relative hover:bg-[#444] text-[#C4C4C4] text-sm'}
							>
								{period.label}
								<div className="group/edit invisible absolute -bottom-12 w-[250px] bg-[#3D4042] group-hover/item:visible p-2 rounded-sm">
									{period.value}
								</div>
							</button>
						))}
					</div>
				</>
			)}
		</>
	);
};

export default Charts;
