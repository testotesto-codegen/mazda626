import { useState } from 'react';
import { useStripe, useElements, CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [paymentSuccess, setPaymentSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [zipCode, setZipCode] = useState('');

	//const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const plan = searchParams.get('plan');
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const { error, paymentMethod } = await stripe.createPaymentMethod({
				type: 'card',
				card: elements.getElement(CardNumberElement),
			});

			if (error) {
				setLoading(false);
				setError(error.message);
				return;
			}

			const response = await fetch(`${import.meta.env.VITE_API}/api/v1/createsubscription`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					planId: plan,
					paymentMethodId: paymentMethod.id,
				}),
			});

			if (!response.ok) {
				// setLoading(false);
				// setPaymentSuccess(true);
				// setTimeout(() => {
				// 	navigate('/dashboard');
				// }, 2000);

				setLoading(false);

				setError(response.statusText);
				return;
			}
			const data = await response.json();
			const confirmation = await stripe.confirmCardPayment(data.clientSecret);
			if (confirmation.error) {
				setLoading(false);
				setError(confirmation.error.message);

				return;
			} else {
				setLoading(false);

				setPaymentSuccess(true);
				setTimeout(() => {
					navigate('/dashboard');
				}, 2000);
			}
		} catch (error) {
			setLoading(false);
			setError(error.message);
		}
	};

	return (
		<div className="w-[670px] gradient-border p-6 ">
			<form onSubmit={handleSubmit}>
				<div className="space-y-3 py-4 border-b border-[#2D3133] mb-8">
					<h2 className="text-[#D2DDE5] text-2xl">Payment Method</h2>
					<p className="text-[#7D7D7D]">Add your details to pay the required amount.</p>
					{error && <div className="text-red-500 mb-4">{error}</div>}
				</div>

				<div className="flex flex-wrap justify-center gap-5">
					<div className="w-[300px] space-y-2">
						<label htmlFor="firstName" className="text-[#667177]">
							First Name
						</label>
						<input
							type="text"
							id="firstName"
							className="w-full text-xs text-[#D2DDE5] bg-inherit rounded-2xl outline-none border border-[#2D3133] py-3 px-6"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
					</div>
					<div className="w-[300px] space-y-2">
						<label htmlFor="lastName" className="text-[#667177]">
							Last Name
						</label>
						<input
							type="text"
							id="lastName"
							className="w-full text-xs bg-inherit text-[#D2DDE5] rounded-2xl outline-none border border-[#2D3133] py-3 px-6"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</div>
					<div className="w-[300px] space-y-2 text-[#D2DDE5] ">
						<label htmlFor="lastName" className="text-[#667177]">
							Card Number
						</label>
						<CardNumberElement
							disabled={loading}
							options={{
								style: {
									base: {
										color: '#D2DDE5',
										fontSize: '14px',
										fontFamily: 'Poppins, sans-serif',
										'::placeholder': {
											color: '#667177',
										},
									},
									invalid: {
										color: '#FF0000',
									},
								},
							}}
							id="card-nr"
							className="w-full bg-inherit text-inherit rounded-2xl border border-[#2D3133] text-xs py-3 px-6"
						/>
					</div>
					<div className="w-[300px] space-y-2">
						<label htmlFor="card-expiry" className="text-[#667177]">
							Expiry Date
						</label>
						<CardExpiryElement
							options={{
								style: {
									base: {
										color: '#D2DDE5',
										fontSize: '14px',
										fontFamily: 'Poppins, sans-serif',
										'::placeholder': {
											color: '#667177',
										},
									},
									invalid: {
										color: '#9e2146',
									},
								},
							}}
							disabled={loading}
							id="card-expiry"
							className="w-full bg-inherit rounded-2xl text-xs text-[#D2DDE5] border border-[#2D3133] py-3 px-6"
						/>
					</div>
					<div className="w-[300px] space-y-2">
						<label htmlFor="card-cvc" className="text-[#667177]">
							CVC
						</label>
						<CardCvcElement
							disabled={loading}
							options={{
								style: {
									base: {
										color: '#D2DDE5',
										fontSize: '14px',
										fontFamily: 'Poppins, sans-serif',
										'::placeholder': {
											color: '#667177',
										},
									},
									invalid: {
										color: '#9e2146',
									},
								},
							}}
							id="card-cvc"
							className="w-full bg-inherit rounded-2xl text-xs text-[#D2DDE5] border border-[#2D3133] py-3 px-6"
						/>
					</div>
					<div className="w-[300px] space-y-2">
						<label htmlFor="zipCode" className="text-[#667177]">
							Zip Code
						</label>
						<input
							type="text"
							id="zipCode"
							className="w-full bg-inherit rounded-2xl text-xs text-[#D2DDE5] outline-none border border-[#2D3133] py-3 px-6"
							value={zipCode}
							onChange={(e) => setZipCode(e.target.value)}
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={!stripe || loading}
					className={` gradient-bg mt-6 w-full font-semibold rounded-full font-poppins text-sm  text-white py-3 px-6  ${
						loading ? 'opacity-50 cursor-not-allowed' : ''
					}`}
				>
					{loading ? 'Processing...' : 'Complete Order'}
				</button>
			</form>
			{paymentSuccess && (
				<div className="h-screen w-full italic text-white flex justify-center text-2xl items-center bg-[#121416] fixed inset-0">
					Your payment was successful. Redirecting to dashboard ....
				</div>
			)}
		</div>
	);
};

export default PaymentForm;

/*

	<form onSubmit={handleSubmit}>
				<CardElement options={CARD_ELEMENT_OPTIONS} />
				{error && <div className="error">{error}</div>}
				<button type="submit" disabled={!stripe || loading}>
					{loading ? 'Processing...' : 'Subscribe'}
				</button>
			</form>

*/
