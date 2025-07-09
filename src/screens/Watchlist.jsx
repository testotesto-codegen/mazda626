import { useEffect, useState } from 'react';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { MdAdd } from 'react-icons/md';
import TickerModal from '../components/dashboard/Watchlist/TickerModal';
import { useGetWatchlistQuery } from '../api/endpoints/widgetDataApi';
import ClipLoader from 'react-spinners/ClipLoader';

const columnHelper = createColumnHelper();

const columns = [
	columnHelper.accessor('symbol', {
		header: 'Symbol',
		cell: ({ row }) => {
			return <span className="text-[#37CAA8]">{row.original.symbol}</span>;
		},
	}),
	columnHelper.accessor('name', {
		header: 'Company Name',
	}),
	columnHelper.accessor('price', {
		header: 'Last Price',
		cell: ({ row }) => {
			return <span>${row.original.price}</span>;
		},
	}),
	columnHelper.accessor('change', {
		header: 'Change',
		cell: ({ row }) => {
			const isPositive = Math.sign(row.original.change) === 1;
			return (
				<span className={`${isPositive ? 'text-[#37CAA8]' : 'text-[#EB5858]'} `}>
					{row.original.change}
				</span>
			);
		},
	}),
	columnHelper.accessor('percentChange', {
		header: '% Change',
		cell: ({ row }) => {
			const isPositive = Math.sign(row.original.percentChange) === 1;
			return (
				<span className={`${isPositive ? 'text-[#37CAA8]' : 'text-[#EB5858]'} `}>
					{row.original.percentChange}%
				</span>
			);
		},
	}),
	columnHelper.accessor('volume', {
		header: 'Volume',
	}),
	columnHelper.accessor('marketCap', {
		header: 'Market Cap',
	}),
];

const Watchlist = () => {
	const [data, setData] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [tickerInput, setTickerInput] = useState(null);
	const [fetch, setFetch] = useState(false);
	const {
		data: watchlistData,
		isFetching,
		isError,
	} = useGetWatchlistQuery(tickerInput, {
		skip: !fetch,
	});

	const handleClick = () => {
		setFetch(true);
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (watchlistData !== undefined) {
			setData((prev) => [...prev, ...watchlistData]);
			setTickerInput(null);
			setFetch(false);
		}
	}, [watchlistData]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const override = {
		display: 'block',
		margin: '0 auto',
		borderColor: '#2151C0',
	};

	return (
		<div className="relative py-3 px-5 bg-[#1D2022] min-h-screen flex flex-col items-center">
			{isModalOpen && (
				<TickerModal
					setIsModalOpen={setIsModalOpen}
					tickerInput={tickerInput}
					setTickerInput={setTickerInput}
					handleClick={handleClick}
				/>
			)}
			<section className="w-full max-w-[1440px]">
				<div className="flex justify-between items-end mb-8">
					<h2 className="text-[#D2DDE5] text-2xl font-medium">Watch list</h2>
					<button
						onClick={() => setIsModalOpen(true)}
						className=" bg-[#803CF0] text-white p-3 rounded-3xl "
					>
						<MdAdd size={40} />
					</button>
				</div>
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
				) : data?.length === 0 ? (
					<h2 className="text-[#667177] text-lg font-medium">No Watchlist found.</h2>
				) : (
					<table className="w-full  overflow-hidden rounded-xl">
						<thead className="bg-[#191B1D] ">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id} className="">
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className={`pb-3 pt-7 text-left px-2 text-sm font-medium text-[#667177] 
                                        ${header.id === 1 ? 'rounded-l-xl' : ''}
                                        `}
										>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody className="[&>*:nth-child(even)]:bg-[#282C2F] [&>*:nth-child(odd)]:bg-[#1F2224]">
							{table.getRowModel().rows.map((row) => (
								<tr key={row.id}>
									{row.getVisibleCells().map((cell) => {
										return (
											<td key={cell.id} className="text-[#B5BCBF] text-xs font-medium px-2 py-4">
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				)}
			</section>
		</div>
	);
};

export default Watchlist;
