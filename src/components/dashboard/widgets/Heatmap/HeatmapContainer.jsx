import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteWidget, selectWidgetsByScreen, updateWidgetSize } from '../../../../redux/slices/widgetSlice';
//import { MdInfoOutline, MdArrowForward } from 'react-icons/md';
import { useSelector } from 'react-redux';
import Heatmap from './Heatmap';
import { useGetHeatmapQuery } from '../../../../api/endpoints/widgetDataApi';
import { MdInfoOutline, MdClose } from 'react-icons/md';
import ClipLoader from 'react-spinners/ClipLoader';

const HeatmapSize = {
	small: { width: 510, height: 610 },
	medium: { width: 600, height: 410 },
	large: { width: 600, height: 420 },
};

const HeatmapContainer = ({ widgetId, screen }) => {
	const [edit, setEdit] = useState(false);
	const [size, setSize] = useState('');
	const { data, isFetching, error } = useGetHeatmapQuery();
	const dispatch = useDispatch();
	const selectedWidgets = useSelector((state) => selectWidgetsByScreen(state, screen));
	const activeWidget = selectedWidgets?.find((widget) => widget.id === widgetId);

	const heatMapdata = {
		name: 'S&P 500',
		children: data,
	};

	useEffect(() => {
		if (activeWidget?.size) {
			setSize(activeWidget.size);
		} else {
			setSize('small');
		}
	}, [setSize, activeWidget?.size]);

	const handleDelete = (widgetId) => {
		dispatch(deleteWidget({ screen, widgetId }));
	};

	const handleEditClick = () => {
		setEdit(true);
	};

	const override = {

	// --- Main container usage update below ---
		display: 'block',
		margin: '0 auto',
		borderColor: '#2151C0',
	};

	return (
		<div
			className={`bg-[#2D3133] dark:border-none rounded-xl border border-lightSilver shadow-md ${
				size === 'small' ? ' w-[650px]' : size === 'medium' ? ' w-[420px]' : size === 'large' ? ' w-[520px]' : ''
			} pb-2 flex flex-col items-center `}
		>
			<div
				className={`${
					size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-xl'
				}  font-semibold w-full mb-2 text-[#D2DDE5] px-4 py-3 flex justify-between items-center bg-[#191B1D] rounded-t-xl `}
			>
				Heatmap
				{edit && (
					<MdClose
						onClick={() => handleDelete(widgetId)}
						size={16}
						className=" bg-red-500 cursor-pointer text-white w-6 h-6 rounded-full flex items-center justify-center text-md font-semibold hover:bg-red-600"
					/>
				)}
				{!edit && <MdInfoOutline onClick={handleEditClick} size={20} className="ml-auto text-[#D2DDE5] cursor-pointer" />}
			</div>

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
			) : error ? (
				<div className="h-full flex items-center justify-center ">
					<p className="text-[#D2DDE5]">An error occurred</p>
				</div>
			) : (
				<Heatmap data={heatMapdata} height={400} width={600} />
			)}
			<div className="flex gap-2 w-full justify-center items-center mt-3 p-2 text-[#D2DDE5] text-sm border-t border-[#3D4042]">
				Less
				<div className="bg-[#E66060] w-4 h-4 rounded-sm"></div>
				<div className="bg-[#F4B8B8] w-4 h-4 rounded-sm"></div>
				<div className="bg-[#FFFFFF] w-4 h-4 rounded-sm"></div>
				<div className="bg-[#7FF7E3] w-4 h-4 rounded-sm"></div>
				<div className="bg-[#059682] w-4 h-4 rounded-sm"></div>
				More
			</div>
		</div>
	);
};

export default HeatmapContainer;
