import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: {
        username: "",
        email: ""
    },
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user.username = action.payload.username;
            state.user.email = action.payload.email;
		},
		deleteUser: (state, action) => {
      state.user = {};
    }
	},
	extraReducers: (builder) => {
		builder.addCase('auth/logoutSuccess', (state, action) => {
			state.user = {};
		});
	},
});

export const { setUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
