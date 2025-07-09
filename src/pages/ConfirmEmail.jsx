const ConfirmEmail = () => {
	return (
		<div className="w-full min-h-screen auth-wrapper flex flex-col justify-center items-center gap-8 ">
			<p className="gradient-text text-3xl md:text-6xl">Please Confirm Your Email. </p>
			<p className="text-[#7D7D7D] text-md">
				Didn&apos;t receive it, please <span className="gradient-text">try again!</span>
			</p>
		</div>
	);
};

export default ConfirmEmail;
