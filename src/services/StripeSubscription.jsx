import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
	'pk_test_51NNHmGJUhZW4GUAoRi3RI4HVZHkIDXrNPmEqDfp3gklS6QAvimqQFR5l6CO9YGwJ3xrZro5vst73HfPBpS8ukezV00eyOH9o8E'
);

const CARD_ELEMENT_OPTIONS = {
	appearance: {
		variables: {
			colorText: '#D2DDE5',
		},
	},
};

const StripeSubscription = () => {
	return (
		<Elements stripe={stripePromise} options={CARD_ELEMENT_OPTIONS}>
			<PaymentForm />
		</Elements>
	);
};

export default StripeSubscription;
