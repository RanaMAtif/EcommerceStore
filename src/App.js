import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Home } from "./Components/home/Home";
import { Login } from "./Components/pages/Login";
import { Signup } from "./Components/pages/Signup";
import { Cart } from "./Components/cart/Cart";
import AdminPanel from "./Components/admin/AdminPanel";
import ProductInfo from "./Components/product/ProductInfo";
import HandlePOM from "./Components/admin/HandlePOM";
import ContactUs from "./Components/footer/ContactUs";
import { Favorite } from "./Components/pages/Favorite";
import MenuList from "./Components/navigationBar/MenuList";
import { Navbar } from "./Components/navigationBar/Navbar";
import HandleCarousal from "./Components/admin/HandleCarousal";

export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/p" component={HandlePOM} />
        <Route path="/product/:productId" component={ProductInfo} />
        <Route path="/admin" component={AdminPanel} />
        <Route path="/hf" component={Navbar} />
        <Route path="/favorites" component={Favorite} />
        <Route path="/contactus" component={ContactUs} />
        <Route path="/hp" component={HandleCarousal} />
        <Route path="/cart" component={Cart} />
        <Route path="/Menu" component={MenuList} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
