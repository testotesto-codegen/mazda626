import { useState, useEffect } from 'react';
import { MdKeyboardArrowDown, MdInfoOutline } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useGetFiftyTwoWeeksQuery } from '../../../api/endpoints/widgetDataApi';
import WidgetConfiguration from '../WidgetConfiguration/WidgetConfiguration';
import { updateWidgetData, selectWidgetsByScreen, updateWidgetSize } from '../../../redux/slices/widgetSlice';
import { useSelector } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';

// eslint-disable-next-line react/prop-types
const FiftyTwoWeeklyStats = ({ widgetId, screen }) => {
	const dispatch = useDispatch();
	// state to toggle between high and low
	const [isHigh, setIsHigh] = useState(true);
	// state to toggle between edit and view mode
	const [edit, setEdit] = useState(false);
	// state to toggle between widget sizes
	const [size, setSize] = useState('');
	// state to handle input from user
	const [input, setInput] = useState([]);
	// state to store stock ticker symbols from user input
	const [tickers, setTickers] = useState([]);
	// state to hold stock data from API or redux store
	const [stocks, setStocks] = useState([]);
	// state to check if data needs to be fetched from API
	const [fetch, setFetch] = useState(false);
	// get widget data from redux store
	const selectedWidgets = useSelector((state) => selectWidgetsByScreen(state, screen));
	const activeWidget = selectedWidgets?.find((widget) => widget.id === widgetId);

	const { data, isFetching, isLoading, isSuccess, isError } = useGetFiftyTwoWeeksQuery(tickers, {
		skip: !fetch, // Always call the hook, but conditionally skip the query
	});

	useEffect(() => {
		// Check if data already exists in the state or local storage
		if (activeWidget?.data) {
			setStocks(activeWidget.data);
		} else if (!activeWidget?.data && !fetch) {
			// If there is no data and fetch is false, display the widget configuration
			setEdit(true);
		}
	}, [activeWidget?.data, fetch]);

	useEffect(() => {
		// This useEffect is responsible for updating the 'stocks' state when data is fetched
		if (isSuccess && data) {
			setStocks(data);
			dispatch(updateWidgetData({ screen, widgetId, data })); // Save data to Redux
			setFetch(false); // Reset 'fetch' to false
			setEdit(false); // Close widget configuration
			setInput([]); // Reset input
		}
	}, [isSuccess, data, dispatch, setFetch, setEdit, screen, widgetId]);

	useEffect(() => {
		// This useEffect is responsible for updating the size of the widget when the widget is resized
		if (activeWidget?.size) {
			setSize(activeWidget.size);
		} else {
			setSize('small');
		}
	}, [setSize, activeWidget?.size]);

	const handleSaveBtnClick = () => {
		// Set the tickers and initiate data fetching
		setTickers(input);
		setFetch(true); // Set fetch to true to trigger the query
		dispatch(updateWidgetSize({ screen, widgetId, size })); // Save the widget size to Redux
	};

	const override = {
		display: 'block',
		margin: '0 auto',
		borderColor: '#2151C0',
	};

	return (
		<div
			className={`${
				size === 'small'
					? ' w-[320px] h-[360px]'
					: size === 'medium'
					? ' w-[420px] h-[460px]'
					: size === 'large'
					? ' w-[520px] h-[480px]'
					: ''
			} dark:border-none h-full py-1 font-inter rounded-xl border border-lightSilver bg-[#1D2022] shadow-xl `}
		>
			{isLoading ? (
				<div className="h-full flex items-center justify-center bg-[#1D2022]">
					<ClipLoader color="#fff" loading={isLoading} cssOverride={override} size={30} aria-label="Loading Spinner" data-testid="loader" />
				</div>
			) : edit ? (
				<WidgetConfiguration
					widgetId={widgetId}
					screen={screen}
					setEdit={setEdit}
					size={size}
					setSize={setSize}
					input={input}
					setInput={setInput}
					handleSaveBtnClick={handleSaveBtnClick}
					isResizable={activeWidget?.isResizable}
					isInputBased={true}
				/>
			) : (
				<div className="bg-[#1D2022]">
					<div className="flex justify-end p-1 bg-[#191B1D] ">
						{!edit && (
							<span className="cursor-pointer text-xl text-darkGrey dark:text-white" onClick={() => setEdit(!edit)}>
								{<MdInfoOutline />}
							</span>
						)}
					</div>

					<div className="bg-[#1D2022]">
						<div
							className={`${
								size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : size === 'large' ? 'text-md' : ''
							}  flex justify-between items-center px-4 py-2 bg-[#191B1D] text-[#D2DDE5]`}
						>
							<span className="font-bold ">52 Week High/Low</span>
							<div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsHigh(!isHigh)}>
								<span className=" font-medium">{isHigh ? 'High' : 'Low'}</span>
								<MdKeyboardArrowDown />
							</div>
						</div>
						<div
							className={`${
								size === 'small' ? 'text-xs py-2' : size === 'medium' ? 'text-sm py-4' : size === 'large' ? 'text-md py-5' : ''
							}   custom-stripe px-6 flex justify-between items-center bg-[#191B1D] text-[#D2DDE5] font-semibold `}
						>
							<span>Company</span>

							<span>{isHigh ? 'High Value' : 'Low Value'}</span>
						</div>

						<div className="pb-2 ">
							{stocks?.map((item, i) => (
								<div
									key={i}
									className={`${
										size === 'small' ? 'text-xs py-3' : size === 'medium' ? 'text-sm py-5' : size === 'large' ? 'text-md py-6' : ''
									} px-6 flex justify-between items-center font-medium `}
								>
									<span className="w-2/3 text-[#B5BCBF]">{item.shortName}</span>

									<div
										className={`${isHigh ? 'text-[#B5BCBF]' : 'text-red-500'} bg-[#393A3D] py-2 px-3 text-center rounded-lg font-normal`}
									>
										{isHigh ? Math.round(item.fiftyTwoWeekHigh) : Math.round(item.fiftyTwoWeekLow)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default FiftyTwoWeeklyStats;
