import { Link } from "react-router-dom";

import { NewsSkeleton, SearchSymbolsSkeleton } from "./SearchResultSkeleton";

const SearchResult = ({
  data,
  isLoading,
  isError,
  handleTickerClick,
}) => {
  return (
    <>
      <h2 className="text-sm font-medium text-[#FFF] mb-3">Symbols</h2>
      {isLoading?.tickers ? (
        <SearchSymbolsSkeleton />
      ) : data?.tickers && data.tickers.length > 0 ? (
        <div className="w-full flex flex-col max-h-64 overflow-y-auto">
          {data.tickers.map((symbol) => (
            <div
              key={`${symbol.ticker}${symbol.id}`}
              className="flex justify-between items-center text-sm text-[#FFF]  cursor-pointer border-b border-[#1D2022] py-2 px-3 "
              onClick={() => handleTickerClick(symbol)}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-[#722BE8]">
                  {symbol.ticker}
                </span>
                <span className="text-white">{symbol.title}</span>
              </div>

              <div className="flex flex-col gap-1 text-xs font-normal">
                <span className="">{symbol.exchange}</span>
                <span className=" ">{symbol.market}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        data?.tickers &&
        data.tickers.length === 0 && (
          <p className="mx-auto text-xs text-[#fff]">No Symbols found</p>
        )
      )}
      {isError?.tickers && (
        <p className="mx-auto text-xs text-[#fff]">Error fetching symbol</p>
      )}

      <h2 className="text-sm font-medium text-[#FFF] my-3">News</h2>
      {isLoading?.news ? (
        <NewsSkeleton />
      ) : data?.news && data.news.length > 0 ? (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {data.news.map((news, i) => (
            <a
              href={news.url}
              key={i}
              className="py-2 px-3 rounded-lg flex flex-col gap-1 bg-[#161616]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="text-sm font-semibold text-[#722BE8]">
                {news.title}
              </p>
              <span className="text-[#FFFFFF] text-xs">
                {" "}
                {news.publisher} - {news.publishedAt}{" "}
              </span>
            </a>
          ))}
        </div>
      ) : (
        data?.news &&
        data.news.length === 0 && (
          <p className="mx-auto text-xs text-[#fff]">No News found</p>
        )
      )}
      {isError?.news && (
        <p className="mx-auto text-xs text-[#fff]">Error fetching News</p>
      )}
    </>
  );
};

import PropTypes from "prop-types";

SearchResult.propTypes = {
  data: PropTypes.shape({
    tickers: PropTypes.arrayOf(
      PropTypes.shape({
        ticker: PropTypes.string.isRequired,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string,
        exchange: PropTypes.string,
        market: PropTypes.string,
      })
    ),
    news: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        publisher: PropTypes.string,
        publishedAt: PropTypes.string,
      })
    ),
  }),
  isLoading: PropTypes.shape({
    tickers: PropTypes.bool,
    news: PropTypes.bool,
  }),
  isError: PropTypes.shape({
    tickers: PropTypes.bool,
    news: PropTypes.bool,
  }),
  handleTickerClick: PropTypes.func.isRequired,
};

export default SearchResult;
