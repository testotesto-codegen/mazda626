import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isLoggedIn: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.isLoggedIn = true;
		},
		logoutSuccess: (state, action) => {
			state.isLoggedIn = false;
		},
	},
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
