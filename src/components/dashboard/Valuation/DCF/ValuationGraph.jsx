/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import GraphTypeDropdown from './GraphTypeDropdown';
import { MdOutlineClose } from 'react-icons/md';

const ValuationGraph = ({ setShowGraph }) => {
	const svgRef = useRef(null);

	useEffect(() => {
		const svg = d3.select(svgRef.current);

		// Generate dummy data
		const n = 100;
		const data = d3.range(n).map(() => d3.randomNormal(0, 1)());

		const quantiles = d3.range(0, 1, 1 / n).map((q) => d3.quantile(data.sort(d3.ascending), q));

		const width = 600;
		const height = 500;
		const marginTop = 20;
		const marginRight = 40;
		const marginBottom = 30;
		const marginLeft = 40;

		const x = d3
			.scaleLinear()
			.domain([d3.min(quantiles), d3.max(quantiles)])
			.nice()
			.range([marginLeft, width - marginRight]);

		const y = d3
			.scaleLinear()
			.domain([d3.min(data), d3.max(data)])
			.nice()
			.range([height - marginBottom, marginTop]);

		svg.selectAll('*').remove();

		svg.attr('viewBox', [0, 0, width, height]).style('max-width', `${width}px`);

		svg
			.append('g')
			.attr('transform', `translate(0,${height - marginBottom + 6})`)
			.call(d3.axisBottom(x.copy().interpolate(d3.interpolateRound)))
			.call((g) => g.select('.domain').remove())
			.call((g) =>
				g
					.selectAll('.tick line')
					.attr('stroke', 'white')
					.clone()
					.attr('stroke-opacity', 0.1)
					.attr('y1', -height)
			)
			.call((g) => g.selectAll('.tick text').style('fill', 'white'));

		svg
			.append('g')
			.attr('transform', `translate(${marginLeft - 6},0)`)
			.call(d3.axisLeft(y.copy().interpolate(d3.interpolateRound)))
			.call((g) => g.select('.domain').remove())
			.call((g) =>
				g
					.selectAll('.tick line')
					.attr('stroke', 'white')
					.clone()
					.attr('stroke-opacity', 0.1)
					.attr('x1', width)
			)
			.call((g) => g.selectAll('.tick text').style('fill', 'white'));

		svg
			.append('line')
			.attr('stroke', '#fff')
			.attr('stroke-opacity', 0.5)
			.attr('x1', x(d3.min(quantiles)))
			.attr('x2', x(d3.max(quantiles)))
			.attr('y1', y(d3.min(data)))
			.attr('y2', y(d3.max(data)));

		svg
			.append('g')
			.attr('fill', '#D940FF')
			.attr('stroke', 'none')
			.selectAll('circle')
			.data(d3.range(n))
			.join('circle')
			.attr('cx', (i) => x(quantiles[i]))
			.attr('cy', (i) => y(data[i]))
			.attr('r', 3);
	}, []);

	return (
		<div className="bg-black bg-opacity-90 min-h-screen w-screen absolute top-0 bottom-0 left-0 right-0 z-[1000] grid place-items-center ">
			<div className="min-h-full w-1/2 ml-auto bg-[#1D2022] relative  z-[2000]">
				<button
					onClick={() => setShowGraph(false)}
					className="bg-[#121416] p-2 rounded-full absolute top-1 right-6 text-white cursor-pointer z-[2000]"
				>
					<MdOutlineClose size={16} />
				</button>
				<div className="relative pt-14">
					<svg ref={svgRef} />
					<div className="absolute top-12 left-14">
						<GraphTypeDropdown />
					</div>
					<button className="absolute top-12 right-10 bg-[#D9D9D9] text-[#000] text-sm py-1 w-64 px-4 text-center rounded-full ">
						Tool Bar
					</button>
				</div>
				<button className="bg-[#A16BFB] rounded-full py-2 w-[220px] mx-auto mt-8 font-semibold text-sm text-[#F2F2F2] flex justify-center items-center">
					Apply
				</button>
				<button className="border-2 border-[#A16BFB] rounded-full py-2 w-[220px] mx-auto mt-3 font-semibold text-sm text-[#F2F2F2] flex justify-center items-center">
					Download Graph
				</button>
			</div>
		</div>
	);
};

export default ValuationGraph;
