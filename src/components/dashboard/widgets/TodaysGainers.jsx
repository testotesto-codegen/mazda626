import { MdInfoOutline } from 'react-icons/md';
import { useGetGainersQuery } from '../../../api/endpoints/widgetDataApi';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import WidgetConfiguration from '../WidgetConfiguration/WidgetConfiguration';
import ClipLoader from 'react-spinners/ClipLoader';
import { updateWidgetSize, selectWidgetsByScreen } from '../../../redux/slices/widgetSlice';
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types
const TodaysGainersSize = {
	small: { width: "320", height: "330" },
	medium: { width: "420", height: "440" },
	large: { width: "520", height: "520" },
};

const TodaysGainers = ({ widgetId, screen }) => {
	const { data, isLoading, isError } = useGetGainersQuery('gainers');
	const [size, setSize] = useState('small');
	const [edit, setEdit] = useState(false);
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
			className="bg-[#2D3133] dark:border-none rounded-xl border border-lightSilver shadow-md pb-2"
			style={{ width: TodaysGainersSize[size]?.width }}
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
				<>
					<div
						className={`${
							size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-xl'
						}  font-semibold text-[#D2DDE5] px-4 py-3 flex justify-between items-center bg-[#191B1D] rounded-t-xl `}
					>
						<h2>Today&#39;s Gainer</h2>{' '}
						<div
							className="cursor-pointer text-xl text-[#D2DDE5] relative z-10"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setEdit(!edit);
							}}
							onMouseDown={(e) => e.stopPropagation()}
						>
							<MdInfoOutline size={20} />
						</div>
					</div>
					<div
						className={`${
							size === 'small' ? 'text-xs py-2' : size === 'medium' ? 'text-sm py-3' : size === 'large' ? 'text-md py-4' : ''
						}   custom-stripe  px-3 flex justify-between text-center items-center bg-[#191B1D] font-semibold text-[#667177]`}
					>
						<span className="w-1/3">Company</span>
						<span className="w-1/3">Price ($)</span>
						<span className="w-1/3">Change %</span>
					</div>

					{data?.map((item, i) => (
						<div
							key={i}
							className={`${
								size === 'small' ? 'text-xs py-3' : size === 'medium' ? 'text-sm py-4' : size === 'large' ? 'text-md py-5' : ''
							}  flex justify-between items-center px-3 font-medium text-[#B5BCBF] text-center ${
								i !== 0 ? 'border-t border-[#3D4042]' : ''
							} `}
						>
							<span className="w-1/3"> {item.name} </span>
							<span className="w-1/3">{item.price}</span>

							<div className={`w-1/3`}>
								<span className={`text-[#B5BCBF] bg-[#1D2022] py-1 px-3 text-center rounded-full font-normal`}>
									{Math.round(item.percentChange)} %
								</span>
							</div>
						</div>
					))}
				</>
			)}
		</div>
	);
};
export { TodaysGainersSize };
export default TodaysGainers;
