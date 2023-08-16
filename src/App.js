import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Home } from "./Components/home/Home";
import { Login } from "./Components/pages/Login";
import { Signup } from "./Components/pages/Signup";
import { Cart } from "./Components/cart/Cart";
import AdminPanel from "./Components/admin/AdminPanel";
import { SideBar } from "./Components/sideBar/SideBar";
import ProductInfo from "./Components/product/ProductInfo";

export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/home" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/side" component={SideBar} />
        <Route path="/product/:productId" component={ProductInfo} />
        <Route path="/admin" component={AdminPanel} />
        <Route path="/cart" component={Cart} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
