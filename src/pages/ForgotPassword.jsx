import AuthTemplate from '../components/common/AuthTemplate';
import FormTemplate from '../components/common/FormTemplate';
import { useForgotPasswordMutation } from '../api/endpoints/authApi';
import { useState } from 'react';

const inputs = [
	{
		id: 1,
		type: 'text',
		placeholder: 'Email',
		value: 'email',
		label: 'Enter your email with which you registered',
	},
];

const ForgotPassword = () => {
	const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation();
	const [errorMessage, setErrorMessage] = useState('');

	const submitHandler = async (data) => {
		// eslint-disable-next-line no-unused-vars
		try {
			setErrorMessage('');

			// eslint-disable-next-line no-unused-vars

			const response = await forgotPassword(data).unwrap();
			console.log('response', response);
		} catch (error) {
			setErrorMessage(error.data.message);
		}
	};

	return (
		<div className="flex">
			<AuthTemplate title="Forgot your Password" />
			<FormTemplate
				formType="ForgotPassword"
				inputs={inputs}
				submitHandler={submitHandler}
				isLoading={isLoading}
				errorMessage={errorMessage}
				successMessage={isSuccess}
			/>
		</div>
	);
};

export default ForgotPassword;
