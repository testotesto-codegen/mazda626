import PropTypes from "prop-types";

const TrendingTickers = ({ data, handleTickerClick }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No trending tickers data available or not an array:", data);
    return (
      <div className="text-white text-xs">No trending tickers available</div>
    );
  }
  return (
    <div className="w-full flex flex-wrap justify-center max-h-64 overflow-y-auto">
      {data?.slice(0, 6).map((ticker) => (
        <div
          onClick={() => handleTickerClick(ticker)}
          key={ticker.ticker}
          className="flex text-[12px] cursor-pointer gap-2 bg-[#1D2022] my-[3px] mx-[1px] hover:outline hover:outline-2 hover:outline-[#fff] py-2 px-3 rounded-full"
        >
          <span className="text-[#FFF] font-semibold">{ticker?.ticker}</span>
          <span className="">{ticker?.price}</span>
          <span
            className={`${ticker?.change >= 0 ? "text-[#40FED1]" : "text-red-400"} font-medium`}
          >
            ({(ticker?.change * 100).toFixed(2)}%)
          </span>
        </div>
      ))}
    </div>
  );
};

TrendingTickers.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      ticker: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      change: PropTypes.number.isRequired,
    })
  ).isRequired,
  handleTickerClick: PropTypes.func.isRequired,
};


export default TrendingTickers;
