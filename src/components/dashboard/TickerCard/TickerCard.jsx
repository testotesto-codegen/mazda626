import { useEffect, useState } from "react";
import client from "../../../client/Client";

const TickerCard = ({ticker}) => {
    const [currentPrice, setCurrentPrice] = useState(0);
    const [companyName, setCompanyName] = useState("");

    useEffect(() => {
        // Get the trading data for the ticker
        const gatherTickerData = async () => {
            const response = await client.getTickerData(ticker);
            if (response.status == 401) {
                dispatch(logoutSuccess());
			    navigate("/login");
            }

            const data = response.data;

            setCompanyName(data.name);
            setCurrentPrice(data.current_price);
        }
        gatherTickerData();
        
    }, [ticker]);

    return (
        <div className="text-white bg-[#747474] m-2 rounded-md w-[120px] h-[120px] vertical-middle text-center relative">
            <div className="text-sm text-left p-2">
                {ticker}
            </div>
            <div className="text-xs text-left pl-2">
                {companyName}
            </div>
            <div className="text-md absolute bottom-0 p-2 text-green-300">
                {parseInt(currentPrice).toFixed(2)}
            </div>
        </div>
    )
}


export default TickerCard;