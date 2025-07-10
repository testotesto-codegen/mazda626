import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess, logoutSuccess } from "../redux/slices/authSlice";
import { deleteUser } from "../redux/slices/userSlice";
import { store } from "../redux/store";
import { selectActiveSession } from "../redux/slices/tickerSessionsSlice";
import logger from "../utils/logger";

class Client {
  constructor() {
    this.axios = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
    });
    this._setupInterceptors();
    this.cancelToken;
  }

  _setupInterceptors() {
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Avoid infinite loop: don't intercept refresh endpoint
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes('/auth/refresh')
        ) {
          originalRequest._retry = true;
          try {
            await this.refreshToken();
            return this.axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails (especially with 401), logout the user
            await this.logout();
            return Promise.reject(refreshError);
          }
        }
        if (error.response?.status === 401) {
          await this.logout();
        }
        return Promise.reject(error);
      },
    );
  }

  async getTickerData(ticker) {
    return this.axios.get(`/api/ticker/${ticker.upper()}`);
  }

  async generateComps(tickers) {
    const state = store.getState();
    const activeSession = selectActiveSession(state);
    const activeSessionTicker = activeSession?.ticker;

    // Make sure we have valid tickers
    if (!tickers || tickers.length === 0) {
      console.error("No tickers provided for comps generation");
      return {
        text: "No tickers provided for comparison",
        status: 400,
      };
    }

    // If the current active session's ticker is not the first element and it's a valid ticker,
    // reorganize the array to make it first
    if (
      activeSessionTicker &&
      activeSessionTicker !== "PLACEHOLDER" &&
      activeSessionTicker !== "PRIVATE_DATA" &&
      tickers[0] !== activeSessionTicker
    ) {
      // Remove the active session ticker if it exists in the array (to avoid duplicates)
      tickers = tickers.filter(
        (ticker) => ticker.toUpperCase() !== activeSessionTicker.toUpperCase(),
      );

      // Add the active session ticker as the first element
      tickers.unshift(activeSessionTicker);

      logger.debug("Reordered tickers array with active session ticker first", { tickers });
    }

    const endpoint = `/comps/generate_comps`;
    const formData = { tickers: tickers };

    try {
      const response = await this.axios.post(endpoint, formData, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (e) {
      console.error("Error generating comps:", e);
      return {
        text: "Unable to generate comps.",
        status: e.response?.status || 401,
        error: e.message,
      };
    }
  }

  async refreshToken() {
    await this.axios.post("/auth/refresh");
  }

  async validateToken() {
    try {
      const endpoint = "/auth/me";
      const response = await this.axios.get(endpoint);

      return response.status;
    } catch (e) {
      return 500;
    }
  }

  async getSegmentData(ticker) {
    // If ticker is null or undefined, try to get it from the Redux store
    if (!ticker) {
      // Get the current state from Redux store
      const state = store.getState();
      // Get the active session using the selector
      const activeSession = selectActiveSession(state);

      // Use the ticker from active session if available and not a placeholder
      if (
        activeSession &&
        activeSession.ticker &&
        activeSession.ticker !== "PLACEHOLDER"
      ) {
        ticker = activeSession.ticker;
        console.log("Getting ticker from Redux store:", ticker);
      }
    }

    // If we still don't have a ticker, log an error
    if (!ticker) {
      console.error("No ticker available for segment data request");
      return {
        text: "No ticker specified for segment data request",
        status: 400,
      };
    }

    const endpoint = `/dcf/get_segment_data?ticker=${ticker}`;
    try {
      const response = await this.axios.get(endpoint);
      console.log(response);
      return response;
    } catch (e) {
      console.log(e);
      return {
        text: "Unable to get segment data.",
        status: 401,
      };
    }
  }

  async registerUser(data) {
    const endpoint = "/auth/register";
    const formData = {};
    formData["username"] = data.username;
    formData["email"] = data.email;
    formData["password"] = data.password;
    console.log(formData);

    const response = await this.axios.post(endpoint, formData, {
      headers: { "Content-Type": "application/json" },
    });

    return response.status;
  }

  async getUser() {
    const endpoint = "/auth/me";

    try {
      const response = await this.axios.get(endpoint, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (e) {
      return {
        text: "Unable to get user.",
        status: 401,
      };
    }
  }

  async logout() {
    await this.axios.post("/auth/logout");
    // Clear Redux auth and user state
    store.dispatch(logoutSuccess());
    store.dispatch(deleteUser());
    localStorage.removeItem("user"); // Example if you store user data
    window.location.href = "/login"; // Redirect to login page
  }

  async login(username, password) {
    const endpoint = "/auth/login";
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await this.axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return {
        status: error.response?.status || 500,
        data: error.response?.data || "Login failed",
      };
    }
  }

  async generateDCF(params, ticker) {
    const endpoint = "/dcf/generate_dcf";

    // If ticker is null or undefined, try to get it from the Redux store
    if (!ticker) {
      // Get the current state from Redux store
      const state = store.getState();
      // Get the active session using the selector
      const activeSession = selectActiveSession(state);

      // Use the ticker from active session if available and not a placeholder
      if (
        activeSession &&
        activeSession.ticker &&
        activeSession.ticker !== "PLACEHOLDER"
      ) {
        ticker = activeSession.ticker;
        console.log("Getting ticker from Redux store for DCF:", ticker);
      }
    }

    // If we still don't have a ticker, return an error
    if (!ticker) {
      console.error("No ticker available for DCF generation");
      return {
        text: "No ticker specified for DCF generation",
        status: 400,
      };
    }

    const formData = {};
    console.log(params);
    for (const key in params) {
      const val = params[key];
      try {
        const input_value = val.value;
        if (input_value) {
          if (key == "wacc" || key == "exit_multiple") {
            formData[key] = input_value;
          } else {
            formData[key] = [input_value];
          }
        } else {
          if (key == "wacc" || key == "exit_multiple") {
            formData[key] = 0.0;
          } else {
            formData[key] = [0];
          }
        }
      } catch (e) {
        console.log(e);
        continue;
      }
    }
    formData["ticker"] = ticker;
    console.log(formData);
    try {
      const response = await this.axios.post(endpoint, formData, {
        responseType: "blob",
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (e) {
      return {
        text: "Unable to get DCF.",
        status: 401,
      };
    }
  }

  async getNewsByTicker(ticker) {
    const endpoint = "/widgets/news";

    // If ticker is null or undefined, try to get it from the Redux store
    if (!ticker) {
      // Get the current state from Redux store
      const state = store.getState();
      // Get the active session using the selector
      const activeSession = selectActiveSession(state);

      // Use the ticker from active session if available and not a placeholder
      if (
        activeSession &&
        activeSession.ticker &&
        activeSession.ticker !== "PLACEHOLDER"
      ) {
        ticker = activeSession.ticker;
        console.log("Getting ticker from Redux store for news:", ticker);
      }
    }

    // If we still don't have a ticker, return an empty array
    if (!ticker || ticker === "PLACEHOLDER") {
      console.log("No ticker available for news request or using placeholder");
      return [];
    }

    try {
      const response = await this.axios.get(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          ticker: ticker,
          limit: 10, // Request up to 10 news items
        },
      });

      // If the API returns data, return it
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }

      // Otherwise, return mock data for now
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
    } catch (error) {
      console.error("Error fetching news for ticker:", ticker, error);
      return [];
    }
  }

  async checkSubscription() {
    const endpoint = "/payment/check-subscription";

    try {
      const response = await this.axios.get(endpoint, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        has_subscription: response.data.has_subscription,
        status: response.status,
      };
    } catch (error) {
      console.error("Error checking subscription:", error);
      return {
        has_subscription: false,
        status: error.response?.status || 500,
      };
    }
  }

  async getSubscriptionDetails() {
    const endpoint = "/payment/subscription-details";

    try {
      const response = await axios.get(this.BASE_URL + endpoint, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If the endpoint is not yet implemented, provide fallback data
      if (response.status === 404) {
        const hasSubscription = await this.checkSubscription();

        if (hasSubscription.has_subscription) {
          return {
            status: 200,
            data: {
              status: "active",
              plan: "Accelno Monthly Subscription",
              current_period_end: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              amount: 50.0,
              currency: "usd",
            },
          };
        } else {
          return {
            status: 200,
            data: null,
          };
        }
      }

      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching subscription details:", error);

      // Fallback to provide data if backend endpoint isn't available yet
      try {
        const hasSubscription = await this.checkSubscription();

        if (hasSubscription.has_subscription) {
          return {
            status: 200,
            data: {
              status: "active",
              plan: "Accelno Monthly Subscription",
              current_period_end: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              amount: 50.0,
              currency: "usd",
            },
          };
        }
      } catch (e) {
        console.error("Error in fallback subscription check:", e);
      }

      return {
        status: error.response?.status || 500,
        message:
          error.response?.data?.detail ||
          "Failed to fetch subscription details",
      };
    }
  }

  async createCustomerPortalSession(
    returnUrl = window.location.origin + "/settings",
  ) {
    const endpoint = "/payment/create-customer-portal";

    try {
      const response = await axios.post(
        this.BASE_URL + endpoint,
        { return_url: returnUrl },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return {
        status: response.status,
        url: response.data.url,
      };
    } catch (error) {
      console.error("Error creating customer portal session:", error);
      return {
        status: error.response?.status || 500,
        message:
          error.response?.data?.detail ||
          "Failed to create customer portal session",
      };
    }
  }

  async createCheckoutSession(priceId = "price_1RQM8hIe9TNYqXCwh57EGtjz") {
    const endpoint = "/payment/create-checkout-session";

    try {
      const response = await this.axios.post(
        endpoint,
        { price_id: priceId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return {
        status: response.status,
        url: response.data.url,
      };
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return {
        status: error.response?.status || 500,
        message:
          error.response?.data?.detail || "Failed to create checkout session",
      };
    }
  }
}

const client = new Client();
export default client;
