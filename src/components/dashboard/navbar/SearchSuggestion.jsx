import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import client from "@/client/Client";
import {
  useGetTrendingTickersQuery,
  useGetNewsByKeywordMutation,
  useGetTickersByKeywordMutation,
} from "@/api/endpoints";

import SearchResult from "./SearchResult";
import TrendingTickers from "./TrendingTickers";
import TrendingTickersSkeleton from "./TrendingTickersSkeleton";

import {
  selectTickerSessions,
  createSession,
  setActiveSession,
  logoutSuccess,
} from "@/redux/slices";

/* eslint-disable react/prop-types */
const SearchSuggestion = ({ input, showSuggestions, setShowSuggestions }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tickerSessions = useSelector(selectTickerSessions);
  const [getTickersByKeyword] = useGetTickersByKeywordMutation();
  const [getNewsByKeyword] = useGetNewsByKeywordMutation();

  const [searchData, setSearchData] = useState({
    tickers: undefined,
    news: undefined,
  });
  const [isSearchLoading, setIsSearchLoading] = useState({
    tickers: false,
    news: false,
  });
  const [isSearchError, setIsSearchError] = useState({
    tickers: undefined,
    news: undefined,
  });

  const {
    data: trendingData,
    isFetching: isTrendingLoading,
    isError: isTrendingError,
  } = useGetTrendingTickersQuery();

  const fetchKeywordSearch = async () => {
    setIsSearchLoading({ tickers: true, news: true });

    // Start both requests in parallel
    const tickersPromise = getTickersByKeyword(input);
    const newsPromise = getNewsByKeyword(input);


    const handleTickers = async () => {
      try {
        const result = await tickersPromise;
        if (result.error) {
          setIsSearchError((prev) => ({ ...prev, tickers: true }));
          setSearchData((prev) => ({ ...prev, tickers: undefined }));
        } else {
          setSearchData((prev) => ({ ...prev, tickers:  result.data }));
        }
      } catch (e) {
        setIsSearchError((prev) => ({ ...prev, tickers: true }));
        setSearchData((prev) => ({ ...prev, tickers: undefined }));
      } finally {
        setIsSearchLoading((prev) => ({ ...prev, tickers: false }));
      }
    };

    const handleNews = async () => {
      try {
        const result = await newsPromise;
        if (result.error) {
          setIsSearchError((prev) => ({ ...prev, news: true }));
          setSearchData((prev) => ({ ...prev, news: undefined }));
        } else {
          setSearchData((prev) => ({ ...prev, news: result.data }));
        }
      } catch (e) {
        setIsSearchError((prev) => ({ ...prev, news: true }));
        setSearchData((prev) => ({ ...prev, news: undefined }));
      } finally {
        setIsSearchLoading((prev) => ({ ...prev, news: false }));
      }
    };


    handleTickers();
    handleNews();
  };

  useEffect(() => {
    if (input) {
      fetchKeywordSearch();
    } else {
      setSearchData(null);
    }
  }, [input]);

  const handleTickerClick = (symbol) => {
    const tickerSession = tickerSessions.find(
      (session) => session.ticker === symbol.ticker,
    );
    setShowSuggestions(false);

    if (tickerSession) {
      dispatch(setActiveSession(tickerSession.id));
    } else {
      dispatch(createSession(symbol.ticker.toUpperCase()));
    }
    navigate("/valuation");
  };

  return (
    <div className="w-full flex flex-col bg-[#080808] border border-[#1D2022] absolute top-7 -z-10 rounded-lg py-8 px-4">
      {input.length === 0 ? (
        <>
          <h2 className="text-xs font-medium text-[#FFF] mb-3">
            Trending Tickers
          </h2>

          {isTrendingLoading ? (
            <TrendingTickersSkeleton />
          ) : isTrendingError ? (
            <p className="text-[#FFF] text-xs">{isTrendingError}</p>
          ) : (
            <TrendingTickers
              data={trendingData?.trending_tickers || []}
              handleTickerClick={handleTickerClick}
            />
          )}
        </>
      ) : (
        <SearchResult
          data={searchData}
          isLoading={isSearchLoading}
          isError={isSearchError}
          setShowSuggestions={setShowSuggestions}
          handleTickerClick={handleTickerClick}
        />
      )}
    </div>
  );
};

export default SearchSuggestion;
