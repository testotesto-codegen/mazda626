import PropTypes from "prop-types";
import { FiExternalLink } from "react-icons/fi";

import { useGetNewsByTickerQuery } from "@/api/endpoints";
import { formatDate } from "@/utils";

const DCFNews = ({ ticker, newsSection }) => {

  const {
    data: newsData = [],
    isLoading,
    error,
  } = useGetNewsByTickerQuery(ticker);

  if (isLoading || error || !newsData.length) return null;

  return (
    <section
      className={`${
        newsSection ? "static" : "absolute right-[100%]"
      } w-1/2 max-h-[100vh] overflow-y-auto flex flex-col gap-6 items-center py-4 px-2`}
    >
      <h1 className="mt-7 text-2xl font-bold text-white mb-4">Latest News</h1>
      {newsData.map((article) => (
        <div
          key={article.id}
          className=" w-[350px] bg-[#000] rounded-xl flex flex-col"
        >
          <div className="flex-1">
            <h2 className="bg-[#A16BFB] py-2 px-3 text-white rounded-t-xl text-base font-medium line-clamp-2 overflow-hidden text-ellipsis max-h-[60px] min-h-[50px]">
              {article.title}
            </h2>
            <div className="px-3 pt-1 text-xs text-gray-400 flex justify-between">
              <span className="bg-white text-black px-2 py-1 rounded mt-2">
                {article.source}
              </span>
              <span className="bg-white text-black px-2 py-1 rounded mt-2">
                {formatDate(article.date)}
              </span>
            </div>
            <p className="h-[92px] text-sm font-normal text-white p-3 line-clamp-4 overflow-hidden text-ellipsis">
              {article.content}
            </p>
          </div>
          <div className="p-3 pt flex justify-end bg-transparent">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1D2022] text-[#fff] rounded-xl py-1 px-3 flex items-center gap-1 text-sm"
            >
              Read More <FiExternalLink className="text-xs" />
            </a>
          </div>
        </div>
      ))}
    </section>
  );
};

DCFNews.propTypes = {
  ticker: PropTypes.string.isRequired,
  newsSection: PropTypes.bool.isRequired,
};

export default DCFNews;
