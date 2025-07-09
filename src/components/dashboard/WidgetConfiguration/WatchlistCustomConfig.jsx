import { useEffect, useState } from 'react';

// eslint-disable-next-line react/prop-types
export const WatchlistCustomConfig = ({ stockIcon, setInput, selectedOption, setSelectedOption, input }) => {
	//const [customWatchlist, setCustomWatchlist] = useState(false);
	const handleCustomOptionChange = (event) => {
		setSelectedOption(event.target.value);
	};

	const handlePrebuiltOptionChange = (event) => {
		setSelectedOption(event.target.value);
		setInput(' ');
	};

	return (
		<div className="flex flex-col py-5 border-y border-lightSilver space-y-2 text-center text-darkGrey dark:text-white">
			<div className="flex items-center space-x-3">
				<img src={stockIcon} alt="" className="w-6" />
				<span className="text-sm font-medium ">How do you want to configure Watchlist widget?</span>
			</div>
			<div className="flex flex-col mx-auto justify-start items-center gap-1 font-normal text-sm">
				<label className="flex gap-2">
					<input type="radio" value="option1" checked={selectedOption === 'option1'} onChange={handleCustomOptionChange} />
					Create your custom Watchlist
				</label>
				{selectedOption === 'option1' && (
					<input
						type="text"
						className=" outline-none border border-inputGrey p-2 bg-inputGrey dark:bg-searchbarGrey dark:border-none rounded-md text-xs dark:text-white w-4/5 my-1"
						placeholder="GOOGL, AAPL, TSLA - Max 5 tickers"
						onChange={(e) => setInput(e.target.value)}
					/>
				)}
				<label className="flex gap-2">
					<input type="radio" value="option2" checked={selectedOption === 'option2'} onChange={handlePrebuiltOptionChange} />
					Get Prebuilt Watchlist from the market
				</label>
			</div>
		</div>
	);
};
/*
    <input
        type="text"
        className=" outline-none border border-inputGrey p-2 bg-inputGrey dark:bg-searchbarGrey dark:border-none rounded-md text-xs dark:text-white w-4/5"
        placeholder="GOOGL, AAPL, TSLA - Max 5 tickers"
        onChange={(e) => setInput(e.target.value)}
    />
*/
