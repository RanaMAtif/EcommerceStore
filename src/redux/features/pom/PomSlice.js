// pomSlice.js (similar to what you created earlier)

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pomProducts: [],
  loading: false,
  success: false,
  error: null,
};

const pomSlice = createSlice({
  name: "pom",
  initialState,
  reducers: {
    setPOMProducts: (state, action) => {
      state.pomProducts = action.payload;
      state.success = true;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setPOMProducts, setLoading, setError } = pomSlice.actions;
export default pomSlice.reducer;
