import { api } from "@/api";

export const lobApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadFiles: builder.mutation({
      query: (form) => {
        return {
          url: `${import.meta.env.VITE_API_URL}/ma/upload_files`,
          method: "POST",
          body: form,
          meta: { skipContentType: true },
        };
      },
    }),
    getLboSettings: builder.query({
      query: () => {
        return {
          url: `${import.meta.env.VITE_API_URL}/ma/settings`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        return response;
      },
    }),
    saveLboSettings: builder.mutation({
      query: (form) => {
        return {
          url: `${import.meta.env.VITE_API_URL}/ma/settings`,
          method: "POST",
          body: form,
          meta: { skipContentType: true },
        };
      },
    }),
    processFiles: builder.mutation({
      query: ({params, file_signatures}) => {
        return {
          url: `${import.meta.env.VITE_API_URL}/ma/process`,
          method: "POST",
          body: {
            params,
            file_signatures,
          },
          responseHandler: (response) => response.blob(),
        };
      },
      transformResponse: (response, meta, arg) => {
        return response;
      },
    }),
  }),
});


export const {
  useUploadFilesMutation,
  useProcessFilesMutation,
  useGetLboSettingsQuery,
  useSaveLboSettingsMutation,
} = lobApi;
