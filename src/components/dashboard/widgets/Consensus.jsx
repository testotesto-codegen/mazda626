/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { selectWidgetsByScreen, updateWidgetSize } from '../../../redux/slices/widgetSlice';
import { MdInfoOutline } from 'react-icons/md';
import WidgetConfiguration from '../WidgetConfiguration/WidgetConfiguration';
//import ClipLoader from 'react-spinners/ClipLoader';
import { useSelector } from 'react-redux';

const dummyData = [
	{
		id: 1,
		ticker: 'AAPL',
		name: 'Apple',
		buys: 26,
		buysPercentage: 65.0,
		holds: 13,
		holdsPercentage: 32.5,
		sells: 1,
		sellsPercentage: 2.5,
		currency: 'USD',
		targetPrice: 31.89,
	},
	{
		id: 2,
		ticker: 'TSLA',
		name: 'Tesla Inc',
		buys: 18,
		buysPercentage: 42.0,
		holds: 10,
		holdsPercentage: 25.0,
		sells: 1,
		sellsPercentage: 2.5,
		currency: 'USD',
		targetPrice: 28.89,
	},
];

const ConsensusSize = {
	small: { width: "350px", height: "270px" },
	medium: { width: "520px", height: "270px" },
	large: { width: "590px", height: "270px" },
};

const Consensus = ({ widgetId, screen }) => {
	const [edit, setEdit] = useState(false);
	const [ticker, setTicker] = useState(dummyData[0]);
	const [input, setInput] = useState('');
	const [size, setSize] = useState('');
	const dispatch = useDispatch();
	const selectedWidgets = useSelector((state) => selectWidgetsByScreen(state, screen));
	const activeWidget = selectedWidgets?.find((widget) => widget.id === widgetId);

	// Use ConsensusSize for sizing

	useEffect(() => {
		if (activeWidget?.size) {
			setSize(activeWidget.size);
		} else {
			setSize('small');
		}
	}, [setSize, activeWidget?.size]);

	const handleSaveBtnClick = () => {
		setEdit(false);
		dispatch(updateWidgetSize({ screen, widgetId, size }));
		const selectedTicker = dummyData.find((ticker) => ticker.ticker === input);
		setTicker(selectedTicker);
	};

	/* 	const override = {
		display: 'block',
		margin: '0 auto',
		borderColor: '#2151C0',
	};
 */

	const customColor = (percentage) => {
		if (percentage >= 65) {
			return 'text-[#37CAA8]';
		} else {
			return 'text-[#EB5858]';
		}
	};

	return (
		<div
			className={`${
				size === 'small' ? 'w-[580px]' : size === 'medium' ? 'w-[680px]' : 'w-[780px]'
			}    rounded-xl bg-[#232729] dark:border-none border border-lightSilver`}
		>
			{edit ? (
				<WidgetConfiguration
					size={size}
					setSize={setSize}
					isResizable={true}
					edit={edit}
					setEdit={setEdit}
					isInputBased={true}
					input={input}
					setInput={setInput}
					screen={screen}
					widgetId={widgetId}
					handleSaveBtnClick={handleSaveBtnClick}
				/>
			) : (
				<>
					<div
						className={`${
							size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-xl'
						}  font-semibold text-[#D2DDE5] px-4 py-3 flex justify-between items-center bg-[#191B1D] rounded-t-xl `}
					>
						<h2>
							Consensus: {ticker.name} ({ticker.ticker})
						</h2>{' '}
						<MdInfoOutline onClick={() => setEdit(!edit)} size={20} className="cursor-pointer text-xl text-[#D2DDE5]" />
					</div>
					<div
						className={`flex justify-between font-medium border-b border-[#2D3133] ${
							size === 'small' ? 'text-xs py-2 px-3' : size === 'medium' ? 'text-sm py-3 px-4' : 'text-base py-4 px-5'
						}`}
					>
						<span className={`w-2/4 ${customColor(ticker.buysPercentage)} `}>Buys</span>
						<span className="text-[#B5BCBF] ">{ticker.buys}</span>
						<span className="text-[#B5BCBF]">{ticker.buysPercentage}</span>
					</div>
					<div
						className={`flex justify-between py-2 px-3 f border-b border-[#2D3133] ${
							size === 'small' ? 'text-xs py-2 px-3' : size === 'medium' ? 'text-sm py-3 px-4' : 'text-base py-4 px-5'
						}`}
						py-4
						px-5
					>
						<span className={`w-2/4 ${customColor(ticker.buysPercentage)} `}>Holds</span>
						<span className="text-[#B5BCBF]">{ticker.holds}</span>
						<span className="text-[#B5BCBF]">{ticker.holdsPercentage}</span>
					</div>
					<div
						className={`flex justify-between font-medium border-b border-[#2D3133] ${
							size === 'small' ? 'text-xs py-2 px-3' : size === 'medium' ? 'text-sm py-3 px-4' : 'text-base py-4 px-5'
						}`}
					>
						<span className={`w-2/4 ${customColor(ticker.buysPercentage)} `}>Sells</span>
						<span className="text-[#B5BCBF]">{ticker.sells}</span>
						<span className="text-[#B5BCBF]">{ticker.sellsPercentage}</span>
					</div>
					<div
						className={`flex justify-between font-medium border-b border-[#2D3133] ${
							size === 'small' ? 'text-xs py-2 px-3' : size === 'medium' ? 'text-sm py-3 px-4' : 'text-base py-4 px-5'
						}`}
					>
						<span className={`w-2/4 ${customColor(ticker.buysPercentage)} `}>Currency</span>
						<span className="text-[#B5BCBF]">USD</span>
					</div>
					<div
						className={`flex justify-between font-medium border-b border-[#2D3133] ${
							size === 'small' ? 'text-xs py-2 px-3' : size === 'medium' ? 'text-sm py-3 px-4' : 'text-base py-4 px-5'
						}`}
					>
						<span className={`w-2/4 ${customColor(ticker.buysPercentage)} `}>Tgt Px</span>
						<span className="text-[#B5BCBF]">{ticker.targetPrice}</span>
					</div>
					<div className="py-4 "></div>
				</>
			)}
		</div>
	);
};

export default Consensus;
