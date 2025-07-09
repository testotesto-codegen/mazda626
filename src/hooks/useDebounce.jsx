import { useState, useEffect } from 'react';

const useDebounce = (value, delay = 3000) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const searchValue = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(searchValue);
		};
	}, [value, delay]);

	return debouncedValue;
};

export default useDebounce;
