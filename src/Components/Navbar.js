import React from "react";
import { Link } from "react-router-dom";
import logo from "../Images/logo.png";
import { Icon } from "react-icons-kit";
import { shoppingCart } from "react-icons-kit/feather/shoppingCart";
import { auth } from "../Config/Config";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import FilterNav from"./FilterNav"

export const Navbar = ({ user, totalProducts, handleCategoryChange }) => {
  const history = useHistory();

  const handleLogout = () => {
    auth.signOut().then(() => {
      history.push("/login");
    });
  };

  return (
    <div className="navbar">
      <div className="leftside">
        <div className="logo">
          <Link className="navlink" to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
      </div>
      <div>
        <FilterNav handleCategoryChange={handleCategoryChange} />
      </div>
    

      <div className="rightside">
        {!user && (
          <>
            <div>
              <Link className="navlink" to="signup">
                SIGN UP
              </Link>
            </div>
            <div>
              <Link className="navlink" to="login">
                LOGIN
              </Link>
            </div>
          </>
        )}

        {user && (
          <>
            <div>
              <Link className="navlink" to="/">
                {user}
              </Link>
            </div>
            <div className="cart-menu-btn">
              <Link className="navlink" to="cart">
                <Icon icon={shoppingCart} size={20} />
              </Link>
              <span className="cart-indicator">{totalProducts}</span>
            </div>
            <Button
              onClick={handleLogout}
              style={{
                color: "black",
                background: "#FFD300",
                border: "1px solid #FFD300",
                marginleft: "80px",
              }}
            >
              LOGOUT
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
