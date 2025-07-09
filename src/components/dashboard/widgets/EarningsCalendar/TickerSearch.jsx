import { MdOutlineSearch } from 'react-icons/md';
import dropdownIcon from '../../../../assets/icons/dropdown-icon.png';
import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const TickerSearch = ({ setSearch }) => {
	const [input, setInput] = useState('');
	const handleSearch = () => {
		setSearch(input);
	};

	return (
		<div className=" relative w-64 h-full">
			<input
				type="text"
				onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
				placeholder="Find earnings for symbol"
				className="py-2 px-8 w-full bg-[#2D3133] placeholder:text-inherit placeholder:font-normal placeholder:text-xs text-sm font-normal rounded-full"
				onChange={(e) => setInput(e.target.value)}
			/>

			<MdOutlineSearch size={22} onClick={handleSearch} className="absolute right-4  top-1/2 -translate-y-1/2 cursor-pointer" />
		</div>
	);
};

export default TickerSearch;
