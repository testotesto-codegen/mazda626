/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import client from '../../../../client/Client';

const SalesGrowthModal = ({ setGrowthModal, growthModal, segmentData, formData, setFormData }) => {
	const [columns, setColumns] = useState([]);
	const [rows, setRows] = useState([]);
	const [labels, setLabels] = useState(['']);
	const [averages, setAverages] = useState([]);
	const [values, setValues] = useState([]);
	const [totalValue, setTotalValue] = useState([]);
	const denomination = 1000000;
	const receivedData = useRef(false);

	const updateAverageSelections = (e, index) => {
		const val = e.target.value;

		setAverages(averages.map((num, i) => 
			i == index ? val : num
		));
	}

	const handleValueChange = (e, index) => {
		const val = e.target.value;

		setValues(values.map((num, i) => 
			i == index ? val : num
		));
	}

	const takeAverage = (num, elems) => {
		let average = 0;
		if (num == 3) {
			average = elems.three_year
		} else if (num == 5) {
			average = elems.five_year
		}
		if (average.isNaN ){
			average = 0;
		}
		return average.toFixed(2);
	}
	
	const calculateAverages = () => {
		const newValues = averages.map((num, index) => {
			return num == 'custom' ? values[index] : num == '3' ? takeAverage(3, rows[index]) : num == '5' ? takeAverage(5, rows[index]) : 0
		});
		setValues(newValues);
	}

	const computeTotalValue = () => {
		const total = values.reduce((accum, val) => accum + parseInt(val), 0);
		setTotalValue((total / 5).toFixed(2));
		setFormData((prevFormData) => ({
			...prevFormData,
			["sales_growth"]: {
				...prevFormData["sales_growth"],
				value: parseInt(((total / 5) / 100).toFixed(2)),
			},
		}));
		setTimeout(() => {
			document.getElementById("1").value = (total / 5).toFixed(2);
			setGrowthModal(false);
		}, 500)
	}

	const fillSegmentData = () => {
		const newCols =[
			{
				id: 2,
				label: 2020
			},
			{
				id: 3,
				label: 2021
			},
			{
				id: 4,
				label: 2022
			},
			{
				id: 5,
				label: 2023
			},
			{
				id: 6,
				label: 2024
			}
		]
		let newLabels = [''];
		let newRows = [];
		for (const key in segmentData) {
			const index = key.indexOf(":");
			newLabels.push(key.slice(index + 1, key.length).replace("Member", ""));
			let three_year = 0;
			let five_year = 0;
			let total = 0;
			let count = 0;
			for (let i = 0; i < 3; i++) {
				if (!isNaN(segmentData[key][i + 1]) && !isNaN(segmentData[key][i])) {
					total += ((1 - ((parseInt(segmentData[key][i + 1]) / denomination) / (parseInt(segmentData[key][i]) / denomination))) * 100);
					count += 1;
				}
			}
			three_year = total / count;
			total = 0;
			count = 0;
			for (let i = 0; i < 5; i++) {
				if (!isNaN(segmentData[key][i + 1]) && !isNaN(segmentData[key][i])) {
					total += ((1 - ((parseInt(segmentData[key][i + 1]) / denomination) / (parseInt(segmentData[key][i]) / denomination))) * 100);
					count += 1;
				}
			}
			five_year = total / count;
			newRows.push({
				2020: {
					val: parseInt(segmentData[key][4]) / denomination,
					change: ((1 - ((parseInt(segmentData[key][5]) / denomination) / (parseInt(segmentData[key][4]) / denomination))) * 100).toFixed(2) 
				},
				2021: {
					val: parseInt(segmentData[key][3]) / denomination,
					change: ((1 - ((parseInt(segmentData[key][4]) / denomination) / (parseInt(segmentData[key][3]) / denomination))) * 100).toFixed(2) 
				},
				2022: {
					val: parseInt(segmentData[key][2]) / denomination,
					change: ((1 - ((parseInt(segmentData[key][3]) / denomination) / (parseInt(segmentData[key][2]) / denomination))) * 100).toFixed(2) 
				},
				2023: {
					val: parseInt(segmentData[key][1]) / denomination,
					change: ((1 - ((parseInt(segmentData[key][2]) / denomination) / (parseInt(segmentData[key][1]) / denomination))) * 100).toFixed(2) 
				},
				2024: {
					val: parseInt(segmentData[key][0]) / denomination,
					change: ((1 - ((parseInt(segmentData[key][1]) / denomination) / (parseInt(segmentData[key][0]) / denomination))) * 100).toFixed(2)
				},
				three_year: three_year,
				five_year: five_year 
			});
		}

		setColumns(newCols);
		setRows(newRows);
		setLabels(newLabels);
		// Only set averages once when segmentData first comes in
		if (!receivedData.current) {
			setAverages(new Array(newLabels.length - 1).fill(0));
			setValues(new Array(newLabels.length - 1).fill(0));
		}
		if (Object.keys(segmentData).length > 0) {
			receivedData.current = true;
		}
	}

	useEffect(() => {
		fillSegmentData();
		calculateAverages();
	}, [segmentData, averages]);

	return (
		<div className="bg-black bg-opacity-90 min-h-screen w-screen absolute top-0 bottom-0 left-0 right-0 z-[1000] grid place-items-center ">
			<div className="p-6 rounded-xl w-[90%] h-fit bg-[#1D2022] z-[1500] relative opacity-100">
				<button
					onClick={() => setGrowthModal(!growthModal)}
					className="bg-[#121416] p-1 rounded-full absolute -top-1 -right-1  text-white cursor-pointer"
				>
					<MdOutlineClose />
				</button>
				<h2 className="text-base font-semibold text-white mb-4">Sales Growth Rate</h2>
				<div className="flex justify-center gap-3">
					<div className="flex flex-col ">
						{labels.map((label, index) => (
							<span key={index} className="flex justify-end items-center h-[43px] text-white ">
								{label}
							</span>
						))}
					</div>

					<div className="flex flex-col">
						<div className="flex text-white text-sm">
							{columns.map((column) => (
								<span key={column.id} className="flex justify-center items-center w-20 h-10">
									{column.label}
								</span>
							))}
						</div>
						<div className="[&>*:nth-child(odd)]:bg-[#282C2F] border border-[#fff]">
							{rows.map((row, index) => (
								<div className="flex text-white text-sm p-1" key={index}>
									{Object.values(row).map((value, index) => 
										index < 5 ? (
										<div key={index}>
											<span className="flex justify-center items-center w-20 h-15">
												{value.val.toLocaleString()}
											</span>
											<span className={`${value.change >= 0 ? 'text-green-400' : 'text-red-400'} flex justify-center items-center text-xs`}>
												{value.change}%
											</span>
										</div>) : null
									)}
								</div>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-2 ml-3 mt-10">
						{Array.from({ length: labels.length - 1 }).map((_, index) => (
							<div
								key={index}
								className="bg-[#D9D9D9] text-[#7B7171] rounded-full flex gap-2 h-[37px] px-2 py-1 text-xs w-[200px]"
							>
								<input className="h-full border-r border-[#7B7171] px-2 grid place-items-center w-[38px] bg-transparent border-none focus:outline-none"
										placeholder={values[index]}
										onChange={(e) => handleValueChange(e, index)} />
								<select className="block py-1 bg-transparent font-semibold focus:outline-none w-full " onChange={(e) => updateAverageSelections(e, index)}>
									<option value="custom" className="">
										Custom
									</option>
									<option value="3">3-Year Average</option>
									<option value="5">5-Year Average</option>
								</select>
							</div>
						))}
					</div>
				</div>
				<div className="flex w-3/5 justify-between ml-auto mt-20 pr-10">
					<button className="bg-[#A16BFB] h-full rounded-full py-2 px-10 font-semibold text-sm text-[#F2F2F2] " onClick={computeTotalValue}>
						Generate
					</button>

					{totalValue && <div className="flex flex-col gap-4 text-white">
						<span>Total Average: <span className={`${parseInt(totalValue) < 0 ? 'text-red-400' : 'text-green-400'}`}>{totalValue}%</span></span>
					</div>}
				</div>
			</div>
		</div>
	);
};

export default SalesGrowthModal;
