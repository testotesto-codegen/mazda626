/* eslint-disable react/prop-types */
import { MdArrowForwardIos, MdMoreHoriz } from 'react-icons/md';
import { useState } from 'react';

const data = [
	{
		id: 1,
		date: 'Today',
		session: 'APPLE (AAPL) DCF',
	},
	{
		id: 2,
		date: 'Today',
		session: 'Microsoft (MSFT) DCF',
	},
	{
		id: 3,
		date: 'Today',
		session: 'Microsoft (MSFT) DCF',
	},
	{
		id: 4,
		date: 'Past 30 days',
		session: 'Microsoft (MSFT) DCF',
	},
	{
		id: 5,
		date: 'Past 30 days',
		session: 'Microsoft (MSFT) DCF',
	},
	{
		id: 6,
		date: 'Past 30 days',
		session: 'Microsoft (MSFT) DCF',
	},
	{
		id: 7,
		date: 'Past 30 days',
		session: 'Microsoft (MSFT) DCF',
	},
];

const groupByDate = (data) => {
	return data.reduce((acc, entry) => {
		const date = entry.date;
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(entry);
		return acc;
	}, {});
};

const PastSessions = ({ setShowSessions }) => {
	const [moreOption, setMoreOption] = useState(null);
	const groupedData = groupByDate(data);

	return (
		<section className="absolute top-0 bottom-0 right-0 w-64 min-h-full z-50 bg-[#121416] p-3">
			<button
				onClick={() => setShowSessions(false)}
				className=" bg-[#393A3D] p-1 rounded-md flex items-center justify-center text-white"
			>
				<MdArrowForwardIos size={14} />
			</button>
			<h2 className="text-center text-base text-white font-semibold">Past Sessions</h2>

			<div className="flex flex-col text-white text-sm font-normal my-5">
				{Object.keys(groupedData).map((date) => (
					<div key={date}>
						<h3 className="text-[#656565] text-xs font-normal my-2">{date}</h3>
						<ul>
							{groupedData[date].map((entry) => (
								<li
									key={entry.id}
									className="hover:bg-[#202123] cursor-pointer p-2 flex justify-between items-center"
								>
									{entry.session}
									{moreOption === entry.id ? (
										<button
											className="text-xs bg-red-600 p-1 rounded-md"
											onClick={() => setMoreOption(null)}
										>
											Delete{' '}
										</button>
									) : (
										<MdMoreHoriz onClick={() => setMoreOption(entry.id)} />
									)}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	);
};

export default PastSessions;
