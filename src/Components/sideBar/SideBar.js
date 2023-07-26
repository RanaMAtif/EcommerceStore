import React, { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import { fs } from "../../Config/Config";

export const SideBar = ({
  selectedCategory,
  selectedSubcategories,
  setSelectedSubcategories,
  selectedBrands,
  setSelectedBrands,
}) => {
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // Fetch subcategories and brands for the selected category
    if (selectedCategory) {
      fs.collection("Categories")
        .doc(selectedCategory)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            setSubcategories(Object.keys(data));
            setSelectedSubcategories([]);
          } else {
            console.log("No subcategories found for this category.");
            setSubcategories([]);
            setSelectedSubcategories([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching subcategories: ", error);
        });
    } else {
      setSubcategories([]);
      setSelectedSubcategories([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory && selectedSubcategories.length > 0) {
      const fetchBrands = async () => {
        let subcategoryBrands = [];
        for (const subcat of selectedSubcategories) {
          const docRef = fs.collection("Categories").doc(selectedCategory);
          const doc = await docRef.get();
          const data = doc.data();
          const subcategoryBrandsData = data[subcat] || [];
          subcategoryBrands = [...subcategoryBrands, ...subcategoryBrandsData];
        }
        setBrands(subcategoryBrands);
      };
      fetchBrands();
    } else {
      setBrands([]);
    }
  }, [selectedCategory, selectedSubcategories]);

  // Subcategory checkbox change handler
  const handleSubcategoryCheckboxChange = (subcategory) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories((prevSelected) =>
        prevSelected.filter((item) => item !== subcategory)
      );
    } else {
      setSelectedSubcategories((prevSelected) => [
        ...prevSelected,
        subcategory,
      ]);
    }
  };

  // Brand checkbox change handler
  const handleBrandCheckboxChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands((prevBrands) =>
        prevBrands.filter((item) => item !== brand)
      );
    } else {
      setSelectedBrands((prevBrands) => [...prevBrands, brand]);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        borderRadius: "sm",
        overflow: "auto",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "250px", // Adjust the width of the sidebar as desired
        height: "calc(100vh - 130px)", // Adjust the height based on your layout
        backgroundColor: "#072859", // Set the background color to #072859
        color: "white", // Set the text color to white
        padding: "20px", // Add some padding to the sidebar content
      }}
    >
      <Sheet open>
        {selectedCategory && (
          <div>
            <h2>{selectedCategory}</h2>
            {subcategories.length > 0 && (
              <>
                <h3>Subcategories</h3>
                {subcategories.map((subcategory) => (
                  <div key={subcategory}>
                    <input
                      type="checkbox"
                      id={subcategory}
                      checked={selectedSubcategories.includes(subcategory)}
                      onChange={() =>
                        handleSubcategoryCheckboxChange(subcategory)
                      }
                    />
                    <label htmlFor={subcategory}>{subcategory}</label>
                  </div>
                ))}
              </>
            )}
            {brands.length > 0 && (
              <>
                <h3>Brands</h3>
                {brands.map((brand) => (
                  <div key={brand}>
                    <input
                      type="checkbox"
                      id={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandCheckboxChange(brand)}
                    />
                    <label htmlFor={brand}>{brand}</label>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </Sheet>
    </Box>
  );
};
