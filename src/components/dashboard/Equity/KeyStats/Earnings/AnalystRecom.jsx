import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';

// const data = [
// 	{ analyst: 'Analyst A', month: 'Jan', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Jan', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Jan', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Jan', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Jan', recommendation: 'sell' },
// 	{ analyst: 'Analyst A', month: 'Jan', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Jan', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Jan', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Jan', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Jan', recommendation: 'sell' },
// 	{ analyst: 'Analyst A', month: 'Jan', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Jan', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Jan', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Jan', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Jan', recommendation: 'sell' },
// 	{ analyst: 'Analyst A', month: 'Jan', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Jan', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Jan', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Jan', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Jan', recommendation: 'sell' },

// 	{ analyst: 'Analyst A', month: 'Feb', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Feb', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Feb', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Feb', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Feb', recommendation: 'sell' },
// 	{ analyst: 'Analyst A', month: 'Feb', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Feb', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Feb', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Feb', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Feb', recommendation: 'sell' },
// 	{ analyst: 'Analyst A', month: 'Feb', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Feb', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Feb', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Feb', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Feb', recommendation: 'sell' },
// 	{ analyst: 'Analyst A', month: 'Feb', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Feb', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Feb', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Feb', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Feb', recommendation: 'sell' },
// 	{ analyst: 'Analyst A', month: 'Feb', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Feb', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Feb', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Feb', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Feb', recommendation: 'sell' },

// 	{ analyst: 'Analyst A', month: 'Mar', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Mar', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Mar', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Mar', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Mar', recommendation: 'sell' },
// 	{ analyst: 'Analyst A', month: 'Mar', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Mar', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Mar', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Mar', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Mar', recommendation: 'sell' },
// 	{ analyst: 'Analyst A', month: 'Mar', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Mar', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Mar', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Mar', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Mar', recommendation: 'sell' },

// 	{ analyst: 'Analyst A', month: 'Apr', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Apr', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Apr', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Apr', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Apr', recommendation: 'sell' },
// 	{ analyst: 'Analyst A', month: 'Apr', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Apr', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Apr', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Apr', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Apr', recommendation: 'sell' },
// 	{ analyst: 'Analyst A', month: 'Apr', recommendation: 'strong buy' },
// 	{ analyst: 'Analyst B', month: 'Apr', recommendation: 'buy' },
// 	{ analyst: 'Analyst C', month: 'Apr', recommendation: 'hold' },
// 	{ analyst: 'Analyst D', month: 'Apr', recommendation: 'underperform' },
// 	{ analyst: 'Analyst E', month: 'Apr', recommendation: 'sell' },
// ];

const AnalystRecom = () => {
	const [data, setData] = useState([
		{ analyst: 'Analyst A', month: 'Jan', recommendation: 'strong buy', count: 3 },
		{ analyst: 'Analyst B', month: 'Jan', recommendation: 'buy', count: 2 },
		{ analyst: 'Analyst C', month: 'Jan', recommendation: 'hold', count: 1 },
		{ analyst: 'Analyst D', month: 'Jan', recommendation: 'underperform', count: 1 },
		{ analyst: 'Analyst E', month: 'Jan', recommendation: 'sell', count: 1 },
		{ analyst: 'Analyst A', month: 'Feb', recommendation: 'strong buy', count: 2 },
		{ analyst: 'Analyst B', month: 'Feb', recommendation: 'buy', count: 1 },
		{ analyst: 'Analyst C', month: 'Feb', recommendation: 'hold', count: 2 },
		{ analyst: 'Analyst D', month: 'Feb', recommendation: 'underperform', count: 1 },
		{ analyst: 'Analyst E', month: 'Feb', recommendation: 'sell', count: 1 },
		{ analyst: 'Analyst A', month: 'Mar', recommendation: 'strong buy', count: 1 },
		{ analyst: 'Analyst B', month: 'Mar', recommendation: 'buy', count: 1 },
		{ analyst: 'Analyst C', month: 'Mar', recommendation: 'hold', count: 2 },
		{ analyst: 'Analyst D', month: 'Mar', recommendation: 'underperform', count: 1 },
		{ analyst: 'Analyst E', month: 'Mar', recommendation: 'sell', count: 1 },
		{ analyst: 'Analyst A', month: 'Apr', recommendation: 'strong buy', count: 1 },
		{ analyst: 'Analyst B', month: 'Apr', recommendation: 'buy', count: 1 },
		{ analyst: 'Analyst C', month: 'Apr', recommendation: 'hold', count: 2 },
		{ analyst: 'Analyst D', month: 'Apr', recommendation: 'underperform', count: 1 },
		{ analyst: 'Analyst E', month: 'Apr', recommendation: 'sell', count: 1 },
	]);

	// Set up dimensions
	const margin = useMemo(() => ({ top: 20, right: 30, bottom: 30, left: 40 }), []);
	const width = 250 - margin.left - margin.right;
	const height = 200 - margin.top - margin.bottom;
	const svgRef = useRef();

	useEffect(() => {
		// Clear previous content
		d3.select(svgRef.current).selectAll('*').remove();

		// Create SVG container
		const svg = d3
			.select(svgRef.current)
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		// Group data by month
		const nested = d3.groups(data, (d) => d.month);

		// Get unique recommendations
		const recommendations = [...new Set(data.map((d) => d.recommendation))];

		// Create scales
		const x = d3
			.scaleBand()
			.domain(nested.map((d) => d[0]))
			.range([0, width])
			.padding(0.1);

		const y = d3
			.scaleLinear()
			.domain([0, d3.max(nested, (d) => d3.sum(d[1], (v) => v.count))])
			.nice()
			.range([height, 0]);

		//const color = d3.scaleOrdinal().domain(recommendations).range(d3.schemeCategory10);

		const colorMap = {
			'strong buy': '#027B66',
			buy: '#81A949',
			hold: '#FFD648',
			underperform: '#EA7035',
			sell: '#D60A22',
		};

		// Create a stack layout
		const stack = d3
			.stack()
			.keys(recommendations)
			.value((d, key) => {
				const item = d[1].find((v) => v.recommendation === key);
				return item ? item.count : 0;
			});

		const series = stack(nested);

		// Create bars
		svg
			.selectAll('g')
			.data(series)
			.enter()
			.append('g')
			.attr('fill', (d) => colorMap[d.key.toLowerCase()])
			.selectAll('rect')
			.data((d) => d)
			.enter()
			.append('rect')
			.attr('x', (d) => x(d.data[0]))
			.attr('y', (d) => y(d[1]))
			.attr('height', (d) => y(d[0]) - y(d[1]))
			.attr('width', x.bandwidth());

		nested.forEach(([month, values]) => {
			const totalCount = d3.sum(values, (v) => v.count);
			svg
				.append('text')
				.attr('x', x(month) + x.bandwidth() / 2)
				.attr('y', y(totalCount) - 6) // Position above the bar
				.attr('text-anchor', 'middle')
				.text(totalCount)
				.attr('fill', '#fff'); // Text color
		});
		// Create x-axis
		const xAxis = svg
			.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom(x));

		xAxis.selectAll('text').attr('fill', '#fff').style('font-size', '0.9rem');

		xAxis.select('path').style('stroke', '#fff'); // Change the x-axis line color

		xAxis.selectAll('.tick line').style('stroke', '#fff'); // Change the tick line color

		// Create y-axis
		//svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));
	}, [data, width, height, margin]);

	return (
		<div className="w-[380px] rounded-b-lg cursor-grab">
			<h2 className="text-sm rounded-t-lg font-medium py-2 px-3 text-[#D2DDE5] bg-[#343434]">
				Analyst Recommendation
			</h2>
			<div className="bg-[#232729] py-2 flex items-center rounded-b-lg">
				<svg ref={svgRef} />
				<ul className="flex flex-col gap-2 text-sm text-white">
					<li className="">
						<span className="rounded-full h-3 w-3 bg-[#027B66] inline-block mr-2"></span>
						<span>Strong Buy</span>
					</li>
					<li>
						<span className="rounded-full h-3 w-3 bg-[#81A949] inline-block mr-2"></span>
						<span>Buy</span>
					</li>
					<li>
						<span className="rounded-full h-3 w-3 bg-[#FFD648] inline-block mr-2"></span>
						<span>Hold</span>
					</li>
					<li>
						<span className="rounded-full h-3 w-3 bg-[#EA7035] inline-block mr-2"></span>
						<span>Underperform</span>
					</li>
					<li>
						<span className="rounded-full h-3 w-3 bg-[#D60A22] inline-block mr-2"></span>
						<span>Sell</span>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default AnalystRecom;
