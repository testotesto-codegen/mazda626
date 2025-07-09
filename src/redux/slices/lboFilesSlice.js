import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  setFiles: [],
};

const lboFilesSlice = createSlice({
  name: "lboFiles",
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload;
    },
  },
});

export const { setFiles } = lboFilesSlice.actions;
export default lboFilesSlice.reducer;
