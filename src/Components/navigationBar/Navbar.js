import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../Images/logo.png";
import { auth } from "../../Config/Config";
import { useHistory } from "react-router-dom";
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import FilterNav from "./FilterNav";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { SearchProduct } from "./SearchProduct";
const adminEmails = {
  "atifranaofficial@gmail.com": true,
};

export const Navbar = ({ user, totalProductsInCart, handleCategoryChange }) => {
  const history = useHistory();
  const location = useLocation();
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
    <>
      <div
        className="navbar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "50px",
          paddingRight: "50px",
          p: 2,
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div className="leftside">
          <div className="logo">
            <Link className="navlink" to="/home">
              <img src={logo} alt="logo" />
            </Link>
          </div>
        </div>

        <div
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SearchProduct />
        </div>

        <div
          className="rightside"
          sx={{ display: "flex", alignItems: "center" }}
        >
          {!user ? (
            <>
              <div>
                <Link className="navlink" to="/signup">
                  SIGN UP
                </Link>
              </div>
              <div>
                <Link className="navlink" to="/login">
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
                  <IconButton aria-label="Show cart items" color="inherit">
                    <Badge badgeContent={totalProductsInCart} color="error">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                </Link>
                {/* <span className="cart-indicator">{totalProductsInCart}</span> */}
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        <div>
          {location.pathname === "/home" && (
            <FilterNav handleCategoryChange={handleCategoryChange} />
          )}
        </div>
      </div>
    </>
  );
};
