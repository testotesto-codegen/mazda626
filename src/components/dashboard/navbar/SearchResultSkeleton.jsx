export const SearchSymbolsSkeleton = () => {
	return (
		<div className="w-full flex flex-col gap-2">
			{[...Array(3)].map((_, index) => (
				<div
					key={index}
					className="flex justify-between items-center text-sm cursor-pointer border-b border-[#1D2022] py-2 px-3 animate-pulse bg-[#1D2022]"
				>
					<span className="font-semibold  bg-[#5e5967] rounded h-4 w-20"></span>
					<div className="flex flex-col gap-1 font-medium">
						<span className="bg-[#5e5967] rounded h-3 w-16"></span>
						<span className="bg-[#5e5967] rounded h-3 w-20"></span>
					</div>
				</div>
			))}
		</div>
	);
};

export const NewsSkeleton = () => {
	return (
		<div className="w-full flex flex-col gap-2">
			{[...Array(2)].map((_, index) => (
				<div key={index} className="py-2 px-3 rounded-lg flex flex-col gap-1 bg-[#161616] animate-pulse">
					<p className="text-sm font-semibold text-[#722BE8] bg-[#5e5967] rounded h-4 w-[11/12]"></p>
					<span className="text-[#FFFFFF] text-xs bg-[#5e5967] rounded h-3 w-40"></span>
				</div>
			))}
		</div>
	);
};
