import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../Images/logo.png";
import { Icon } from "react-icons-kit";
import { shoppingCart } from "react-icons-kit/feather/shoppingCart";
import { auth } from "../../Config/Config";
import { useHistory } from "react-router-dom";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import FilterNav from "./FilterNav";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
const adminEmails = {
  "atifranaofficial@gmail.com": true,
};

export const Navbar = ({ user, totalProducts, handleCategoryChange }) => {
  const history = useHistory();
  const location = useLocation(); // Get the current route location
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
    <div
      className="navbar"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <div className="leftside">
        <div className="logo">
          <Link className="navlink" to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        </div>
        <div
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center the FilterNav component
          }}
        >
          {/* Conditionally render the FilterNav component */}
          {location.pathname !== "/cart" && (
            <FilterNav handleCategoryChange={handleCategoryChange} />
          )}
        </div>
      

      <div className="rightside" sx={{ display: "flex", alignItems: "center" }}>
        {!user ? (
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
        ) : (
          <>
            <div>
              <Button
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                className="navlink"
                disableRipple
              >
                <Typography variant="body1">{user.firstName}</Typography>
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
                    <ManageAccountsOutlinedIcon
                      size={20}
                      sx={{ marginRight: 1 }}
                    />
                    <Typography variant="body1">ADMIN SETTINGS</Typography>
                  </MenuItem>
                </Menu>
              )}
            </div>
            <div
              className="cart-menu-btn"
              sx={{ display: "flex", alignItems: "center", ml: 2 }}
            >
              <Link className="navlink" to="/cart">
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
