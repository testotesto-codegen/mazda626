import { MdExpandMore } from 'react-icons/md';
import { useState } from 'react';

const graphTypes = [
	{
		id: 1,
		type: 'Linear Regression',
	},
	{
		id: 2,
		type: 'Logistic Regression',
	},
	{
		id: 3,
		type: 'Polynomial Regression',
	},
	{
		id: 4,
		type: 'Ridge Regression',
	},
	{
		id: 5,
		type: 'Lasso Regression',
	},
	{
		id: 6,
		type: 'Tobit Regression',
	},
	{
		id: 7,
		type: 'Stepwise Regression',
	},
	{
		id: 8,
		type: 'Nonlinear Regression',
	},
	{
		id: 9,
		type: 'Center of Mass Regression',
	},
];

const GraphTypeDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedType, setSelectedType] = useState('Linear Regression');

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="bg-[#D9D9D9] text-[#000] text-sm py-1 w-64 px-4 rounded-full flex items-center justify-between"
			>
				{selectedType}
				<MdExpandMore size={16} />
			</button>
			{isOpen && (
				<ul className=" w-full bg-[#000] rounded-xl py-2">
					{graphTypes.map((graphType, i) => (
						<li
							key={graphType.id}
							onClick={() => {
								setSelectedType(graphType.type);
								setIsOpen(false);
							}}
							className={`text-[#fff] hover:bg-[#D9D9D9] hover:text-[#000] cursor-pointer font-normal text-sm py-2 px-4 ${
								i === graphTypes.length - 1 ? '' : 'border-b border-[#fff]'
							}`}
						>
							{graphType.type}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default GraphTypeDropdown;
