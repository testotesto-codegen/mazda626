/* eslint-disable react/prop-types */
import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const GridLayoutWrapper = ({ data }) => {
	return (
		<div className="min-h-full">
			<GridLayout
				className="layout"
				cols={18}
				isResizable={false}
				allowOverlap={false}
				rowHeight={100}
				width={1200}
				layout={data?.map((widget) => ({
					x: widget.dimension.x,
					y: widget.dimension.y,
					w: widget.dimension.w,
					h: widget.dimension.h,
					i: widget.id,
				}))}
				measureBeforeMount
			>
				{data?.map((widget) => (
					<div
						key={widget.id}
						data-grid={{
							x: widget.dimension.x,
							y: widget.dimension.y,
							w: widget.dimension.w,
							h: widget.dimension.h,
						}}
					>
						{React.createElement(widget.component, widget.props)}
					</div>
				))}
			</GridLayout>
		</div>
	);
};

export default GridLayoutWrapper;
