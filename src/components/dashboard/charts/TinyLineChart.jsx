import { LineChart, Line } from 'recharts';

const transformDataForChart = (data) => {
	if (!data || !data.timestamp || !data.price || data.timestamp.length === 0) {
		return [];
	}

	return data.price.map((val, index) => ({
		name: new Date(data.timestamp[index]).toLocaleDateString(),
		pv: data.price[index],
	}));
};

/*
	return data.chart.result[0].indicators.quote[0]['close'].map((val, index) => ({
		name: new Date(data.chart.result[0].timestamp[index] * 1000).toLocaleDateString('en-US', { month: 'short' }),
		pv: data.chart.result[0].indicators.quote[0]['close'][index],
	}));

*/

// eslint-disable-next-line react/prop-types
const TinyLineChart = ({ data, change, size }) => {
	const chartData = transformDataForChart(data);
	return (
		<LineChart width={size === 'small' ? 80 : size === 'medium' ? 120 : 160} height={30} data={chartData}>
			<Line type="linear" dataKey="pv" stroke={Math.sign(change) === 1 ? '#14C67A' : '#BB231B'} strokeWidth={2} dot={false} />
		</LineChart>
	);
};

export default TinyLineChart;
