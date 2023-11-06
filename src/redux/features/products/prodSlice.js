// productSlice.js
import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [], // This will store the loaded products
    loading: false,
    error: null,
  },
  reducers: {
    loadProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadProductsSuccess: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    loadProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { loadProductsStart, loadProductsSuccess, loadProductsFailure } =
  productSlice.actions;

export const selectFilteredProducts = (
  state,
  category,
  subcategories,
  brands
) => {
  // Replace this logic with your actual filtering criteria
  return state.products.list.filter((product) => {
    // Check if the product matches the selected criteria
    const isCategoryMatch = category === "" || product.category === category;
    const isSubcategoryMatch =
      subcategories.length === 0 || subcategories.includes(product.subcategory);
    const isBrandMatch = brands.length === 0 || brands.includes(product.brand);

    return isCategoryMatch && isSubcategoryMatch && isBrandMatch;
  });
};

export default productSlice.reducer;
