import { useState, useEffect } from "react";


const WACCModal = ({isOpen, setIsOpen, wacc, setWacc, waccInputs, setWaccInputs}) => {

    const updateWaccInputs = (key, val) => {
        setWaccInputs(prev => ({...prev, [key]: val}));
    }

    useEffect(() => {
        const calculateWacc = () => {
            const equity = waccInputs["equity"];
            const value = waccInputs["value"];
            const req_rate_of_return = waccInputs["required_rate_of_return"];
            const debt = waccInputs["debt"];
            const cost_of_debt = waccInputs["cost_of_debt"];
            const tax_rate = waccInputs["tax_rate"];

            try {
                const wacc = ((equity / value) * req_rate_of_return) + (((debt / value) * cost_of_debt) * (1 - tax_rate));
                if (isNaN(wacc)) {
                    setWacc(0.0)
                } else {
                    setWacc(wacc);
                }
            } catch {
                setWacc(0);
            }
        }
        calculateWacc();
    }, [waccInputs]);

    return (
        <div className="flex justify-center items-center h-screen z-50">
            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-[#1D2022] p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold text-white">WACC Inputs</h2>
                        <p className="mt-2 text-[#A16BFB]">Please input the fields to calculate WACC.</p>
                        
                        <p className="text-white mt-4">Equity</p>
						<input 
							type="number"
							className="mt-1 bg-[#D9D9D9] text-[#000] py-1 px-2 w-full text-sm placeholder:text-sm placeholder:font-semibold  rounded-full"
							placeholder="0.0"
							value={waccInputs["equity"]}
							onChange={(e) => updateWaccInputs("equity", e.target.value)}
							/>
                        <p className="text-white mt-4">Value</p>
                        <input 
							type="number"
							className="mt-1 bg-[#D9D9D9] text-[#000] py-1 px-2 w-full text-sm placeholder:text-sm placeholder:font-semibold  rounded-full"
							placeholder="0.0"
							value={waccInputs["value"]}
							onChange={(e) => updateWaccInputs("value", e.target.value)}
							/>
                        <p className="text-white mt-4">Required Rate of Return of Equity</p>
                        <input 
							type="number"
							className="mt-1 bg-[#D9D9D9] text-[#000] py-1 px-2 w-full text-sm placeholder:text-sm placeholder:font-semibold  rounded-full"
							placeholder="0.0"
							value={waccInputs["required_rate_of_return"]}
							onChange={(e) => updateWaccInputs("required_rate_of_return", e.target.value)}
							/>
                        <p className="text-white mt-4">Debt</p>
                        <input 
							type="number"
							className="mt-1 bg-[#D9D9D9] text-[#000] py-1 px-2 w-full text-sm placeholder:text-sm placeholder:font-semibold  rounded-full"
							placeholder="0.0"
							value={waccInputs["debt"]}
							onChange={(e) => updateWaccInputs("debt", e.target.value)}
							/>
                        <p className="text-white mt-4">Cost of Debt</p>
                        <input 
							type="number"
							className="mt-1 bg-[#D9D9D9] text-[#000] py-1 px-2 w-full text-sm placeholder:text-sm placeholder:font-semibold  rounded-full"
							placeholder="0.0"
							value={waccInputs["cost_of_debt"]}
							onChange={(e) => updateWaccInputs("cost_of_debt", e.target.value)}
							/>
                        <p className="text-white mt-4">Tax Rate</p>
                        <input 
							type="number"
							className="mt-1 bg-[#D9D9D9] text-[#000] py-1 px-2 w-full text-sm placeholder:text-sm placeholder:font-semibold  rounded-full"
							placeholder="0.0"
							value={waccInputs["tax_rate"]}
							onChange={(e) => updateWaccInputs("tax_rate", e.target.value)}
							/>

                        <div className="text-center mt-4 text-white">
                            Your current WACC:
                        </div>
                        <div 
                            className="text-[#A16BFB] text-center">
                            {wacc}%
                        </div>

                        {/* Buttons */}
                        <div className="mt-4 flex justify-end">
                            <button 
                                className="px-4 py-2 bg-gray-300 rounded mr-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </button>
                            <button 
                                className="px-4 py-2 bg-[#A16BFB] text-white rounded"
                                onClick={() => setIsOpen(false)}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WACCModal;