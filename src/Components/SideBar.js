import React, { useState } from "react";
import { subcategoryOptions, brandOptions } from "./AddProducts";

export const SideBar = ({
  category,
  handleSubcategoryChange,
  handleBrandChange,
}) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const handleSubcategoryCheckboxChange = (event) => {
    const subcategory = event.target.value;
    if (event.target.checked) {
      setSelectedSubcategories((prevSelected) => [
        ...prevSelected,
        subcategory,
      ]);
    } else {
      setSelectedSubcategories((prevSelected) =>
        prevSelected.filter((item) => item !== subcategory)
      );
    }
    handleSubcategoryChange(subcategory);
  };

  const handleBrandCheckboxChange = (event) => {
    const brand = event.target.value;
    if (event.target.checked) {
      setSelectedBrands((prevSelected) => [...prevSelected, brand]);
    } else {
      setSelectedBrands((prevSelected) =>
        prevSelected.filter((item) => item !== brand)
      );
    }
    handleBrandChange(brand);
  };

  return (
    <div
      style={{
        backgroundColor: "#f6f6f6",
        padding: "10px",
        height: "100%",
        flex: "0 0 20%",
        position: "fixed",
        top: 120,
        left: 0,
        zIndex: 1,
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>{category}</h1>
      <div style={{ marginTop: "20px" }}>
        <h2>Categories</h2>
        <div style={{ backgroundColor: "#fff" }}>
          {subcategoryOptions[category]?.map((subcategory) => (
            <div key={subcategory}>
              <input
                type="checkbox"
                id={subcategory}
                value={subcategory}
                checked={selectedSubcategories.includes(subcategory)}
                onChange={handleSubcategoryCheckboxChange}
              />
              <label htmlFor={subcategory}>{subcategory}</label>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Brands</h2>
        {brandOptions[category]?.map((brand) => (
          <div key={brand} style={{ backgroundColor: "#fff" }}>
            <input
              type="checkbox"
              id={brand}
              value={brand}
              checked={selectedBrands.includes(brand)}
              onChange={handleBrandCheckboxChange}
            />
            <label htmlFor={brand}>{brand}</label>
          </div>
        ))}
      </div>
    </div>
  );
};
