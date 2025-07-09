/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function getColor(percentChange) {
	if (percentChange > 5) return '#059682';
	if (percentChange > 1) return '#7FF7E3';
	if (percentChange > 0) return '#FFFFFF';
	if (percentChange < -5) return '#E66060';
	if (percentChange < -1) return '#F4B8B8';
	return '#FFFFFF';
}

const Heatmap = ({ data, width, height }) => {
	const svgRef = useRef(null);

	function renderTreemap() {
		const svg = d3.select(svgRef.current);
		svg.attr('width', width).attr('height', height);

		const tooltip = d3
			.select('body')
			.append('div')
			.attr('class', 'tooltip')
			.style('position', 'absolute')
			.style('text-align', 'center')
			.style('padding', '8px')
			.style('color', '#D2DDE5')
			.style('font-size', '12px')
			.style('background', '#3D4042')
			.style('border', '1px solid gray')
			.style('border-radius', '4px')
			.style('opacity', 0);

		if (!data || !data.children) {
			console.error("Invalid data structure. Expected 'children' property.");
			return;
		}

		const root = d3
			.hierarchy(data)
			.sum((d) => d.value)
			.sort((a, b) => b.value - a.value);

		const treemapRoot = d3.treemap().size([width, height]).padding(5)(root);

		const gap = 3;

		const nodes = svg
			.selectAll('g')
			.data(treemapRoot.leaves())
			.join('g')
			.attr('transform', (d) => `translate(${d.x0},${d.y0})`);

		const fontSize = 12;
		const minNodeSize = 45;

		function wrapText(selection) {
			selection.each(function () {
				const node = d3.select(this);
				const rectWidth = +node.attr('data-width');
				let word;
				const words = node.text().split(' ').reverse();
				let line = [];
				const x = node.attr('x');
				const y = node.attr('y');
				let tspan = node.text('').append('tspan').attr('x', x).attr('y', y);
				let lineNumber = 0;

				while (words.length > 1) {
					word = words.pop();
					line.push(word);
					tspan.text(line.join(' '));
					const tspanLength = tspan.node().getComputedTextLength();
					if (tspanLength > rectWidth && line.length !== 1) {
						line.pop();
						tspan.text(line.join(' '));
						line = [word];
						tspan = addTspan(word);
					}
				}

				addTspan(words.pop());

				function addTspan(text) {
					lineNumber += 1;
					return node
						.append('tspan')
						.attr('x', x)
						.attr('y', y)
						.attr('dy', `${lineNumber * fontSize}px`)
						.text(text);
				}

				const originalText = node.text();
				let truncatedText = originalText;
				let tspanLength = node.node().getComputedTextLength();

				while (tspanLength > rectWidth && truncatedText.length > 1) {
					truncatedText = truncatedText.slice(0, -1);
					node.text(truncatedText + '...');
					tspanLength = node.node().getComputedTextLength();
				}

				if (tspanLength > rectWidth) {
					node.text(truncatedText.slice(0, 1) + '...');
				} else {
					node.text(truncatedText);
				}
			});
		}

		nodes
			.append('rect')
			.attr('width', (d) => d.x1 - d.x0)
			.attr('height', (d) => d.y1 - d.y0)
			.attr('fill', (d) => getColor(d.data.change));

		const nameText = nodes
			.append('text')
			.text((d) => `${d.data.symbol}`)
			.attr('data-width', (d) => d.x1 - d.x0)
			.attr('font-size', `${fontSize}px`)
			.attr('x', (d) => (d.x1 - d.x0) / 2)
			.attr('y', (d) => (d.y1 - d.y0) / 2)
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'middle')
			.call(wrapText);

		const changeText = nodes
			.append('text')
			.text((d) => `${d.data.change}%`)
			.attr('font-size', `${fontSize}px`)
			.attr('x', (d) => (d.x1 - d.x0) / 2)
			.attr('y', (d) => (d.y1 - d.y0) / 2 + fontSize)
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'middle');

		nameText.filter((d) => d.x1 - d.x0 < minNodeSize || d.y1 - d.y0 < minNodeSize).attr('display', 'none');

		changeText.filter((d) => d.x1 - d.x0 < minNodeSize || d.y1 - d.y0 < minNodeSize).attr('display', 'none');

		nodes
			.on('mouseover', function (event, d) {
				tooltip.transition().duration(200).style('opacity', 0.9);
				tooltip
					.html(`Name: ${d.data.name}<br>Market Cap: ${d.data.value}<br>Change: ${d.data.change}%`)
					.style('left', event.pageX + 5 + 'px')
					.style('top', event.pageY - 28 + 'px');
			})
			.on('mouseout', function () {
				tooltip.transition().duration(500).style('opacity', 0);
			});
	}

	useEffect(() => {
		renderTreemap();
	}, [data]);

	return (
		<div>
			<svg ref={svgRef} />
		</div>
	);
};

export default Heatmap;
