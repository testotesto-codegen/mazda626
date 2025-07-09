import { api } from "@/api";

export const searchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTrendingTickers: builder.query({
      query: () => ({
        url: "widgets/get_trending_tickers",
        method: "GET",
        credentials: "include",
      }),
    }),
    getTickersByKeyword: builder.mutation({
      query: (keyword) => ({
        url: "widgets/keyword_search",
        method: "POST",
        body: { keyword },
        credentials: "include",
      }),
    }),
    getNewsByKeyword: builder.mutation({
      query: (keyword) => ({
        url: "widgets/keywork_search_news",
        method: "POST",
        body: { keyword },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetTrendingTickersQuery,
  useGetTickersByKeywordMutation,
  useGetNewsByKeywordMutation,
} = searchApi;
