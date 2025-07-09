import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import twitterLogo from '../assets/logos/twitter-logo.png';

const formInputs = [
	{
		id: 1,
		label: 'First Name',
		placeholder: 'Enter your first name',
		type: 'text',
	},
	{
		id: 2,
		label: 'Last Name',
		placeholder: 'Enter your last name',
		type: 'text',
	},
	{
		id: 3,
		label: 'Email',
		placeholder: 'Enter your email',
		type: 'email',
	},
	{
		id: 4,
		label: 'Company',
		placeholder: 'Enter your company name',
		type: 'text',
	},
	{
		id: 5,
		label: 'Position',
		placeholder: 'Enter your position',
		type: 'text',
	},
	{
		id: 6,
		label: 'Subject',
		placeholder: 'Enter your subject',
		type: 'text',
	},
];

const ContactUs = () => {
	let location = useLocation();
	const isEnterprise = location.pathname.includes('enterprise');

	return (
		<div className="w-full min-h-screen py-6 px-4 md:px-20">
			<Link to="/" className="gradient-text text-2xl md:text-5xl font-medium">
				Accelno
			</Link>
			<section className="h-full w-full py-20 md:py-32 2xl:w-[1350px] mx-auto">
				<h2 className="text-[#D2DDE5] text-base md:text-xl">{isEnterprise ? 'Enterprise Contact Form' : 'Contact Us'} </h2>
				<form action="" className="flex flex-col w-full gap-6 py-10">
					<div className="flex justify-center flex-wrap gap-5 w-full mx-auto">
						{formInputs.map((input) => (
							<div key={input.id} className="flex flex-col gap-3 w-full xl:w-2/5">
								<label htmlFor={input.label} className="text-[#667177]">
									{input.label}
								</label>
								<input
									type={input.type}
									id={input.label}
									placeholder={input.placeholder}
									className="w-full p-3 md:p-4 text-sm text-[#D2DDE5] rounded-full bg-[#282C2F]"
								/>
							</div>
						))}
					</div>
					<div className="flex flex-col gap-3 w-full xl:w-5/6 mx-auto">
						<label htmlFor="message" className="text-[#667177]">
							Message
						</label>
						<textarea
							name="message"
							id="message"
							placeholder="Write your message"
							rows="10"
							className="text-sm text-[#D2DDE5] rounded-xl bg-[#282C2F] w-full resize-none p-3 md:p-4"
						></textarea>
					</div>
				</form>
				<div className="w-full text-right">
					<button className="rounded-full py-4 px-16 text-[#D2DDE5] text-sm font-normal bg-[#282C2F]">Send</button>
				</div>
			</section>
			<footer className="relative flex flex-col w-full p-8">
				<div className="w-full max-w-[1800px] mx-auto flex justify-end py-8 ">
					<img src={twitterLogo} alt="twitter logo" className="h-5" />
				</div>

				<div className="text-[#888888] text-xs font-medium border-t border-[#424242] py-4 w-full max-w-[1800px] mx-auto flex flex-col gap-4 md:gap-0 md:flex-row  md:justify-between">
					<p className="">Copyright Accelno 2023</p>
					<div className="flex flex-col md:flex-row gap-3">
						<span>Privacy Policy</span>
						<span>Terms of Service</span>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default ContactUs;
