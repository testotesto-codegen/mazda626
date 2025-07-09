import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import client from "../client/Client";

// Create a mutex to prevent multiple simultaneous refresh attempts
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/`,
  credentials: "include",
  prepareHeaders: (headers, { meta }) => {
    if (meta && meta.skipContentType) {
      return headers;
    }
    // headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        console.debug("Authentication failed, attempting to refresh token...");
        const refreshResult = await client.refreshToken();

        if (refreshResult.success) {
          console.debug(
            "Token refreshed successfully, retrying original request...",
          );
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.debug("Token refresh failed, logging out user...");
          client.logout();
          // Optionally redirect to login page
          window.location.href = "/login";
        }
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError);
        client.logout();
        window.location.href = "/login";
      } finally {
        release();
      }
    } else {
      // Another request is refreshing, wait for it to complete and retry
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  if (result.error) {
    let errorMessage = "An unexpected error occurred.";

    switch (result.error.status) {
      case 400:
        errorMessage = "Bad request. Please check your input and try again.";
        break;
      case 401:
        errorMessage = "Authentication required. Please log in again.";
        break;
      case 403:
        errorMessage =
          "Access denied. You don't have permission to perform this action.";
        break;
      case 404:
        errorMessage = "The requested resource was not found.";
        break;
      case 422:
        errorMessage =
          "The request format is invalid. Please check your input.";
        break;
      case 429:
        errorMessage = "Too many requests. Please wait a moment and try again.";
        break;
      case 500:
        errorMessage = "Server error. Please try again later.";
        break;
      case 503:
        errorMessage =
          "Service temporarily unavailable. Please try again later.";
        break;
      default:
        if (result.error.error) {
          if (result.error.error.includes("Failed to fetch")) {
            errorMessage =
              "Network error. Please check your connection and try again.";
          } else if (result.error.error.includes("NetworkError")) {
            errorMessage =
              "Network error. This could be due to CORS configuration or server unavailability.";
          }
        }
        break;
    }

    // Add the user-friendly message to the error
    result.error = {
      ...result.error,
      message: errorMessage,
    };
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Filing"],
  endpoints: (builder) => ({}),
});
