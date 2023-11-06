import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../../Config/Config";
import { getDoc, doc, collection } from "firebase/firestore";
import { fs } from "../../Config/Config";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
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
import FilterNavDropdown from "./FilterNavDropdown";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { SearchProduct } from "./SearchProduct";
import MenuList from "./MenuList";
const adminEmails = {
  "atifranaofficial@gmail.com": true,
};

export const Navbar = ({
  totalProductsInCart,
  handleCategoryChange,
  showFilterNavDropdown,
}) => {
  const history = useHistory();
  const [logoUrl, setLogoUrl] = useState("");
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = useSelector((state) => state.user);

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

  const isAdmin = user && adminEmails[user.Email?.toLowerCase()];

  // Fetch the logo URL from Firestore on component mount
  //fetchImage
  const fetchImageURL = async () => {
    const localStorageKey = "navbar-logo"; // Unique key for logo caching
    try {
      // Check if the logo URL is cached in localStorage
      const cachedLogoUrl = localStorage.getItem(localStorageKey);

      if (cachedLogoUrl) {
        setLogoUrl(cachedLogoUrl);
      } else {
        const docRef = doc(collection(fs, "NavBarLogo"), "Image");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const imageData = docSnap.data();
          const imageUrl = imageData.imageUrl;

          // Cache the logo URL in localStorage
          localStorage.setItem(localStorageKey, imageUrl);
          setLogoUrl(imageUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching image URL:", error);
    }
  };
  useEffect(() => {
    fetchImageURL();
  }, []);

  return (
    <div
      className="navbar"
      style={{
        display: "flex",
        paddingleft: "50px",
        paddingright: "50px",
        position: "fixed",
        top: "0px",
        alignItems: "baseline",
        zIndex: "1",
        width: "100%",
        backgroundColor: "#f6f6f6",
      }}
    >
      <div
        className="menu"
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#F6F6F6",
          width: "100%",
        }}
      >
        <MenuList />
      </div>
      <div
        className="Center Conatainer"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",

          marginTop: "4px",
        }}
      >
        <div style={{ height: "80ps" }} className="leftside">
          <div className="logo">
            <Link className="navlink" to="/">
              {logoUrl ? <img src={logoUrl} alt="logo" /> : <h3>Loading</h3>}
            </Link>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              {location.pathname === "/" && showFilterNavDropdown && (
                <FilterNavDropdown
                  handleCategoryChange={handleCategoryChange}
                />
              )}
            </div>
          </div>
        </div>

        <div
          className="searchproduct"
          style={{
            width: "45%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {location.pathname !== "/contactus" && <SearchProduct />}
        </div>

        <div
          className="rightside"
          sx={{ display: "flex", alignItems: "center" }}
        >
          {!user ? (
            <div
              className="rightsideA"
              style={{ display: "flex", padding: "12px" }}
            >
              <div style={{ padding: "10px" }}>
                <Link className="navlink" to="/signup">
                  SIGN UP
                </Link>
              </div>
              <div style={{ padding: "10px" }}>
                <Link className="navlink" to="/login">
                  LOGIN
                </Link>
              </div>
            </div>
          ) : (
            <div
              className="rightsideB"
              style={{ display: "flex", padding: "12px" }}
            >
              <div>
                <Button
                  aria-controls="user-menu"
                  aria-haspopup="true"
                  onClick={handleUserMenuOpen}
                  className="navlink"
                  disableRipple
                >
                  <Typography variant="body1">{user.FirstName}</Typography>
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
            </div>
          )}
        </div>
      </div>
      <div
        className="Categories"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative ",
          margin: "auto",
          marginTop: "-50px",
        }}
      >
        <div>
          {location.pathname === "/" && !showFilterNavDropdown && (
            <FilterNav handleCategoryChange={handleCategoryChange} />
          )}
        </div>
      </div>
    </div>
  );
};
