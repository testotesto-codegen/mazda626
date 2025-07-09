import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { set } from 'react-hook-form';

const VerifyEmail = () => {
	const [loading, setLoading] = useState(true);
	const [verificationSuccess, setVerificationSuccess] = useState(false);
	const [verificationError, setVerificationError] = useState(false);
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
	const navigate = useNavigate();

	const verifyEmail = async () => {
		setLoading(true);
		setVerificationError(false);
		setVerificationSuccess(false);
		try {
			const response = await fetch(`${import.meta.env.VITE_API}/api/v1/verifyemail`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			});

			if (!response.ok) {
				setLoading(false);
				setVerificationError(true);
			} else {
				setLoading(false);
				setVerificationSuccess(true);
				setTimeout(() => {
					navigate('/login');
				}, 3000);
			}
		} catch {
			setLoading(false);
			setVerificationError(true);
		}
	};

	useEffect(() => {
		verifyEmail();
	}, []);

	return (
		<div className="w-full min-h-screen auth-wrapper flex flex-col justify-center items-center gap-8 ">
			{loading && <p className="gradient-text text-3xl md:text-6xl"> Please Wait .... </p>}
			{verificationSuccess && <p className="gradient-text text-3xl md:text-6xl"> Email Verified Successfully! </p>}
			{verificationError && <p className="text-red-600 text-3xl md:text-6xl"> Email Verification Failed! </p>}
		</div>
	);
};

export default VerifyEmail;
