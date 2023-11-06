import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import { Provider } from "react-redux";
import store from "./redux/app/store";
import { setUser } from "./redux/features/user/slice";

// Attempt to load user data from local storage
const storedUserData = JSON.parse(localStorage.getItem("userData"));

// Dispatch the user data to Redux store if available
if (storedUserData) {
  store.dispatch(setUser(storedUserData));
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
reportWebVitals();
