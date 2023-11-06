// footerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: "",
  email: "",
  text: "", // Add a field for the text from ImagePhrase
  facebook: "",
  instagram: "",
  whatsapp: "",
};

const footerSlice = createSlice({
  name: "footer",
  initialState,
  reducers: {
    setFooterData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setFooterData } = footerSlice.actions;
export default footerSlice.reducer;
