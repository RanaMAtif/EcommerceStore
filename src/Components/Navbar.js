import React from "react";
import { Link } from "react-router-dom";
import logo from "../Images/logo.png";
import { Icon } from "react-icons-kit";
import { shoppingCart } from "react-icons-kit/feather/shoppingCart";
import { auth } from "../Config/Config";
import { useHistory } from "react-router-dom";
import { Button, Menu, MenuItem } from "@mui/material";
import FilterNav from "./FilterNav";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
const adminEmails = {
  "atifranaofficial@gmail.com": true,
};

export const Navbar = ({ user, totalProducts, handleCategoryChange }) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleLogout = () => {
    auth.signOut().then(() => {
      history.push("/login");
    });
  };
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  const handleAdminSettings = () => {
    history.push("/admin");
  };

  const isAdmin = user && adminEmails[user.email?.toLowerCase()];
  
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
              <Button
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                className="navlink"
                disableRipple
              >
                {user.firstName}
              </Button>
              {isAdmin && ( // Check if the user is an admin before rendering the menu
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem onClick={handleAdminSettings}>
                    <ManageAccountsOutlinedIcon size={20} />
                    Admin Settings
                  </MenuItem>
                </Menu>
              )}
              
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
