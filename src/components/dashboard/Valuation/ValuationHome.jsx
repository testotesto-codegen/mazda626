import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIosNew } from 'react-icons/md';
import PastSessions from './PastSessions';
import useTickerSession from '../../../hooks/useTickerSession';
import { useSelector } from 'react-redux';
import { selectActiveSession } from '../../../redux/slices/tickerSessionsSlice';

const inputTypes = [
	{
		id: 1,
		title: 'DCF',
	},
	{
		id: 2,
		title: 'Comparable',
	}
];

// {
// 	id: 3,
// 	title: 'Portfolio',
// },
// {
// 	id: 4,
// 	title: 'Valuation',
// },

const ValuationHome = () => {
	const [selectedInput, setSelectedInput] = useState({});
	const [showSessions, setShowSessions] = useState(false);
	const navigate = useNavigate();
	const activeSession = useSelector(selectActiveSession);
	
	// Get active ticker session with automatic redirection and document title update
	const { activeTicker, isLoading } = useTickerSession({
		redirectToDashboard: true,
		updateDocumentTitle: true,
		titlePrefix: "accelno | Valuation"
	});
	
	// Redirect to private valuation if this is a private data session
	useEffect(() => {
		if (activeSession && activeSession.ticker === 'PRIVATE_DATA') {
			navigate('/valuation/private');
		}
	}, [activeSession, navigate]);

	const handleClick = () => {
		if (!selectedInput.id) return;
		
		// Navigate to the appropriate valuation type with the current ticker
		navigate(`/valuation/${selectedInput?.title.toLowerCase()}`);
	};

	// If loading, show a spinner or nothing
	if (isLoading) {
		return null;
	}
	
	// If this is a private data session, don't render the normal valuation home
	if (activeSession && activeSession.ticker === 'PRIVATE_DATA') {
		return null; // Will be redirected by the useEffect above
	}

	return (
		<div className="bg-[#1D2022] w-full flex flex-grow items-center justify-center relative">
			{!showSessions && (
				<button
					onClick={() => setShowSessions(!showSessions)}
					className="absolute top-0 right-0 bg-[#393A3D] p-1 rounded-md flex items-center justify-center text-white z-50"
				>
					<MdArrowBackIosNew size={14} />
				</button>
			)}
			{showSessions && <PastSessions setShowSessions={setShowSessions} />}
			<div className="flex flex-col w-[500px] mx-auto gap-4 items-center">
				<div className="text-white text-xl mb-4">
					Ticker: <span className="font-bold text-[#40FED1]">{activeTicker}</span>
				</div>
				
				<div className="flex px-3 gap-3 mt-3">
					{inputTypes.map((inputType) => {
						return (
							<span
								onClick={() => setSelectedInput(inputType)}
								key={inputType.id}
								className={`${
									inputType.id === selectedInput.id ? 'bg-[#40FED1]' : 'bg-transparent'
								} flex items-center justify-between py-1 px-6 text-sm text-[#F2F2F2] font-semibold border border-[#40FED1] hover:bg-[#40FED1] hover:text-[#000] cursor-pointer rounded-full`}
							>
								{inputType.title}
							</span>
						);
					})}
				</div>
				<button
					disabled={!selectedInput.id}
					onClick={handleClick}
					className={`${
						selectedInput.id ? 'bg-[#A16BFB]' : 'bg-[#c4a1fc]'
					}  rounded-full py-2 w-[280px] mt-9 font-semibold text-sm text-[#F2F2F2] flex justify-center items-center`}
				>
					Create
				</button>
			</div>
		</div>
	);
};

export default ValuationHome;
