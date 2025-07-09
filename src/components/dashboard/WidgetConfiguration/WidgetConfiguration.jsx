/* eslint-disable react/prop-types */
import widgetIcon from '../../../assets/dashboard/icons/widget.png';
import stockIcon from '../../../assets/dashboard/icons/stock.png';
import newsIcon from '../../../assets/dashboard/icons/newsIcon.png';
import { deleteWidget } from '../../../redux/slices/widgetSlice';
import { useDispatch } from 'react-redux';
import { MdClose } from 'react-icons/md';
import { useState } from 'react';
import { WatchlistCustomConfig } from './WatchlistCustomConfig';

const WidgetConfiguration = ({
	widgetId,
	input,
	setInput,
	setSize,
	size,
	handleSaveBtnClick,
	setEdit,
	screen,
	isResizable,
	isInputBased,
	isNewsBased,
	isWatchlist,
}) => {
	const dispatch = useDispatch();
	const [selectedOption, setSelectedOption] = useState(null);

	const handleWidgetDelete = (widgetId) => {
		dispatch(deleteWidget({ screen, widgetId }));
	};

	const handleMouseDown = (e) => {
		// Stop event propagation to prevent drag
		e.stopPropagation();
	};

	const handleClick = (e) => {
		// Stop event propagation to prevent drag
		e.stopPropagation();
	};

	return (
		<div 
			className="py-3 px-2 space-y-2 bg-[#2D3133] relative z-10"
			onMouseDown={handleMouseDown}
			onClick={handleClick}
			onDragStart={(e) => e.preventDefault()}
			draggable={false}
		>
			<button
				className=" bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-md font-semibold hover:bg-red-600 float-right"
				onClick={() => handleWidgetDelete(widgetId)}
			>
				<MdClose size={20} />
			</button>

			<div className="pt-4">
				<h1 className="text-sm font-semibold text-center text-darkGrey dark:text-white">Configure Widget</h1>
			</div>

			{isWatchlist && <WatchlistCustomConfig setInput={setInput} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />}

			{isNewsBased && (
				<div className=" py-5 border-y border-lightSilver space-y-2 text-center">
					<div className="flex items-center space-x-3">
						<img src={newsIcon} alt="" className="w-6" />
						<span className="text-sm font-medium text-darkGrey dark:text-white">Choose the News count</span>
					</div>

					<select
						className="bg-dashboardBlue p-2 rounded-sm text-white text-xs font-semibold"
						value={input}
						onChange={(e) => setInput(e.target.value)}
					>
						<option value="">Select count </option>
						<option value="3">3 articles</option>
						<option value="5">5 articles</option>
						<option value="8">8 articles</option>
					</select>
				</div>
			)}

			{isInputBased && (
				<div className=" py-5 border-y border-lightSilver space-y-2 text-center">
					<div className="flex items-center space-x-3">
						<img src={stockIcon} alt="" className="w-6" />
						<span className="text-sm font-medium text-darkGrey dark:text-white">Write the tickers separated by comma</span>
					</div>
					<input
						type="text"
						className=" outline-none border border-inputGrey p-2 bg-inputGrey dark:bg-searchbarGrey dark:border-none rounded-md text-xs dark:text-white w-4/5"
						placeholder="GOOGL, AAPL, TSLA - Max 5 tickers"
						value={input || ''}
						onChange={(e) => {
							e.stopPropagation();
							setInput(e.target.value);
						}}
						onClick={(e) => e.stopPropagation()}
						onMouseDown={(e) => e.stopPropagation()}
					/>
				</div>
			)}

			{isResizable && (
				<div className="border-b border-lightSilver py-5 space-y-2">
					<div className="flex items-center space-x-3 ">
						<img src={widgetIcon} alt="" className="w-6" />
						<span className="text-sm font-medium text-darkGrey dark:text-white">Choose widget size</span>
					</div>
					<div className="flex justify-center items-center gap-4 text-xs font-semibold ">
						<button
							onClick={() => setSize('small')}
							className={`rounded-full py-2 px-3 border border-dashboardBlue hover:bg-dashboardBlue hover:text-white ${
								size === 'small' ? 'bg-dashboardBlue text-white' : 'bg-white dark:bg-inherit text-dashboardBlue'
							}`}
						>
							{' '}
							Small{' '}
						</button>
						<button
							onClick={() => setSize('medium')}
							className={`rounded-full py-2 px-3 border border-dashboardBlue hover:bg-dashboardBlue hover:text-white  dark:hover:bg-dashboardBlue ${
								size === 'medium' ? 'bg-dashboardBlue text-white' : 'bg-white dark:bg-inherit text-dashboardBlue'
							}`}
						>
							{' '}
							Medium{' '}
						</button>
						<button
							onClick={() => setSize('large')}
							className={`rounded-full py-2 px-3 border border-dashboardBlue hover:bg-dashboardBlue hover:text-white dark:hover:bg-dashboardBlue ${
								size === 'large' ? 'bg-dashboardBlue text-white' : 'bg-white dark:bg-inherit text-dashboardBlue'
							}`}
						>
							{' '}
							Large{' '}
						</button>
					</div>
				</div>
			)}

			<div className="flex justify-center items-center space-x-4 py-5">
				<button
					onClick={() => handleSaveBtnClick()}
					disabled={(isInputBased && input.length === 0) || (isWatchlist && input === null)}
					className={`  flex justify-center items-center py-2 w-16 ${
						(isInputBased && input.length === 0) || (isWatchlist && input === null) ? 'bg-blue-300 ' : 'bg-dashboardBlue'
					}  text-white text-xs font-semibold gap-1 rounded-lg`}
				>
					{' '}
					Save
				</button>
				<button onClick={() => setEdit(false)} className="py-2 w-16 bg-lightSilver text-darkGrey text-xs font-semibold rounded-lg">
					Cancel
				</button>
			</div>
		</div>
	);
};

export default WidgetConfiguration;
