/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { selectWidgetsByScreen, updateWidgetData, updateWidgetSize } from '../../../redux/slices/widgetSlice';
import { MdInfoOutline } from 'react-icons/md';
import { useGetNewsFeedQuery } from '../../../api/endpoints/widgetDataApi';
import WidgetConfiguration from '../WidgetConfiguration/WidgetConfiguration';
import ClipLoader from 'react-spinners/ClipLoader';
import { useSelector } from 'react-redux';
import { formatDate } from '../../../utils/DateFormatter';

const NewsFeedSize = {
	small: { width: "350px", height: "270px" },
	medium: { width: "520px", height: "270px" },
	large: { width: "590px", height: "270px" },
};

const NewsFeed = ({ widgetId, screen }) => {
	const [input, setInput] = useState('');
	const [newsCount, setNewsCount] = useState('');
	const [news, setNews] = useState([]);
	const [fetch, setFetch] = useState(false);
	const [edit, setEdit] = useState(false);
	const [size, setSize] = useState('');
	const { data, isLoading, isFetching, isSuccess, isError } = useGetNewsFeedQuery(newsCount, {
		skip: !fetch,
	});

	const dispatch = useDispatch();
	const selectedWidgets = useSelector((state) => selectWidgetsByScreen(state, screen));
	const activeWidget = selectedWidgets?.find((widget) => widget.id === widgetId);

	useEffect(() => {
		if (activeWidget?.data) {
			setNews(activeWidget.data);
		} else if (!activeWidget?.data && !fetch) {
			setEdit(true);
		}
	}, [activeWidget?.data, fetch]);

	useEffect(() => {
		// This useEffect is responsible for updating the size of the widget when the widget is resized
		if (activeWidget?.size) {
			setSize(activeWidget.size);
		} else {
			setSize('small');
		}
	}, [setSize, activeWidget?.size]);

	useEffect(() => {
		if (data !== undefined && data !== news) {
			setNews(data);
			dispatch(
				updateWidgetData({
					screen,
					widgetId,
					data,
				})
			);
			setFetch(false);
			setEdit(false);
			setInput('');
		}
	}, [data, news, dispatch, screen, widgetId]);

	const handleSaveBtnClick = () => {
		setNewsCount(input);
		setFetch(true);
		dispatch(updateWidgetSize({ screen, widgetId, size }));
	};

	const handleEditClick = () => {
		setEdit(!edit);
	};

	const override = {
		display: 'block',
		margin: '0 auto',
		borderColor: '#2151C0',
	};

	// console.log('data', data);
	// //console.log('fetch', fetch);
	// console.log('edit', edit);
	// console.log('isSuccess', isSuccess);
	//console.log('input', input);
	return (
		<div
			className={`${
				size === 'small' ? 'w-[450px]' : size === 'medium' ? 'w-[520px]' : 'w-[590px]'
			}    rounded-xl bg-[#2D3133] dark:border-none border border-lightSilver`}
		>
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
			) : edit ? (
				<WidgetConfiguration
					size={size}
					setSize={setSize}
					isResizable={true}
					input={input}
					setInput={setInput}
					edit={edit}
					setEdit={setEdit}
					isInputBased={false}
					isNewsBased={true}
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
						<h2>NewsFeed</h2> <MdInfoOutline onClick={handleEditClick} size={20} className="cursor-pointer text-xl text-[#D2DDE5]" />
					</div>
					<div className="flex flex-col gap-3 p-3">
						{news?.map((item) => (
							<a key={item?.publishedAt} href={item?.url} target="_blank" rel="noreferrer">
								<div
									className={`flex flex-col gap-1 py-2 pl-2 pr-24 border border-[#3D4042] rounded-xl cursor-pointer hover:bg-[#383e41] ${
										size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-base'
									}`}
								>
									<span className="text-[#9B9B9B] font-normal">{formatDate(item?.publishedAt)}</span>
									<p className="text-white font-medium">{item?.title}</p>
									<p className="text-[#9B9B9B] font-light">{item?.summary}</p>
								</div>
							</a>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default NewsFeed;
