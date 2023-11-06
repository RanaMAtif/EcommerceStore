import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const categories = [
  "Men",
  "Women",
  "Electronics",
  "Sports",
  "Fitness",
  "Tools",
  "Groceries",
];

const FilterNavDropdown = ({ handleCategoryChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = (category) => {
    handleCategoryChange(category);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Button
        aria-controls={open ? "filter-nav-menu" : undefined}
        aria-haspopup="true"
        variant="outlined"
        style={{ textTransform: "none" }}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Categories
      </Button>
      <Menu
        id="filter-nav-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        style={{ top: "5px", left: "5px" }}
      >
        {categories.map((category) => (
          <MenuItem
            key={category}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default FilterNavDropdown;
