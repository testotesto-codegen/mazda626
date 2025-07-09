import { MdInfoOutline } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import WidgetConfiguration from '../WidgetConfiguration/WidgetConfiguration';
import { updateWidgetSize, selectWidgetsByScreen } from '../../../redux/slices/widgetSlice';
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types

const data = [
	{
		id: 1,
		name: 'UBS',
		analyst: 'THILL',
		recommendation: 'Buy',
		targetPrice: '100',
		date: '5/27/15',
		oneYearReturn: '15.26%',
		barr: '1st',
		rank: '5th',
	},
	{
		id: 2,
		name: 'UBS',
		analyst: 'THILL',
		recommendation: 'Buy',
		targetPrice: '100',
		date: '5/27/15',
		oneYearReturn: '15.26%',
		barr: '1st',
		rank: '5th',
	},
	{
		id: 3,
		name: 'UBS',
		analyst: 'THILL',
		recommendation: 'Buy',
		targetPrice: '100',
		date: '5/27/15',
		oneYearReturn: '15.26%',
		barr: '1st',
		rank: '5th',
	},
	{
		id: 4,
		name: 'UBS',
		analyst: 'THILL',
		recommendation: 'Buy',
		targetPrice: '100',
		date: '5/27/15',
		oneYearReturn: '15.26%',
		barr: '1st',
		rank: '5th',
	},
	{
		id: 5,
		name: 'UBS',
		analyst: 'THILL',
		recommendation: 'Buy',
		targetPrice: '100',
		date: '5/27/15',
		oneYearReturn: '15.26%',
		barr: '1st',
		rank: '5th',
	},
];

const EtfsSize = {
	small: { width: "350px", height: "270px" },
	medium: { width: "520px", height: "270px" },
	large: { width: "590px", height: "270px" },
};

const Etfs = ({ widgetId, screen }) => {
	const [input, setInput] = useState(null);
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

	const headings = [
		{ id: 1, title: '#' },
		{ id: 2, title: 'ETFS' },
		{ id: 3, title: 'Analyst' },
		{ id: 4, title: 'Recommendation' },
		{ id: 6, title: 'Tgt Px' },
		{ id: 7, title: 'Date' },
		{ id: 8, title: '1 yr Rtn' },
		{ id: 9, title: 'BARR' },
		{ id: 10, title: 'Rank' },
	];

	return (
		<div
			className="bg-[#2D3133] dark:border-none rounded-xl border border-lightSilver shadow-md"
			style={{
				width: EtfsSize[size]?.width,
				height: EtfsSize[size]?.height,
			}}
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
						<h2>ETFs</h2> <MdInfoOutline onClick={() => setEdit(!edit)} size={20} className="cursor-pointer text-xl text-[#D2DDE5]" />
					</div>
					<div
						className={`${
							size === 'small' ? 'text-xs py-2' : size === 'medium' ? 'text-sm py-3' : size === 'large' ? 'text-base py-4' : ''
						}    flex px-1 justify-between break-words gap-2 text-left items-center bg-[#191B1D] font-semibold text-[#667177]`}
					>
						{headings.map((heading) => (
							<span key={heading.id} className={` text-left ${heading.title === 'ETFS' ? 'w-[20%]' : 'w-[10%]'}`}>
								{heading.title}
							</span>
						))}
					</div>
					<div className="[&>*:nth-child(odd)]:bg-[#232729]">
						{data?.map((item, i) => (
							<div
								key={i}
								className={`flex justify-between text-center gap-2 px-1 ${
									size === 'small' ? 'text-xs py-2' : size === 'medium' ? 'text-sm py-3' : size === 'large' ? 'text-base py-4' : ''
								}`}
							>
								{Object.keys(item).map((key, i) => (
									<span
										key={i}
										className={`text-left ${key === 'name' ? 'w-[20%]' : 'w-[10%]'} ${
											key === 'oneYearReturn' || key === 'id' ? 'text-[#37CAA8]' : 'text-[#B5BCBF]'
										} 
                                         
                                        `}
									>
										{item[key]}
									</span>
								))}
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default Etfs;
