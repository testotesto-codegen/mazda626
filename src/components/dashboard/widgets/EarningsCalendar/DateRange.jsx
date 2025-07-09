/* eslint-disable react/prop-types */
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { useState } from 'react';
import { getAdjacentWeekData } from '../../../../utils/DateFormatter';

const DateRange = ({ weeklyData, setWeeklyData, setDateRange, selectedDate, setSelectedDate, earningsCount }) => {
	const options = {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	};

	const handleBtnClick = (e, direction) => {
		e.preventDefault();
		const { startRange, endRange, weekData } = getAdjacentWeekData(weeklyData, direction);
		console.log('startRange', startRange);
		const range = `${new Date(startRange).toLocaleDateString('en-US', options)} - ${new Date(endRange).toLocaleDateString(
			'en-US',
			options
		)}`;
		setDateRange(range);
		setWeeklyData(weekData);
	};

	//console.log('count', earningsCount);

	return (
		<div className="flex justify-evenly [&>*]:flex-1 [&>*]:cursor-pointer  ">
			<button
				onClick={(e) => handleBtnClick(e, 'prev')}
				className="flex flex-col gap-2 justify-center items-center px-2 py-3 text-[#D2DDE5]"
			>
				<MdArrowBackIos />
				Prev
			</button>

			{weeklyData?.map((data, i) => (
				<div
					onClick={() => setSelectedDate(data?.date + ' ' + data?.year)}
					key={i}
					className="flex flex-col gap-2 justify-center px-2 py-3 border-x border-[#323739] hover:bg-[#323739] cursor-pointer"
				>
					<span className="text-base text-[#D2DDE5] font-semibold">
						{data?.date} <span className="text-sm font-medium">{data?.day}</span>{' '}
					</span>
					{earningsCount?.length > 0 ? (
						<span className="text-xs text-[#667177] font-medium">{earningsCount[i][1]} earnings</span>
					) : (
						<span className="text-xs text-[#667177] font-medium">0 earnings</span>
					)}
				</div>
			))}

			<button
				onClick={(e) => handleBtnClick(e, 'next')}
				className="flex flex-col gap-2 justify-center items-center px-2 py-3 text-[#D2DDE5]"
			>
				<MdArrowForwardIos />
				Next
			</button>
		</div>
	);
};

export default DateRange;
