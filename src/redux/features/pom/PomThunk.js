// pomThunks.js (similar to what you created earlier)

import { createAsyncThunk } from "@reduxjs/toolkit";
import { fs } from "../../../Config/Config";
import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import { setPOMProducts, setLoading, setError } from "./PomSlice";

// Define an async thunk to fetch POM products
export const fetchPOMProducts = createAsyncThunk(
  "pom/fetchPOMProducts",
  async (_, { dispatch }) => {
    try {
      // Set loading state to true
      dispatch(setLoading(true));

      const POMCollectionRef = collection(fs, "POM");
      const POMQuerySnapshot = await getDocs(POMCollectionRef);
      const POMProducts = await Promise.all(
        POMQuerySnapshot.docs.map(async (docSnapshot) => {
          const productId = docSnapshot.data().productId;
          const productDocRef = doc(fs, "Products", productId);
          const productDocSnapshot = await getDoc(productDocRef);
          if (productDocSnapshot.exists()) {
            const productData = productDocSnapshot.data();
            return { ...productData, id: productId }; // Add id property
          }
          return null;
        })
      );

      // Set the POM products and success state
      dispatch(setPOMProducts(POMProducts.filter((product) => product !== null)));
    } catch (error) {
      // Set error state if an error occurs
      dispatch(setError(error.message));
    }
  }
);
