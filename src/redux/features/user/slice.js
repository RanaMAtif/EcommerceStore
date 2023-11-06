import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  FirstName: "",
  LastName: "",
  Email: "",
  UID: "",
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...action.payload };
    },
  },
});

export const { setUser } = slice.actions;
export default slice.reducer;
