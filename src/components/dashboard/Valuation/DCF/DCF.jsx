import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCircleInfo } from 'react-icons/fa6';
import DCFLoading from './DCFLoading';
import DCFNews from './DCFNews';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import SalesGrowthModal from './SalesGrowthModal';
import ValuationGraph from './ValuationGraph';
import { LuLineChart } from 'react-icons/lu';
import client from '../../../../client/Client';
import { logoutSuccess } from '../../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveSession } from '../../../../redux/slices/tickerSessionsSlice';
import WACCModal from './WACCModal';

const formInputs = [
	{
		id: 1,
		title: 'Sales Growth Rate',
		key: 'sales_growth',
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
		key: 'd_and_a',
	},
	{
		id: 5,
		title: 'SG&A Growth Rate',
		key: 'sg_and_a',
	},
	{
		id: 6,
		title: 'Capex (% of Sales)',
		key: 'capex',
	},
	{
		id: 7,
		title: 'Exit Multiple',
		key: 'exit_multiple',
	},
	{
		id: 8,
		title: 'WACC',
		key: 'wacc',
	},
];

const defaultWaccInputs = {
	"equity": 0.0,
	"value": 0.0,
	"required_rate_of_return": 0.0,
	"debt": 0.0,
	"cost_of_debt": 0.0,
	"tax_rate": 0.0
}

const Dcf = () => {
	const [formData, setFormData] = useState({});
	const [searchParams] = useSearchParams();
	const [loadingMenu, setLoadingMenu] = useState(true);
	const [loadingDCF, setLoadingDCF] = useState(false);
	const [finishLoading, setFinishLoading] = useState(false);
	const [newsSection, setNewsSection] = useState(false);
	const [growthModal, setGrowthModal] = useState(false);
	const [showGraph, setShowGraph] = useState(false);
	const [waccModal, setWaccModal] = useState(false);
	const [wacc, setWacc] = useState(0.0);
	const [segmentData, setSegmentData] = useState({});
	const [isLoadingSegments, setIsLoadingSegments] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const activeSession = useSelector(selectActiveSession);
	const [waccInputs, setWaccInputs] = useState(defaultWaccInputs);

	// Try to get ticker from URL parameters first, then fallback to active session
	let ticker = searchParams.get('ticker');

	// If ticker is not in URL, try to get from Redux store
	if (!ticker && activeSession && activeSession.ticker && activeSession.ticker !== 'PLACEHOLDER') {
		ticker = activeSession.ticker;
		console.log("Using ticker from Redux store:", ticker);
	}

	// If we still don't have a valid ticker, redirect to dashboard
	useEffect(() => {
		if (!ticker) {
			console.log("No valid ticker found, redirecting to dashboard");
			navigate('/dashboard');
		}
	}, [ticker, navigate]);

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
				value: key == "exit_multiple" ? parseFloat(value) : parseFloat(value) / 100,
			},
		}));
	};

	const handleOptionsChange = (e, key) => {
		const { value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[key]: {
				...prevFormData[key],
				duration: key == "exit_multiple" ? parseFloat(value) : parseFloat(value) / 100,
			},
		}));
	};

	const openWACCModal = () => {
		setWaccModal((prev) => !prev);
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		setLoadingMenu(true);
		setLoadingDCF(true);
		const token_response = await client.validateToken();
		if (token_response == 401) {
			console.log("Logging out");
			dispatch(logoutSuccess());
			navigate("/login");
			return;
		}
		formData["sales_growth"] = {value: parseFloat(document.getElementById(1).value) / 100};

		const response = await client.generateDCF(formData, ticker);
		if (response.status === 401) {
			console.log("Logging out");
			//dispatch(logoutSuccess());
			navigate("/valuation/dcf");
		} else {
			setFinishLoading(true);
			await new Promise((resolve) => {
				setTimeout(() => {
					setFinishLoading(false);
					resolve();
					// Create a Blob from the response data
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute("download", `DCF ${ticker}.xlsx`); // Set file name
					document.body.appendChild(link);
					link.click(); // Trigger download
					link.remove(); // Clean up
				}, 1000); // 1-second buffer after response
			});
		}
		setLoadingDCF(false);

		// if (response.status == 401) {
		// 	console.log("Logging out");
		// 	dispatch(logoutSuccess());
		// 	navigate("/login");
		// } else {
		// 	const timeoutId = setTimeout(() => {
		// 		console.log("API taking too long...");
		// 		setLoadingDCF(false);
		// 	}, 15000);

		// }
	};

	const handleLabelClick = async (e, id) => {
		e.preventDefault();
		if (id !== 1) return;
		await querySegmentData();
		setGrowthModal((prev) => !prev);
	};

	const querySegmentData = async () => {
		if (Object.keys(segmentData).length == 0) {
			setIsLoadingSegments(true);
			const response = await client.getSegmentData(ticker);
			console.log(response);
			if (response.status == 200) {
				const segmentData = response.data;
				setSegmentData(segmentData);
				setIsLoadingSegments(false);
			} else {
				dispatch(logoutSuccess());
				navigate("/login");
			}
		}
	}

	return (
		<div className=" w-full bg-[#1D2022] min-h-screen flex relative">
			{<DCFLoading loadingMenu={loadingMenu} loadingDCF={loadingDCF} finishedLoading={finishLoading} ticker={ticker} />}
			{growthModal && (
				<SalesGrowthModal setGrowthModal={setGrowthModal} growthModal={growthModal} segmentData={segmentData} formData={formData} setFormData={setFormData} />
			)}

			{showGraph && <ValuationGraph setShowGraph={setShowGraph} />}

			<section
				className={`${loadingDCF ? "hidden w-0" : loadingMenu ? 'w-1/2' : newsSection ? 'w-4/6' : 'w-full'}  h-full relative `}
			>
				{!newsSection && (
					<button
						onClick={() => setLoadingMenu(!loadingMenu)}
						className="absolute left-0 top-64 bg-[#393A3D] p-1 rounded-md flex items-center justify-center text-white z-50"
					>
						{loadingMenu ? <MdArrowBackIosNew size={20} /> : <MdArrowForwardIos size={20} />}
					</button>
				)}

				{!loadingMenu && (
					<button
						onClick={() => setNewsSection(!newsSection)}
						className="absolute right-0 top-64 bg-[#393A3D] p-1 rounded-md flex items-center justify-center text-white z-50"
					>
						{newsSection ? <MdArrowForwardIos size={20} /> : <MdArrowBackIosNew size={20} />}
					</button>
				)}
				<div
					className={`flex flex-col mx-auto py-8 ${
						loadingMenu || newsSection ? 'w-full' : 'w-4/6'
					}  `}
				>
					{!loadingMenu && (
						<h2 className="text-[#fff] text-3xl font-medium text-center">
							Building a DCF for: {ticker}
						</h2>
					)}
					<form className="flex flex-wrap gap-14 my-8 max-xl:gap-16 items-center justify-center w-full relative z-100">
						{formInputs.map((formInput) => {
							return (
								<div key={formInput.id} className="flex flex-col w-[270px] max-xl:w-[350px] gap-1">
									<div className="flex items-center gap-2 text-[#F2F2F2]">
										<label
											htmlFor=""
											className={`font-semibold text-sm  cursor-pointer`}
											onClick={(e) => handleLabelClick(e, formInput.id)}
										>
											{formInput.title}
										</label>
										<LuLineChart
											size={16}
											className="cursor-pointer"
											onClick={() => setShowGraph(true)}
										/>
										<div className={`${(formInput.id === 1 && isLoadingSegments) ? 
											'h-4 w-4 animate-spin rounded-full border-4 border-t-transparent border-blue-500' : 
											''}`}></div>
									</div>

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
									{(formInput.key !== "wacc") ?
									<input
										type="text"
										className="mt-1 bg-[#D9D9D9] text-[#000] py-1 px-2 w-full text-sm placeholder:text-sm placeholder:font-semibold  rounded-full"
										placeholder="30.2"
										onChange={(e) => handleInputChange(e, formInput.key)}
										name={formInput.key}
										id={formInput.id}
									/> :
									<button type="button" className='bg-[#A16BFB] rounded-full py-1 px-2 text-sm text-white' onClick={openWACCModal}>
										Calculate WACC: <span className='ml-2'>{wacc}%</span>
									</button>

									}
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
				</div>
			</section>
			<DCFNews newsSection={newsSection} ticker={ticker} />
			<WACCModal isOpen={waccModal} setIsOpen={setWaccModal} wacc={wacc} setWacc={setWacc} waccInputs={waccInputs} setWaccInputs={setWaccInputs} />
		</div>
	);
};

export default Dcf;
