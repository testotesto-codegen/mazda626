import { api } from '../api';

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data) => ({
				url: `/loginuser`,
				method: 'POST',
				body: data,
				credentials: 'include',
			}),
		}),
		register: builder.mutation({
			query: (data) => ({
				url: `/registeruser`,
				method: 'POST',
				body: data,
			}),
		}),
		forgotPassword: builder.mutation({
			query: (data) => ({
				url: `/forgotpassword`,
				method: 'POST',
				body: data,
			}),
		}),
		resetPassword: builder.mutation({
			query: (data) => ({
				url: `/resetpassword`,
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation, useForgotPasswordMutation, useResetPasswordMutation } = authApi;
