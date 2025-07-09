import { api } from "../api";
import { store } from "@/redux/store";
import { selectActiveSession } from "@/redux/slices";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNewsByTicker: builder.query({
      query: (ticker) => {
        if (!ticker) {
          const state = store.getState();
          const activeSession = selectActiveSession(state);

          if (activeSession?.ticker && activeSession.ticker !== "PLACEHOLDER") {
            ticker = activeSession.ticker;
            console.log("Getting ticker from Redux store for news:", ticker);
          }
        }

        if (!ticker || ticker === "PLACEHOLDER") {
          console.log(
            "No ticker available for news request or using placeholder",
          );
          return { url: "" }; // Will result in no request being made
        }

        return {
          url: "widgets/news",
          params: {
            ticker: ticker,
            limit: 10,
          },
        };
      },
      transformResponse: (response) => {
        // If the API returns data, return it
        if (response && Array.isArray(response)) {
          return response;
        }

        // Otherwise return mock data
        const ticker =
          store.getState().tickerSessions.activeSession?.ticker || "COMPANY";
        return [
          {
            id: 1,
            title: `${ticker} Reports Strong Q3 Earnings`,
            source: "MarketWatch",
            date: "October 12, 2023",
            content: `${ticker} today announced financial results for its fiscal third quarter of 2023, reporting revenue of $89.3 billion and quarterly earnings per diluted share of $1.46.`,
            url: "#",
          },
          {
            id: 2,
            title: `Analysts Upgrade ${ticker} Following Product Launch`,
            source: "Bloomberg",
            date: "October 8, 2023",
            content:
              "Multiple analysts have raised their price targets on the stock following the successful launch of their latest product line.",
            url: "#",
          },
          {
            id: 3,
            title: `${ticker} Expands into New Markets`,
            source: "Reuters",
            date: "October 1, 2023",
            content:
              "The company announced plans to expand operations into several emerging markets, potentially opening new revenue streams.",
            url: "#",
          },
          {
            id: 4,
            title: `${ticker} Announces Stock Buyback Program`,
            source: "CNBC",
            date: "September 25, 2023",
            content:
              "The board has approved a new $50 billion stock buyback program, signaling confidence in the company's financial position.",
            url: "#",
          },
        ];
      },
    }),
  }),
});

export const { useGetNewsByTickerQuery } = authApi;
