/* eslint-disable react/prop-types */
import { FaDatabase } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';

const TickerInput = ({ id, compData, setCompData }) => {
	const options = ['Revenue', '# shares', 'EBIT', 'D&A', 'Cash', 'Debt'];

	const handleChange = (e) => {
		const value = e.target.value;

		setCompData(
			compData.map((comp) => {
				if (comp.id === id) {
					return {
						...comp,
						ticker: value,
					};
				}
				return comp;
			})
		);
	};

	return (
		<div className="flex items-center my-2">
			<input
				type="text"
				placeholder="Ticker"
				className="py-3 px-8 w-96 text-sm text-[#D2DDE5] placeholder:text-inherit placeholder:text-xs placeholder:font-medium bg-[#282C2F] rounded-full outline-none"
				value={compData.find((comp) => comp.id === id)?.ticker}
				onChange={handleChange}
			/>

			<button className="py-3 px-8 ml-4 text-xs text-[#D2DDE5] font-medium bg-[#803CF0] rounded-full">Process</button>
			<div className="ml-5 flex gap-4">
				{options.map((option, index) => (
					<button key={index} className="text-xs text-[#D2DDE5] flex gap-1 items-center">
						{option}
						<FaDatabase size={10} />
					</button>
				))}

				<button
					onClick={() => setCompData(compData?.filter((comp) => comp.id !== id))}
					className="p-1 w-9 h-9 flex justify-center items-center rounded-full bg-red-500"
				>
					<RiDeleteBinLine size={20} />
				</button>
			</div>
		</div>
	);
};

export default TickerInput;
