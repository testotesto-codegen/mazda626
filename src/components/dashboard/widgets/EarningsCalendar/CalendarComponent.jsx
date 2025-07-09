/* eslint-disable react/prop-types */
import { useState, useEffect, forwardRef, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { getWeekRangeFromDate } from '../../../../utils/DateFormatter';
import enUS from 'date-fns/locale/en-US';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarComponent = ({ setWeeklyData, dateRange, setDateRange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	useEffect(() => {
		registerLocale('en-US', enUS);
	}, []);

	const options = {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	};

	useEffect(() => {
		const currentDate = new Date();
		const { startRange, endRange, weekData } = getWeekRangeFromDate(currentDate);
		const range = `${new Date(startRange).toLocaleDateString('en-US', options)} - ${new Date(endRange).toLocaleDateString(
			'en-US',
			options
		)}`;
		setDateRange(range);
		setWeeklyData(weekData);
	}, []);

	const handleClick = (e) => {
		e.preventDefault();
		setIsOpen(!isOpen);
	};

	const handleChange = (date) => {
		console.log(date);
		const { startRange, endRange, weekData } = getWeekRangeFromDate(date);
		const range = `${new Date(startRange).toLocaleDateString('en-US', options)} - ${new Date(endRange).toLocaleDateString(
			'en-US',
			options
		)}`;
		setSelectedDate(date);
		setDateRange(range);
		setStartDate(startRange);
		setEndDate(endRange);
		setWeeklyData(weekData);
		setIsOpen(!isOpen);
	};

	const CustomInput = forwardRef(({ dateRange, onClick }, ref) => (
		<button onClick={onClick} ref={ref}>
			{dateRange}
		</button>
	));

	CustomInput.displayName = 'ExampleCustomInput';

	return (
		<div>
			<DatePicker
				selected={selectedDate}
				onChange={handleChange}
				dateFormat="I/R"
				showWeekPicker
				locale="en-US"
				customInput={<CustomInput dateRange={dateRange} />}
			/>
		</div>
	);
};

export default CalendarComponent;

/*

<button onClick={() => dateRef.current.click()} className="">
				{dateRange}
			</button>

*/
