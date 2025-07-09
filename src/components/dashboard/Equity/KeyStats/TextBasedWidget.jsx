/* eslint-disable react/prop-types */
const TextBasedWidget = (props) => {
	console.log(props);
	return (
		<div className={`${props.className} bg-[#232729] min-h-fit rounded-lg cursor-grab`}>
			<div className="bg-[#343434] text-[#D2DDE5] text-sm font-medium rounded-t-lg py-2 px-3">
				{props?.title}
			</div>
			<p className="py-3 px-4 text-xs text-[#9EA7AE] font-light leading-relaxed">
				{props?.content}
			</p>
		</div>
	);
};

export default TextBasedWidget;
