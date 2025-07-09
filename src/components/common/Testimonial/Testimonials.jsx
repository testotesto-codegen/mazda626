import { useEffect, useState } from 'react';
import leslieImg from '../../../assets/images/leslie.png';
import estherImg from '../../../assets/images/esther.png';
import janeImg from '../../../assets/images/jane.png';
import './Testimonial.css';

const testimonials = [
	{
		id: 1,
		designation: 'Ivy Student',
		name: 'Leslie Alexander',
		description:
			'I love how easy it is to use this website. Even as someone who is not particularly tech-savvy. I was able to navigate it with ease.',
		img: leslieImg,
	},
	{
		id: 2,
		designation: 'Family Office',
		name: 'Esther Howard',
		description:
			'This is going to save the rest of the team a ton of time.',
		img: estherImg,
	},
	{
		id: 3,
		designation: 'Hedge Fund Analyst',
		name: 'Leslie Alexander',
		description:
			'This is a game changer for those mundane data collection workflows.',
		img: leslieImg,
	}
];
/*
const Testimonials = () => {
	return (
		<section className="flex flex-col md:flex-row md:flex-wrap justify-center gap-4 lg:gap-16 py-3 px-4 md:px-0  relative h-full lg:h-[600px]">
			{testimonials.map((item) => (
				<div
					key={item.id}
					className={`${
						item.id === 1
							? 'lg:-left-40 lg:-rotate-12 lg:top-28'
							: item.id === 2
							? 'lg:left-1/4 lg:-translate-x-1/2 lg:-rotate-6 lg:top-10'
							: item.id === 3
							? 'lg:left-1/2 lg:-translate-x-1/2'
							: item.id === 4
							? 'lg:right-1/4 lg:translate-x-1/2 lg:rotate-6 lg:top-10'
							: item.id === 5
							? 'lg:-right-40 lg:rotate-12 lg:top-28'
							: ''
					} lg:absolute max-w-[280px] mx-auto md:mx-0 lg:w-64 xl:w-72 2xl:w-80 bg-[#1D2022] gradient-button-border px-4 py-5 rounded-3xl flex flex-col gap-4`}
				>
					<h2 className="text-[#B4B4B4] text-sm font-normal">{item.designation}</h2>
					<p className="text-[#D9D9D9] text-base">{item.description}</p>
					<div className="flex items-center gap-2 mt-20">
						<img loading="lazy" src={item.img} alt="" className="w-16" />
						<h2 className="text-[#CFCFCF] text-sm font-normal">
							{item.name} <br /> <span className="text-[#9C9C9C] text-xs">Age: 32</span>{' '}
						</h2>
					</div>
				</div>
			))}
		</section>
	);
};

export default Testimonials;
*/

const Testimonials = () => {
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const handleAnimationEnd = () => {
			setCurrentSlide((prevSlide) => (prevSlide === testimonials.length - 1 ? 0 : prevSlide + 1));
		};

		document.querySelectorAll('.testimonial-item').forEach((item) => {
			item.addEventListener('animationend', handleAnimationEnd);
		});

		return () => {
			document.querySelectorAll('.testimonial-item').forEach((item) => {
				item.removeEventListener('animationend', handleAnimationEnd);
			});
		};
	}, []);

	return (
		<section className="testimonials-carousel">
			{testimonials.map((item, index) => (
				<div
					key={item.id}
					className={`testimonial-item ${index === currentSlide ? 'active' : ''}
					transition-all duration-500 ease-in-out
					max-w-[280px]  lg:w-64 xl:w-72 2xl:w-80 bg-[#1D2022] gradient-button-border px-4 py-5 rounded-3xl flex flex-col gap-4
					`}
					style={{ animationDelay: `${index * 5}s` }}
				>
					<h2 className="text-[#B4B4B4] text-sm font-normal">{item.designation}</h2>
					<p className="text-[#D9D9D9] text-base">{item.description}</p>
					<div className="flex items-center gap-2 mt-20">
						<img loading="lazy" src={item.img} alt="" className="w-16" />
						<h2 className="text-[#CFCFCF] text-sm font-normal">
							{item.name} <br /> <span className="text-[#9C9C9C] text-xs">Age: 32</span>{' '}
						</h2>
					</div>
				</div>
			))}
		</section>
	);
};

export default Testimonials;
