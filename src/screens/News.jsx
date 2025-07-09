import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import useTickerSession from '../hooks/useTickerSession';
import { 
  selectActiveSessionData, 
  updateActiveSessionData 
} from '../redux/slices/tickerSessionsSlice';
import FallbackSpinner from '../components/common/FallbackSpinner';
import client from '../client/Client';


const NewsItem = ({ title, source, date, content, url }) => {
  return (
    <div className="bg-[#121416] p-4 rounded-lg mb-4 hover:bg-[#1D2022] transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <span className="text-xs text-[#667177] bg-[#1D2022] px-2 py-1 rounded">
          {source}
        </span>
      </div>
      <p className="text-sm text-[#A3A8B0] mb-3">{date}</p>
      <div className="text-[#E2E2E2] mb-3">
        <div className="markdown-content">
          <ReactMarkdown
            components={{
              // Style links to be teal and underlined
              a: ({node, ...props}) => (
                <a 
                  {...props} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#40FED1] hover:underline"
                />
              ),
              // Add some spacing to paragraphs
              p: ({node, ...props}) => <p {...props} className="mb-2" />,
              // Style code blocks with a dark background
              code: ({node, inline, ...props}) => 
                inline 
                  ? <code {...props} className="bg-[#1D2022] px-1 py-0.5 rounded text-sm font-mono" /> 
                  : <code {...props} className="block bg-[#1D2022] p-2 my-2 rounded text-sm font-mono overflow-x-auto" />,
              // Add proper styling for pre blocks
              pre: ({node, ...props}) => 
                <pre {...props} className="bg-[#1D2022] p-3 my-3 rounded overflow-x-auto" />,
              // Style headings
              h1: ({node, ...props}) => <h1 {...props} className="text-xl font-bold mt-3 mb-2" />,
              h2: ({node, ...props}) => <h2 {...props} className="text-lg font-bold mt-3 mb-2" />,
              h3: ({node, ...props}) => <h3 {...props} className="text-md font-bold mt-2 mb-1" />,
              // Style lists
              ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 mb-3" />,
              ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 mb-3" />,
              li: ({node, ...props}) => <li {...props} className="mb-1" />,
              // Style blockquotes
              blockquote: ({node, ...props}) => 
                <blockquote {...props} className="border-l-4 border-[#2A2B2D] pl-3 italic my-2" />
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
      {url && (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#40FED1] text-sm hover:underline inline-block"
        >
          Read more →
        </a>
      )}
    </div>
  );
};

const NewsFilter = ({ activeFilter, setActiveFilter }) => {
  const filters = ['Latest', 'Top Stories', 'Press Releases', 'SEC Filings'];
  
  return (
    <div className="flex space-x-2 mb-6">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-2 rounded-full text-sm ${
            activeFilter === filter 
              ? 'bg-[#40FED1] text-[#121416] font-medium' 
              : 'bg-[#1D2022] text-[#A3A8B0] hover:bg-[#2A2B2D]'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

const News = () => {
  const dispatch = useDispatch();
  const { activeTicker, activeSession } = useTickerSession({
    redirectToDashboard: true,
    updateDocumentTitle: true,
    titlePrefix: "accelno | News"
  });
  
  // Get session-specific data from Redux
  const newsData = useSelector(state => selectActiveSessionData(state, 'news.articles')) || [];
  const activeFilter = useSelector(state => selectActiveSessionData(state, 'news.activeFilter')) || 'Latest';
  const isLoading = useSelector(state => selectActiveSessionData(state, 'news.isLoading')) || false;
  
  // Fetch news data when ticker changes
  useEffect(() => {
    if (activeTicker) {
      // Set loading state
      dispatch(updateActiveSessionData({
        dataPath: 'news.isLoading',
        value: true
      }));
      
      // Fetch news data from the API
      const fetchNewsData = async () => {
        try {
          const response = await client.getNewsByTicker(activeTicker);
          
          // Update session data with news and turn off loading
          dispatch(updateActiveSessionData({
            dataPath: 'news.articles',
            value: response
          }));
          
          dispatch(updateActiveSessionData({
            dataPath: 'news.isLoading',
            value: false
          }));
        } catch (error) {
          console.error("Error fetching news data:", error);
          
          // Set error state and turn off loading
          dispatch(updateActiveSessionData({
            dataPath: 'news.error',
            value: "Failed to fetch news data. Please try again later."
          }));
          
          dispatch(updateActiveSessionData({
            dataPath: 'news.isLoading',
            value: false
          }));
        }
      };
      
      fetchNewsData();
    }
  }, [activeTicker, dispatch]);
  
  const setActiveFilter = (filter) => {
    dispatch(updateActiveSessionData({
      dataPath: 'news.activeFilter',
      value: filter
    }));
  };
  
  if (!activeTicker) {
    return null;
  }
  
  if (isLoading) {
    return <FallbackSpinner />;
  }

  return (
    <div className="bg-[#1D2022] text-white p-6 min-h-screen flex flex-col h-screen">
      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">News for {activeTicker}</h1>
        <p className="text-[#A3A8B0]">
          Latest news, press releases and market commentary for {activeTicker}
        </p>
      </div>
      
      {/* Filters */}
      <NewsFilter 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
      />
      
      {/* News feed */}
      <div className="flex-grow overflow-auto pb-6">
        {newsData && newsData.length > 0 ? (
          newsData.map(item => (
            <NewsItem 
              key={item.id}
              title={item.title}
              source={item.source}
              date={item.date}
              content={item.content}
              url={item.url}
            />
          ))
        ) : (
          <div className="bg-[#121416] p-4 rounded-lg text-center">
            <p className="text-[#667177]">No news articles found for {activeTicker}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News; 