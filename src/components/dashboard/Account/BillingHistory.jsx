import { useState } from 'react';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';

const defaultData = [
	{
		date: 'Aug 1, 2023',
		name: 'Johnny',
		amount: '$650',
		plan: 'Premium',
		status: 'Successful',
	},
	{
		date: 'Aug 1, 2023',
		name: 'Johnny',
		amount: '$650',
		plan: 'Premium',
		status: 'Successful',
	},
	{
		date: 'Aug 1, 2023',
		name: 'Johnny',
		amount: '$650',
		plan: 'Premium',
		status: 'Successful',
	},
];

const columnHelper = createColumnHelper();

const columns = [
	columnHelper.accessor('date', {
		header: () => <span>Date</span>,
	}),

	columnHelper.accessor('name', {
		header: 'Name',
	}),
	columnHelper.accessor('amount', {
		header: 'Amount',
	}),
	columnHelper.accessor('plan', {
		header: 'Plan',
	}),
	columnHelper.accessor('status', {
		header: 'Status',
		cell: ({ row }) => {
			return <span className="bg-[#191B1D] py-2 px-4 rounded-full">{row.original.status}</span>;
		},
	}),
	columnHelper.accessor('view', {
		header: '',
		cell: ({ row }) => {
			return <button className="">View PDF</button>;
		},
	}),
];

const BillingHistory = () => {
	const [data, _setData] = useState(() => [...defaultData]);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	/*
	const getCellProps = (context) => {
		if (context.row.index === 0) {
			// console.log(context)
			return {
				style: { fontWeight: 'bold', minWidth: '30%', textTransform: 'uppercase' },
				className: 'bold',
			};
		}
	};
*/
	return (
		<div className="pt-6 px-6 pb-10">
			<h2 className="text-[#D2DDE5] text-sm font-normal mb-5">Billing History</h2>
			<table className="w-full overflow-hidden rounded-xl">
				<thead className="bg-[#191B1D] ">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id} className="">
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className={`py-3 text-left px-2 text-sm font-normal text-[#667177] 
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
		</div>
	);
};

export default BillingHistory;
