import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/slice";
import footerReducer from "../features/footer/Slice";
import { fetchFooterData } from "../features/footer/thunk";
import pomReducer from "../features/pom/PomSlice"; 
import { fetchPOMProducts } from "../features/pom/PomThunk";
import productReducer from "../features/products/prodSlice";
import { fetchProducts } from "../features/products/prodthunk";
import uiReducer from "../features/uiSettings/uiSlice";
import { fetchUISettings } from "../features/uiSettings/uithunk";
// Function to load user data from local storage
const loadUserDataFromLocalStorage = () => {
  try {
    const serializedUserData = localStorage.getItem("userData");
    if (serializedUserData === null) {
      return undefined; // Return undefined to use the initial state
    }
    return JSON.parse(serializedUserData);
  } catch (err) {
    console.error("Error loading user data from local storage:", err);
    return undefined; // Return undefined in case of an error
  }
};

// Function to save user data to local storage
const saveUserDataToLocalStorage = (userData) => {
  try {
    const serializedUserData = JSON.stringify(userData);
    localStorage.setItem("userData", serializedUserData);
  } catch (err) {
    console.error("Error saving user data to local storage:", err);
  }
};

// Function to load footer data from local storage
const loadFooterDataFromLocalStorage = () => {
  try {
    const serializedFooterData = localStorage.getItem("footerData");
    if (serializedFooterData === null) {
      return undefined; // Return undefined to use the initial state
    }
    return JSON.parse(serializedFooterData);
  } catch (err) {
    console.error("Error loading footer data from local storage:", err);
    return undefined; // Return undefined in case of an error
  }
};
// Function to load POM data from local storage
const loadPOMDataFromLocalStorage = () => {
  try {
    const serializedPOMData = localStorage.getItem("pomData");
    if (serializedPOMData === null) {
      return undefined; // Return undefined to use the initial state
    }
    return JSON.parse(serializedPOMData);
  } catch (err) {
    console.error("Error loading POM data from local storage:", err);
    return undefined; // Return undefined in case of an error
  }
};

// Define a function to save POM data to local storage
const savePOMDataToLocalStorage = (pomData) => {
  try {
    const serializedPOMData = JSON.stringify(pomData);
    localStorage.setItem("pomData", serializedPOMData);
  } catch (err) {
    console.error("Error saving POM data to local storage:", err);
  }
};

// Function to save footer data to local storage
const saveFooterDataToLocalStorage = (footerData) => {
  try {
    const serializedFooterData = JSON.stringify(footerData);
    localStorage.setItem("footerData", serializedFooterData);
  } catch (err) {
    console.error("Error saving footer data to local storage:", err);
  }
};

const preloadedState = {
  user: loadUserDataFromLocalStorage(),
  footer: loadFooterDataFromLocalStorage(),
  pom: loadPOMDataFromLocalStorage(),
};

const store = configureStore({
  reducer: {
    user: userReducer,
    footer: footerReducer,
    pom: pomReducer,
    products: productReducer,
    ui: uiReducer,

  },
  preloadedState,
});

// Subscribe to store changes to save user data and footer data to local storage
store.subscribe(() => {
  const state = store.getState();
  saveUserDataToLocalStorage(state.user);
  saveFooterDataToLocalStorage(state.footer);
  savePOMDataToLocalStorage(state.pom);
});

// Fetch footer data when the app initializes
store.dispatch(fetchFooterData());
store.dispatch(fetchPOMProducts());
store.dispatch(fetchProducts());
store.dispatch(fetchUISettings());

export default store;
