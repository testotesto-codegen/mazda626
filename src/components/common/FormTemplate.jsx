import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import handWave from '../../assets/icons/hand-wave.svg';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { FaCheckCircle } from 'react-icons/fa';

/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types

const FormTemplate = ({ formType, inputs, submitHandler, isLoading, errorMessage, successMessage }) => {
	// initialing yup schema and registration object for react-hook-form
	// Same component renders for both login, register & forgot password form with different schema and inputs
	// so we need to initialize schema and registration object based on formType
	// formType and inputs are passed as props from parent component
	// submitHandler is also passed as props from parent component and handles related logic

	let schema;
	let registration = {};

	if (formType == 'Register') {
		schema = yup.object().shape({
			fullName: yup.string().required(),
			email: yup.string().email().required(),
			username: yup.string().required(),
			password: yup.string().min(6).required(),
			retypePassword: yup
				.string()
				.oneOf([yup.ref('password'), null], 'Passwords must match')
				.min(6)
				.required(),
		});
	} else if (formType == 'Login') {
		schema = yup.object().shape({
			username: yup.string().required(),
			password: yup.string().min(6).required(),
		});
	} else if (formType == 'ForgotPassword') {
		schema = yup.object().shape({
			email: yup.string().required(),
		});
	} else {
		schema = yup.object().shape({
			password: yup.string().min(6).required(),
			retypePassword: yup
				.string()
				.oneOf([yup.ref('password'), null], 'Passwords must match')
				.min(6)
				.required(),
		});
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	inputs.forEach((el) => {
		registration[el.value] = register(el.value);
	});

	return (
		<div className="min-h-screen w-full flex justify-center items-center bg-[#1D2022] font-poppins p-4 ">
			<div className="w-[450px]  px-8 py-8  bg-[#121416] gradient-border">
				<h1 className="text-[#D2DDE5] font-semibold lg:text-2xl 2xl:text-3xl mb-8 flex gap-2">
					{formType == 'Login' ? (
						'Welcome Back'
					) : formType == 'Register' ? (
						<>
							Register your Account
							<img src={handWave} alt="Hande Wave Icon" className="w-7" />
						</>
					) : formType == 'ForgotPassword' ? (
						'Forgot your Password?'
					) : (
						'Enter New Password'
					)}
				</h1>
				{formType === 'Register' ? <p className="text-[#7D7D7D] mb-6 ">Use your .edu email if you are a student </p> : null}

				{formType == 'ForgotPassword' && (
					<p className="text-[#7D7D7D] mb-6 ">Enter your email with which you registered. We will send you a link to reset your password</p>
				)}

				<form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
					{inputs.map((el) => (
						<div key={el.id} className="flex flex-col gap-2">
							{formType !== 'ForgotPassword' && (
								<label htmlFor={el.value} className="text-[#667177] font-normal text-sm flex justify-between">
									{el.label}
									{el.id === 1 && <span className="ml-auto text-red-600 text-xs font-normal">{errorMessage}</span>}
								</label>
							)}
							<input
								key={el.id}
								type={el.type}
								{...registration[el.value]}
								className={`p-3 text-[#D2DDE5] font-poppins border bg-inherit border-[#667177] placeholder-text-[#D2DDE5] text-xs rounded-2xl ${
									errors[el.value] ? 'border-red-500 border-2' : ''
								}`}
								placeholder={el.placeholder}
							/>
						</div>
					))}

					{formType === 'Login' && (
						<div className="flex justify-between text-sm">
							<div className="flex gap-2 items-center">
								<input type="checkbox" id="remember" name="remember" value="remember" className="" />{' '}
								<span className="text-[#667177]  ">Remember me</span>
							</div>

							<Link to="/forgot-password" className="text-[#37CAA8] font-normal ">
								Forgot Password?
							</Link>
						</div>
					)}
					<button
						type="submit"
						className={`${isLoading ? 'bg-[#a2f2df]' : 'bg-[#37CAA8]'} font-poppins text-darkGrey py-3 text-md cursor-pointer rounded-md hover:bg-[#2CA88A]`}
					>
						{isLoading ? (
							<LoadingSpinner />
						) : formType === 'Login' ? (
							'Login'
						) : formType === 'Register' ? (
							'Register'
						) : formType === 'ForgotPassword' ? (
							'Reset my Password'
						) : (
							'Confirm New Password'
						)}
					</button>
				</form>
				{formType === 'Login' && (
					<p className="text-center text-sm mt-3  font-normal text-[#667177] flex gap-2 justify-center">
						New on our platform?{' '}
						<Link to="/register" className="text-white font-normal">
							Create an account
						</Link>
					</p>
				)}
				{formType === 'Register' && (
					<p className="text-center text-sm mt-3 font-normal text-[#667177] flex gap-2 justify-center ">
						Have an Account?{' '}
						<Link to="/login" className="text-white font-normal">
							Sign In Here
						</Link>
					</p>
				)}
				{formType === 'ForgotPassword' && successMessage && (
					<p className=" text-center mt-3 font-normal text-[#667177] flex gap-2 justify-center items-center">
						<span className="text-green-600">
							<FaCheckCircle size={20} />
						</span>{' '}
						Password reset link sent to your email
					</p>
				)}
				{formType === 'ResetPassword' && successMessage && (
					<p className=" text-center mt-3 font-normal text-[#667177] flex gap-2 justify-center items-center">
						<span className="text-green-600">
							<FaCheckCircle size={20} />
						</span>{' '}
						Password reset successfully!
					</p>
				)}

				{formType === 'Register' && successMessage && (
					<p
						className=" text-center mt-3 font-norma
					l text-[#667177] flex gap-2 justify-center items-center"
					>
						<span className="text-green-600">
							<FaCheckCircle size={20} />
						</span>{' '}
						User registered successfully!
					</p>
				)}
				{formType === 'Login' && successMessage && (
					<p
						className=" text-center mt-3 font-norma
					l text-[#667177] flex gap-2 justify-center items-center"
					>
						<span className="text-green-600">
							<FaCheckCircle size={20} />
						</span>{' '}
						Logged In successfully!
					</p>
				)}
			</div>
		</div>
	);
};

export default FormTemplate;
