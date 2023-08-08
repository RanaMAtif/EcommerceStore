import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import { fs } from "../../Config/Config";
import { getDoc, doc } from "firebase/firestore";

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
      const fetchSubcategories = async () => {
        try {
          const docRef = doc(fs, "Categories", selectedCategory);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const subcategoryList = Object.keys(data);
            setSubcategories(subcategoryList);
            setSelectedSubcategories([]); // Reset selected subcategories
          } else {
            console.log("No subcategories found for this category.");
            setSubcategories([]);
            setSelectedSubcategories([]); // Reset selected subcategories
          }
        } catch (error) {
          console.error("Error fetching subcategories: ", error);
        }
      };

      fetchSubcategories();
    } else {
      setSubcategories([]);
      setSelectedSubcategories([]); // Reset selected subcategories
    }
  }, [selectedCategory, setSelectedSubcategories]);

  useEffect(() => {
    if (selectedCategory && selectedSubcategories.length > 0) {
      const fetchBrands = async () => {
        let subcategoryBrands = [];
        for (const subcat of selectedSubcategories) {
          try {
            const docRef = doc(fs, "Categories", selectedCategory);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const data = docSnap.data();
              const subcategoryBrandsData = data[subcat] || [];
              subcategoryBrands = [
                ...subcategoryBrands,
                ...subcategoryBrandsData,
              ];
            } else {
              console.log("No data found for selectedCategory and subcat.");
            }
          } catch (error) {
            console.error("Error fetching brands: ", error);
          }
        }
        setBrands(subcategoryBrands);
      };
      fetchBrands();
    } else {
      setBrands([]);
    }
  }, [selectedCategory, selectedSubcategories]);

  // Subcategory checkbox change handler
  const handleSubcategoryCheckboxChange = useCallback(
    (subcategory) => {
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
    },
    [selectedSubcategories, setSelectedSubcategories]
  );
  // Brand checkbox change handler
  const handleBrandCheckboxChange = useCallback(
    (brand) => {
      if (selectedBrands.includes(brand)) {
        setSelectedBrands((prevBrands) =>
          prevBrands.filter((item) => item !== brand)
        );
      } else {
        setSelectedBrands((prevBrands) => [...prevBrands, brand]);
      }
    },
    [selectedBrands, setSelectedBrands]
  );

  return (
    <Box
      sx={{
        display: "fixed",
        direction: "row",
        borderRadius: "sm",
        overflow: "auto",
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "250px",
        height: "770px",
        backgroundColor: "#072859",
        color: "white",
        padding: "20px",
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
