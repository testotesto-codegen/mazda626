import AuthTemplate from '../components/common/AuthTemplate';
import FormTemplate from '../components/common/FormTemplate';
import { useResetPasswordMutation } from '../api/endpoints/authApi';
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const inputs = [
	{
		id: 1,
		type: 'password',
		placeholder: 'Enter new password',
		value: 'password',
		label: 'New password',
	},
	{
		id: 2,
		type: 'password',
		placeholder: 'Re-enter new password',
		value: 'retypePassword',
		label: 'Confirm New password',
	},
];

const ResetPassword = () => {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
	const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();

	const submitHandler = async (data) => {
		// eslint-disable-next-line no-unused-vars
		try {
			setErrorMessage('');

			// eslint-disable-next-line no-unused-vars
			const { password } = data;

			await resetPassword({ password, token }).unwrap();

			setTimeout(() => {
				navigate('/login');
			}, 3000);
		} catch (error) {
			setErrorMessage(error.data.message);
		}
	};

	return (
		<div className="flex">
			<AuthTemplate title="Enter New Password" />
			<FormTemplate
				formType="ResetPassword"
				inputs={inputs}
				submitHandler={submitHandler}
				isLoading={isLoading}
				errorMessage={errorMessage}
				successMessage={isSuccess}
			/>
		</div>
	);
};

export default ResetPassword;
