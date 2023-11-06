// productThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { fs } from "../../../Config/Config";
import {
  loadProductsStart,
  loadProductsSuccess,
  loadProductsFailure,
} from "./prodSlice"; 


export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { dispatch }) => {
    try {
      dispatch(loadProductsStart());

      const productsRef = collection(fs, "Products");
      const querySnapshot = await getDocs(productsRef);

      const productsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        data.ID = doc.id;
        return data;
      });

      dispatch(loadProductsSuccess(productsArray));
    } catch (error) {
      dispatch(loadProductsFailure(error.message));
    }
  }
);

