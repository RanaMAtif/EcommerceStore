import React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import SportsIcon from "@mui/icons-material/Sports";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HardwareIcon from "@mui/icons-material/Hardware";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const FilterNav = (props) => {
  const handleChange = (event, newValue) => {
    let category;
    switch (newValue) {
      case 0:
        category = "Men";
        break;
      case 1:
        category = "Women";
        break;
      case 2:
        category = "Electronics";
        break;
      case 3:
        category = "Sports";
        break;
      case 4:
        category = "Fitness";
        break;
      case 5:
        category = "Tools";
        break;
      case 6:
        category = "Groceries";
        break;
      default:
        category = "All";
        break;
    }
    props.handleCategoryChange(category);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Categories</h1>
      <BottomNavigation showLabels onChange={handleChange}>
        <BottomNavigationAction label="Men" icon={<ManIcon />} />
        <BottomNavigationAction label="Women" icon={<WomanIcon />} />
        <BottomNavigationAction
          label="Electronics"
          icon={<ElectricBoltIcon />}
        />
        <BottomNavigationAction label="Sports" icon={<SportsIcon />} />
        <BottomNavigationAction label="Fitness" icon={<FitnessCenterIcon />} />
        <BottomNavigationAction label="Tools" icon={<HardwareIcon />} />
        <BottomNavigationAction label="Groceries" icon={<ShoppingBagIcon />} />
      </BottomNavigation>
    </div>
  );
};

export default FilterNav;
