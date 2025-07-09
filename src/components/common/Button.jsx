import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const Button = ({ title, customClassName, path }) => {
	return (
		<Link to={path}>
			<button className={` ${customClassName} font-normal text-sm md:text-base py-2 px-8 md:py-3 md:px-14  rounded-lg z-40`}>
				{title}
			</button>
		</Link>
	);
};

export default Button;
