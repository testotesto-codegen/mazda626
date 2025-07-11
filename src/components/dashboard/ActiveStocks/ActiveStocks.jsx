/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { selectWidgetsByScreen, updateWidgetSize } from '../../../redux/slices/widgetSlice';
import { MdInfoOutline } from 'react-icons/md';
import { useGetTrendingStocksQuery } from '../../../api/endpoints/widgetDataApi';
import WidgetConfiguration from '../WidgetConfiguration/WidgetConfiguration';
import ClipLoader from 'react-spinners/ClipLoader';
import { useSelector } from 'react-redux';

const ActiveStocks = ({ widgetId, screen }) => {
	const { data, isLoading, isError, error } = useGetTrendingStocksQuery();
	const [edit, setEdit] = useState(false);
	const [size, setSize] = useState('');
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

	return (
		<div
			className={`${
				size === 'small' ? 'w-[360px]' : size === 'medium' ? 'w-[410px]' : 'w-[460px]'
			}    rounded-xl bg-[#2D3133] dark:border-none border border-lightSilver`}
		>
			{isLoading ? (
				<div className="h-full flex items-center justify-center bg-[#1F2023]">
					<ClipLoader color="#fff" loading={isLoading} cssOverride={override} size={30} aria-label="Loading Spinner" data-testid="loader" />
				</div>
			) : edit ? (
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
				<div>
					<div className="flex justify-end p-2 rounded-t-xl bg-[#191B1D] ">
						<span className="cursor-pointer text-xl text-[#D2DDE5] " onClick={() => setEdit(!edit)}>
							{<MdInfoOutline />}
						</span>
					</div>
					<div className="px-4 pb-3 bg-[#191B1D] ">
						<span className={`${size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-md'}  font-bold text-[#D2DDE5]`}>
							{' '}
							Most Trending Stocks{' '}
						</span>
					</div>
					<div
						className={`${
							size === 'small' ? 'text-xs py-2' : size === 'medium' ? 'text-sm py-2' : 'text-md py-3'
						} custom-stripe  px-6 flex justify-between items-center bg-[#191B1D]  font-semibold text-[#D2DDE5]`}
					>
						<span>Company</span>
						<span>Score</span>
					</div>
					<div className="pb-2">
						{data?.map((item, i) => (
							<div
								key={i}
								className={`${
									size === 'small' ? 'py-2 text-xs' : size === 'medium' ? 'py-3 text-sm' : 'py-4 text-md'
								} px-6 flex justify-between items-center font-medium text-[#B5BCBF]`}
							>
								<span className="w-3/5">{item?.shortName}</span>
								<span className=" bg-[#1D2022] py-1 px-2 text-center rounded-lg font-normal">{item?.score} %</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ActiveStocks;
