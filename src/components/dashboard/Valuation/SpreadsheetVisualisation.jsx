import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import excelPreview from '../../../assets/images/excel-preview.svg';
import { FaCircleInfo } from 'react-icons/fa6';

const formInputs = [
	{
		id: 1,
		title: 'Sales Growth Rate',
		key: 'salesGrowthRate',
	},
	{
		id: 2,
		title: 'Tax (% of EBIT)',
		key: 'tax',
	},
	{
		id: 3,
		title: 'COGS (% of Sales)',
		key: 'cogs',
	},
	{
		id: 4,
		title: 'D&A (% of Capex)',
		key: 'da',
	},
	{
		id: 5,
		title: 'SG&A Growth Rate',
		key: 'sgaGrowthRate',
	},
	{
		id: 6,
		title: 'Capex (% of Sales)',
		key: 'capex',
	},
	{
		id: 7,
		title: 'NWC (% of Sales)',
		key: 'nwc',
	},
	{
		id: 8,
		title: 'TGR',
		key: 'tgr',
	},
];

const SpreadsheetVisualisation = () => {
	const [formData, setFormData] = useState({});
	const [searchParams] = useSearchParams();

	const ticker = searchParams.get('ticker');
	console.log(ticker);

	useEffect(() => {
		const initialFormData = {};
		formInputs.forEach((input) => {
			initialFormData[input.key] = { duration: 'custom' };
		});
		setFormData(initialFormData);
	}, []);

	const handleInputChange = (e, key) => {
		const { value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[key]: {
				...prevFormData[key],
				value: value,
			},
		}));
	};

	const handleOptionsChange = (e, key) => {
		const { value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[key]: {
				...prevFormData[key],
				duration: value,
			},
		}));
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		//console.log(formData);
		const link = document.createElement('a');
		link.href = `http://localhost:5173/aapl.xlsx`;
		link.setAttribute('download', 'aapl.xlsx');
		document.body.appendChild(link);
		link.click();
		link.parentNode.removeChild(link);
	};

	return (
		<div className="flex min-h-screen w-full">
			<div className="min-h-screen w-1/2">
				<img src={excelPreview} alt="Excel Preview" className="w-full h-full object-cover object-top" />
			</div>
			<section className="min-h-screen flex flex-col w-1/2 px-2 pt-8 bg-[#1D2022]">
				<h2 className="text-[#fff] text-3xl font-medium text-center">Building a DCF for: {ticker}</h2>
				<form className="flex flex-wrap gap-10 my-8 max-xl:gap-16 items-center justify-center w-full">
					{formInputs.map((formInput) => {
						return (
							<div key={formInput.id} className="flex flex-col w-[250px]  max-xl:w-[350px] gap-1">
								<label htmlFor="" className="text-[#F2F2F2] font-semibold text-sm flex items-center gap-2">
									{formInput.title} <FaCircleInfo />
								</label>

								<select
									name={formInput.key}
									onChange={(e) => handleOptionsChange(e, formInput.key)}
									className="block w-1/2 py-1 bg-transparent text-[#A16BFB] text-sm font-semibold focus:outline-none  "
								>
									<option value="custom" className="hover:bg-[#A16BFB]">
										Custom
									</option>
									<option value="3">3-Year Average</option>
									<option value="5">5-Year Average</option>
								</select>

								<input
									type="text"
									className="mt-1 bg-[#D9D9D9] text-[#000] py-1 px-2 w-full text-sm placeholder:text-sm placeholder:font-semibold  rounded-full"
									placeholder="30.2"
									onChange={(e) => handleInputChange(e, formInput.key)}
									name={formInput.key}
								/>
							</div>
						);
					})}
				</form>
				<div className="flex flex-col justify-center gap-2 items-center ">
					<button
						disabled={!Object.keys(formData).length}
						onClick={handleFormSubmit}
						className="bg-[#A16BFB] rounded-full py-2 w-[280px] font-semibold text-sm text-[#F2F2F2] flex justify-center items-center"
					>
						Generate
					</button>
					<span className="text-white font-semibold text-sm"> 1 Credit</span>
				</div>
			</section>
		</div>
	);
};

export default SpreadsheetVisualisation;
