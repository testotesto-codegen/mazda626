/* eslint-disable react/prop-types */
import Overview from './Overview';
import CompanyModel from './CompanyModel';
import Earnings from './Earnings/Earnings';

const components = [
	{
		id: 1,
		title: 'Overview',
		component: Overview,
	},
	{
		id: 2,
		title: 'Company Model',
		component: CompanyModel,
	},
	{
		id: 3,
		title: 'Earnings',
		component: Earnings,
	},
	{
		id: 4,
		title: 'Enterprise Value',
	},
	{
		id: 5,
		title: 'EV Ex Operating Leases',
	},
	{
		id: 6,
		title: 'Multiples',
	},
	{
		id: 7,
		title: 'Per Share',
	},
	{
		id: 8,
		title: 'Stock Value',
	},
	{
		id: 9,
		title: 'Options',
	},
];

const KeyStats = ({ hash }) => {
	const selectedComponent = components.find((item) => item.title === hash);

	return (
		<>
			{selectedComponent && <selectedComponent.component />}
			{!selectedComponent && <Overview />}
		</>
	);
};

export default KeyStats;
