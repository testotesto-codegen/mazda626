import GridLayoutWrapper from '../GridLayoutWrapper';
import TextBasedWidget from './TextBasedWidget';

const widgets = [
	{
		id: 1,
		component: TextBasedWidget,
		dimension: { x: 0, y: 0, w: 7.0, h: 2.5 },
		props: {
			title: 'Industry Summary',
			className: 'w-[450px]',
			content:
				'Apple Inc. is a leading technology company known for its iconic products like the iPhone, iPad, and Mac. Renowned for and design, Apple has a strong global presence with a focus on a seamless ecosystem. The company financial success stems from hardware sales, services like the App Store, and a growing emphasis on sustainability. Challenges include market competition and regulatory scrutiny. Apple services segment has become a significant revenue driver, and the company continues to dominate the tech industry in terms of market capitalization. Renowned for and design, Apple has a strong global presence with a focus on a seamless ecosystem.',
		},
	},
	{
		id: 2,
		component: TextBasedWidget,
		dimension: { x: 10, y: 3, w: 7.0, h: 2.5 },
		props: {
			title: 'Company Description',
			className: 'w-[450px]',
			content:
				'Apple Inc. is a leading technology company known for its iconic products like the iPhone, iPad, and Mac. Renowned for and design, Apple has a strong global presence with a focus on a seamless ecosystem. The company financial success stems from hardware sales, services like the App Store, and a growing emphasis on sustainability. Challenges include market competition and regulatory scrutiny. Apple services segment has become a significant revenue driver, and the company continues to dominate the tech industry in terms of market capitalization. Renowned for and design, Apple has a strong global presence with a focus on a seamless ecosystem.',
		},
	},
	{
		id: 3,
		component: TextBasedWidget,
		dimension: { x: 10, y: 3, w: 5.7, h: 3.4 },
		props: {
			title: 'Revenue Segmentation',
			className: 'w-[360px]',
			content:
				'01. iPhone: The iPhone segment encompasses sales of Apple flagship smartphone, various models, and related accessories. The iPhone has historically been a major revenue driver for Apple. 02. Mac: The Mac segment includes sales of Apple desktop and laptop computers, as well as related accessories. \n 03. iPad: The iPad segment includes sales of Apple tablet devices, various models, and related accessories.  04. Wearables, Home, and Accessories: The Wearables, Home, and Accessories segment includes sales of Apple Watch, AirPods, HomePod, and related accessories. 05. Services: The Services segment includes sales of digital content, subscriptions, and services like Apple Music, Apple TV+, iCloud, and AppleCare.',
		},
	},
];

const CompanyModel = () => {
	return <GridLayoutWrapper data={widgets} />;
};

export default CompanyModel;
