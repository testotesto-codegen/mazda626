import { api } from '../api';

export const widgetDataApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getSingleStockData: builder.query({
			query: (stock) => ({
				url: `/singlestockdata/${stock}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getChart: builder.query({
			query: (stock) => ({
				url: `/singlestockchart/${stock}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getMarketChart: builder.query({
			query: () => ({
				url: `/marketchart`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getMovers: builder.query({
			query: (type) => ({
				url: `marketmovers/${type}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getTrendingStocks: builder.query({
			query: () => ({
				url: `/trendingstocks`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getFinancials: builder.query({
			query: (stocks) => ({
				url: `/financials/${stocks}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getFiftyTwoWeeks: builder.query({
			query: (stocks) => ({
				url: `/52weekhighlow/${stocks}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getStockDetail: builder.query({
			query: (stock) => ({
				url: `/stockdetail/${stock}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getChartbyRange: builder.query({
			query: (data) => ({
				url: `/stockchartbyrange/${data}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getHeatmap: builder.query({
			query: () => ({
				url: `/heatmap`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getNewsFeed: builder.query({
			query: (data) => ({
				url: `/news?limit=${data}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getWatchlist: builder.query({
			query: (data) => ({
				url: `/watchlist?tickers=${data}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getEarningsCalendar: builder.query({
			query: (data) => {
				const { date, input } = data;
				return {
					url: `/earnings?date=${date}&ticker=${input}`,
					method: 'GET',
					credentials: 'include',
				};
			},
		}),
		getEarningsCount: builder.query({
			query: (data) => ({
				url: `/count-earnings?date=${data}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getActiveStocks: builder.query({
			query: () => ({
				url: `/widgets/active-stocks`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getGainers: builder.query({
			query: (data) => ({
				url: `widgets/market-movement?direction=${data}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getStockCard: builder.query({
			query: (data) => ({
				url: `widgets/stock-card?ticker=${data}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getCandleStickHistoricalData: builder.query({
			query: (data) => {
				const { ticker, dataType } = data;
				return {
					url: `/candlestick-historical?ticker=${ticker}&dataType=${dataType}`,
					method: 'GET',
					credentials: 'include',
				};
			},
		}),
		getTrendingSearch: builder.query({
			query: () => ({
				url: `/trending-search`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getKeywordSearchTicker: builder.query({
			query: (data) => ({
				url: `/keyword-search?keyword=${data}`,
				method: 'GET',
				credentials: 'include',
			}),
		}),
		getInsiderTransactions: builder.query({
			// Mock data for insider transactions
			queryFn: () => {
				const mockData = [
					{
						ticker: "AAPL",
						companyName: "Apple Inc.",
						person: "Tim Cook",
						date: "2024-05-15",
						shares: 10000,
						sharePrice: 175.50,
						value: 1755000,
					},
					{
						ticker: "MSFT",
						companyName: "Microsoft Corporation",
						person: "Satya Nadella",
						date: "2024-05-10",
						shares: 5000,
						sharePrice: 320.00,
						value: 1600000,
					},
					{
						ticker: "GOOGL",
						companyName: "Alphabet Inc.",
						person: "Sundar Pichai",
						date: "2024-05-12",
						shares: 2000,
						sharePrice: 2800.00,
						value: 5600000,
					},
					{
						ticker: "TSLA",
						companyName: "Tesla, Inc.",
						person: "Elon Musk",
						date: "2024-05-18",
						shares: 1500,
						sharePrice: 700.00,
						value: 1050000,
					},
					{
						ticker: "AMZN",
						companyName: "Amazon.com, Inc.",
						person: "Andy Jassy",
						date: "2024-05-20",
						shares: 2500,
						sharePrice: 3400.00,
						value: 8500000,
					},
				];
				return { data: mockData };
			},
		}),
	}),
});

export const {
	useGetSingleStockDataQuery,
	useGetChartQuery,
	useGetMarketChartQuery,
	useGetMoversQuery,
	useGetTrendingStocksQuery,
	useGetFinancialsQuery,
	useGetFiftyTwoWeeksQuery,
	useGetStockDetailQuery,
	useGetChartbyRangeQuery,
	useGetHeatmapQuery,
	useGetNewsFeedQuery,
	useGetWatchlistQuery,
	useGetEarningsCalendarQuery,
	useGetEarningsCountQuery,
	useGetActiveStocksQuery,
	useGetGainersQuery,
	useGetStockCardQuery,
	useGetCandleStickHistoricalDataQuery,
	useGetTrendingSearchQuery,
	useGetKeywordSearchQuery,
	useGetInsiderTransactionsQuery,
} = widgetDataApi;
