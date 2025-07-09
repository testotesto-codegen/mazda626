import { api } from "@/api";
import { organizeFilingsByPeriod } from "@/utils";
export const filingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    get10KFiling: builder.query({
      query: (ticker) => {
        return {
          url: `/filings/10k/${ticker}`,
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        };
      },
      providesTags: (result, error, ticker) => [
        { type: "Filing", id: `10K-${ticker}` },
      ],
      // Increase cache lifetime
      keepUnusedDataFor: 300, // 5 minutes
    }),

    chatWithFiling: builder.mutation({
      query: ({ ticker, message, chatHistory, accession_number }) => {
        return {
          url: `/filings/chat/${ticker}`,
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            message,
            accession_number,
            chat_history: chatHistory.map((msg) => ({
              role: msg.role,
              content: msg.content,
              id: "hello",
            })),
          },
        };
      },
      transformResponse: (response) => {
        console.log("Chat API Response:", response);
        return {
          response: response.response,
          chatHistory: response.chat_history.map((msg) => ({
            id: (msg.id || (Date.now() + Math.random())).toString(),
            role: msg.role,
            content: msg.content,
            references: msg.references || [],
          })),
        };
      },
      invalidatesTags: (result, error, { ticker }) => [
        { type: "Filing", id: `Chat-${ticker}` },
      ],
    }),

    getAllFilings: builder.query({
      query: ({ticker}) => ({
        url: `/filings/${ticker}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      transformResponse: (response, meta, arg) => {
        const filters = arg?.filter ? new Set(arg?.filter) : undefined;
        const latest10K = response?.filings?.find(
          (filing) => filing.form_type === "10-K",
        );

        if (filters) {
          response.filings =
            response?.filings.filter((filing) =>
              filters.has(filing.form_type),
            ) || [];
        }

        response.filings = organizeFilingsByPeriod(response?.filings) || [];

        response.latest10K = latest10K || response?.filings?.find(
          (filing) => filing.form_type === "10-Q",
        );
        return response;
      },
      providesTags: (result, error, ticker) => [
        { type: "Filings", id: `${ticker}` },
      ],
      keepUnusedDataFor: 300,
    }),

    getContentByAccesionNumber: builder.query({
      query: ({ticker, accession_number}) => ({
        url: `/filings/${ticker}/acc/${accession_number}`,
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      }),
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGet10KFilingQuery,
  useChatWithFilingMutation,
  useGetAllFilingsQuery,
  useGetContentByAccesionNumberQuery,
} = filingApi;
