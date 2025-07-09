import GridLayoutWrapper from '../../GridLayoutWrapper';
import AnalystRecom from './AnalystRecom';
import UpgradesDowngrades from './UpgradesDowngrades';

const widgets = [
	{
		id: 1,
		component: AnalystRecom,
		dimension: { x: 0, y: 0, w: 6.0, h: 2.4 },
	},
	{
		id: 2,
		component: UpgradesDowngrades,
		dimension: { x: 10, y: 3, w: 6.0, h: 2.1 },
	},
];

const Earnings = () => {
	return <GridLayoutWrapper data={widgets} />;
};

export default Earnings;
