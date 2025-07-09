/* eslint-disable react/prop-types */
import { MdClose } from 'react-icons/md';

const TickerModal = ({ setIsModalOpen, tickerInput, setTickerInput, handleClick }) => {
	return (
		<div className="bg-black bg-opacity-90 min-h-screen w-screen absolute top-0 bottom-0 left-0 right-0 z-[1000]">
			<div className="w-[350px] border-red-600 bg-[#232729] mx-auto mt-16 rounded-xl">
				<div className="bg-[#191B1D] text-sm font-medium py-3 px-4 rounded-t-xl flex justify-between">
					<h2 className=" text-[#D2DDE5] ">Add New Ticker</h2>
					<button
						onClick={() => setIsModalOpen(false)}
						className="bg-red-600 rounded-full p-1 text-white"
					>
						<MdClose size={16} />
					</button>
				</div>
				<div className="px-3 py-4 flex flex-col items-center gap-4">
					<input
						type="text"
						placeholder="Type a ticker symbol"
						className=" py-3 px-5 text-sm w-5/6 placeholder:text-inherit placeholder:text-xs text-[#D2DDE5] placeholder:text-[#D2DDE5] placeholder:font-medium bg-[#1D2022] rounded-full outline-none"
						value={tickerInput}
						onChange={(e) => setTickerInput(e.target.value)}
					/>
					<button
						disabled={!tickerInput}
						onClick={handleClick}
						className={`${
							tickerInput !== null ? 'bg-[#803CF0]' : 'bg-[#c29dff]'
						} rounded-full py-2 px-5 font-medium text-sm text-[#F2F2F2] flex justify-center items-center`}
					>
						Add to Watchlist
					</button>
				</div>
			</div>
		</div>
	);
};

export default TickerModal;
