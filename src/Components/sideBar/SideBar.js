import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import { fs } from "../../Config/Config";
import { getDoc, doc } from "firebase/firestore";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";

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
        display: "flex",
        borderRadius: "sm",
        overflow: "auto",
        bottom: 0,
        left: 0,
        backgroundColor: "#072859",
        color: "white",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "width 0.3s",
      }}
      style={{ height: "68%" }}
    >
      <Sheet>
        <div
          style={{
            padding: "20px",
            height: "400px",
            overflowY: "auto",
            width: "100%",
            marginTop: "85",
          }}
        >
          {selectedCategory && (
            <div>
              <Typography variant="h6" gutterBottom>
                {selectedCategory}
              </Typography>
              <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }} />
              {subcategories.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                    Subcategories
                  </Typography>
                  {subcategories.map((subcategory) => (
                    <div key={subcategory} style={{ marginTop: "8px" }}>
                      <Checkbox
                        id={subcategory}
                        checked={selectedSubcategories.includes(subcategory)}
                        onChange={() =>
                          handleSubcategoryCheckboxChange(subcategory)
                        }
                        color="primary"
                      />
                      <label htmlFor={subcategory}>{subcategory}</label>
                    </div>
                  ))}
                </>
              )}
              {brands.length > 0 && (
                <>
                  <Divider
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.12)",
                      marginTop: 2,
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                    Brands
                  </Typography>
                  {brands.map((brand) => (
                    <div key={brand} style={{ marginTop: "8px" }}>
                      <Checkbox
                        id={brand}
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandCheckboxChange(brand)}
                        color="primary"
                      />
                      <label htmlFor={brand}>{brand}</label>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </Sheet>
    </Box>
  );
};
