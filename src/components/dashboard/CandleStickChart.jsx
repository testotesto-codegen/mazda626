/* eslint-disable react/prop-types */

import { createChart, ColorType } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

const CandleStickChart = (props) => {
	const {
		data,
		lastCandle,
		colors: {
			backgroundColor = '#232729',
			lineColor = '#2962FF',
			textColor = 'white',
			areaTopColor = '#2962FF',
			areaBottomColor = 'rgba(41, 98, 255, 0.28)',
		} = {},
	} = props;

	const chartContainerRef = useRef();
	const [candleData, setCandleData] = useState(null);
	const [realtimeData, setRealtimeData] = useState([]);
	const chartRef = useRef();
	const newSeriesRef = useRef();
	//console.log('realtimeData from chart', realtimeData);

	useEffect(() => {
		const handleResize = () => {
			chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
		};

		chartRef.current = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: backgroundColor },
				textColor,
			},
			grid: {
				vertLines: {
					color: '#444',
				},
				horzLines: {
					color: '#444',
				},
			},
			width: chartContainerRef.current.clientWidth,
			height: 500,
		});

		chartRef.current.priceScale('right').applyOptions({
			borderColor: '#444',
		});

		chartRef.current.timeScale().applyOptions({
			borderColor: '#444',
			rightOffset: 20,
		});

		chartRef.current.timeScale().fitContent();

		newSeriesRef.current = chartRef.current.addCandlestickSeries({
			upColor: '#26a69a',
			downColor: '#ef5350',
			borderVisible: true,
			wickUpColor: '#26a69a',
			wickDownColor: '#ef5350',
		});
		newSeriesRef.current.setData(data);

		chartRef.current.subscribeCrosshairMove((param) => {
			if (param === undefined || param.time === undefined) {
				return;
			}
			const data = param.seriesData.get(newSeriesRef.current);
			setCandleData(data);
		});

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);

			chartRef.current.remove();
		};
	}, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

	useEffect(() => {
		if (!lastCandle || Object.keys(lastCandle).length === 0 || lastCandle === null || lastCandle === undefined) {
			return;
		} else {
			newSeriesRef.current.update(lastCandle);
			setRealtimeData((prev) => [...prev, lastCandle]);
		}
	}, [lastCandle]);

	const getChangeType = (open, close) => {
		const change = close - open;
		if (change === 0) return 'neutral';
		return change > 0 ? 'positive' : 'negative';
	};

	const legendValues = [
		{
			label: 'Volume',
			value:
				data.filter((item) => item.time === candleData?.time)[0]?.volume ||
				realtimeData.filter((item) => item.time === candleData?.time)[0]?.volume,
		},
		{ label: 'O', value: candleData?.open },
		{ label: 'H', value: candleData?.high },
		{ label: 'L', value: candleData?.low },
		{ label: 'C', value: candleData?.close },
	];

	return (
		<div ref={chartContainerRef} style={{ position: 'relative' }}>
			<div
				style={{
					position: 'absolute',
					top: 20,
					left: '50%',
					transform: 'translateX(-50%)',
					zIndex: 1000,
					display: 'flex',
					flexDirection: 'row',
					gap: '30px',
					fontFamily: 'inherit',
				}}
			>
				{legendValues.map((item) => (
					<div key={item.label} className="text-[#C4C4C4]">
						{item.label}
						<span
							className={`${
								getChangeType(candleData?.open, candleData?.close) === 'positive'
									? 'text-[#0ACFDC]'
									: getChangeType(candleData?.open, candleData?.close) === 'negative'
									? 'text-[#EB5858]'
									: null
							}   ml-2`}
						>
							{item.value}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default CandleStickChart;
