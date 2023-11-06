import React from "react";
import { Link } from "react-router-dom";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";

export default function MenuList() {
  const menus = [
    { label: "Home", path: "/" },
    { label: "Favorites", path: "/favorites" },
    { label: "Customer Care", path: "/contactus" },
    { label: "Track My Order", path: "/track-order" },
    { label: "Sell on Store", path: "/sell" },
  ];

  return (
    <List
      orientation="horizontal"
      aria-label="Example application menu bar"
      role="menubar"
      data-joy-color-scheme="dark"
      sx={{
        bgcolor: "black",
        borderRadius: "4px",
        maxWidth: "fit-content",
      }}
      style={{maxWidth:"100%",
      display:"flex",
      justifyContent:"center"}}
    >
      {menus.map((menu, index) => (
        <ListItem
          key={index}
          sx={{
            cursor: "pointer",
            padding: "8px 16px",
            fontWeight: "normal",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Link
            to={menu.path}
            style={{ color: "white", textDecoration: "none" }} // Set text color and remove underline
          >
            {menu.label}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
