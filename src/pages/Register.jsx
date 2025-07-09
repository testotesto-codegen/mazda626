import FormTemplate from '../components/common/FormTemplate';
import { useRegisterMutation } from '../api/endpoints/authApi';
import { useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/common/AuthTemplate';
import { useState } from 'react';
import client from '../client/Client';

const inputs = [
	{
		id: 1,
		type: 'text',
		placeholder: 'Enter Full Name',
		value: 'fullName',
		label: 'Full Name',
	},
	{
		id: 2,
		type: 'text',
		placeholder: 'Choose a username',
		value: 'username',
		label: 'Username',
	},
	{
		id: 3,
		type: 'email',
		placeholder: 'Email',
		value: 'email',
		label: 'Email',
	},
	{
		id: 4,
		type: 'password',
		placeholder: 'Password',
		value: 'password',
		label: 'Password',
	},
	{
		id: 5,
		type: 'password',
		placeholder: 'Retype Password',
		value: 'retypePassword',
		label: 'Retype Password',
	},
];

const Register = () => {
	const [register, { isLoading, isSuccess }] = useRegisterMutation();
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState('');

	const submitHandler = async (data) => {
		// eslint-disable-next-line no-unused-vars
		try {
			setErrorMessage('');

			// eslint-disable-next-line no-unused-vars
			const { retypePassword, ...rest } = data;

			const response = await client.registerUser(data);
			if (response == 200) {
				setTimeout(() => {
					navigate('/login');
				}, 3000);
			} else {
				setErrorMessage("Issue creating user.")
			}
		} catch (error) {
			setErrorMessage("There was an issue creating the user, username or email may already be in use.");
			console.log(error);
		}
	};
	return (
		<div className="flex min-h-screen">
			<AuthTemplate title="JOIN US" />
			<FormTemplate
				formType="Register"
				inputs={inputs}
				submitHandler={submitHandler}
				successMessage={isSuccess}
				errorMessage={errorMessage}
				isLoading={isLoading}
			/>
		</div>
	);
};

export default Register;
