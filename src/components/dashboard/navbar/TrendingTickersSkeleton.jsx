const TrendingTickersSkeleton = () => {
	return (
		<div className="w-full flex flex-wrap justify-center gap-2">
			{Array.from({ length: 4 }).map((_, index) => (
				<div key={index} className="flex gap-4 bg-[#1D2022] py-2 px-4 rounded-full animate-pulse">
					<div className="bg-[#fff] rounded-full w-10 h-4"></div>
					<div className="bg-[#40FED1] rounded-full w-14 h-4"></div>
				</div>
			))}
		</div>
	);
};

export default TrendingTickersSkeleton;
