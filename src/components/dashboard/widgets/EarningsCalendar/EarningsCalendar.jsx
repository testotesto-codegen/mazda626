/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { selectWidgetsByScreen, updateWidgetSize } from '../../../../redux/slices/widgetSlice';
import { MdInfoOutline, MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import WidgetConfiguration from '../../WidgetConfiguration/WidgetConfiguration';
import ClipLoader from 'react-spinners/ClipLoader';
import { useSelector } from 'react-redux';
import CalendarComponent from './CalendarComponent';
import DateRange from './DateRange';
import { useGetEarningsCalendarQuery, useGetEarningsCountQuery } from '../../../../api/endpoints/widgetDataApi';
import TickerSearch from './TickerSearch';

const EarningsCalendarSize = {
	small: { width: "350px", height: "270px" },
	medium: { width: "520px", height: "270px" },
	large: { width: "590px", height: "270px" },
};

const EarningsCalendar = ({ widgetId, screen }) => {
	const [edit, setEdit] = useState(false);
	const [size, setSize] = useState('');
	const [weeklyData, setWeeklyData] = useState([]);
	const [dateRange, setDateRange] = useState('');
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [search, setSearch] = useState('');
	console.log('search', search);
	const { data, isFetching, isError } = useGetEarningsCalendarQuery({ date: selectedDate, input: search });

	// const { data, isFetching, isError } = useGetEarningsCalendarQuery(search, {
	// 	skip: search === '',
	// });
	//console.log('dateRange', dateRange);
	const { data: countData } = useGetEarningsCountQuery(dateRange);

	const dispatch = useDispatch();
	const selectedWidgets = useSelector((state) => selectWidgetsByScreen(state, screen));
	const activeWidget = selectedWidgets?.find((widget) => widget.id === widgetId);

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
	};

	const override = {
		display: 'block',
		margin: '0 auto',
		borderColor: '#2151C0',
	};

	// convert YYYY-MM-DD to Day, Month Date
	const formatDate = (date) => {
		const options = {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		};
		return new Date(date).toLocaleDateString('en-US', options);
	};

	return (
		<div
			className={`${
				size === 'small' ? 'w-[1150px]' : size === 'medium' ? 'w-[550px]' : 'w-[650px]'
			}    rounded-xl bg-[#2D3133] dark:border-none border border-lightSilver`}
		>
			{edit ? (
				<WidgetConfiguration
					size={size}
					setSize={setSize}
					isResizable={true}
					edit={edit}
					setEdit={setEdit}
					isInputBased={false}
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
						<h2>Events Calendar for: </h2>
						<CalendarComponent setWeeklyData={setWeeklyData} dateRange={dateRange} setDateRange={setDateRange} />
						<TickerSearch setSearch={setSearch} />
						<MdInfoOutline onClick={() => setEdit(!edit)} size={20} className="cursor-pointer text-xl text-[#D2DDE5]" />
					</div>
					<DateRange
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						weeklyData={weeklyData}
						setWeeklyData={setWeeklyData}
						dateRange={dateRange}
						setDateRange={setDateRange}
						earningsCount={countData}
					/>
					{isFetching ? (
						<div className="h-full flex items-center justify-center bg-[#1F2023]">
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
							<div className="py-1 px-3 bg-[#191B1D] space-x-3">
								<span className="text-[#D2DDE5] text-sm font-medium">Earnings on {formatDate(selectedDate)}</span>
								<span className="text-[#9EA7AE] text-xs font-medium">(264 Earnings)</span>
							</div>
							<div
								className={`bg-[#191B1D] py-2 px-3 flex justify-between gap-6 text-center items-center font-normal text-[#667177] ${
									size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-xl'
								} `}
							>
								{data?.columns?.map((column) => (
									<span className="flex-1" key={column.id}>
										{column.label}
									</span>
								))}
							</div>
							<div>
								{data?.rows.length > 0 ? (
									data?.rows?.map((row, i) => (
										<div
											key={i}
											className={` py-2 px-3 flex justify-between gap-6 text-center items-center font-normal text-[#D2DDE5] ${
												size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-xl'
											}  `}
										>
											{row.map((cell, i) => (
												<span key={i} className="flex-1">
													{cell === null ? '-' : cell}
												</span>
											))}
										</div>
									))
								) : (
									<div className="h-40 flex items-center justify-center bg-[#191B1D] ">
										<p className="text-[#D2DDE5] text-sm">No data available</p>
									</div>
								)}
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default EarningsCalendar;
