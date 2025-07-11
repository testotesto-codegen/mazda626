import EnhancedButton from './Button/Button';
import { BUTTON_TYPES } from './Button/Button.types';

/**
 * Legacy Button component - maintained for backward compatibility
 * @deprecated Use the enhanced Button component from './Button/Button' instead
 */
// eslint-disable-next-line react/prop-types
const Button = ({ title, customClassName, path }) => {
	return (
		<EnhancedButton
			type={BUTTON_TYPES.LINK}
			to={path}
			className={`${customClassName} font-normal text-sm md:text-base py-2 px-8 md:py-3 md:px-14 rounded-lg z-40`}
		>
			{title}
		</EnhancedButton>
	);
};

export default Button;
