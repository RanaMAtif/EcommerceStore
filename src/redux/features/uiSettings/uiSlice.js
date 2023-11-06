// uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isCarousalEnabled: true,
    isPOMEnabled: true,
    isSideBannerEnabled: true,
    isBannerEnabled: true,
  },
  reducers: {
    updateUISettings: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateUISettings } = uiSlice.actions;

export default uiSlice.reducer;
