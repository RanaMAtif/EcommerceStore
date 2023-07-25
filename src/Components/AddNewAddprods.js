import React, { useState, useEffect } from "react";
import { fs } from "../Config/Config";
import firebase from "firebase/app";
import "firebase/firestore";

const AddNewAddprods = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");

  // Fetch categories from Firestore when the component mounts
  useEffect(() => {
    fs.collection("Categories")
      .get()
      .then((querySnapshot) => {
        const categoryList = querySnapshot.docs.map((doc) => doc.id);
        setCategories(categoryList);
      })
      .catch((error) => {
        console.error("Error fetching categories: ", error);
      });
  }, []);

  // Fetch subcategories for the selected category from Firestore
  useEffect(() => {
    if (category) {
      fs.collection("Categories")
        .doc(category)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const subcategoryList = Object.keys(doc.data());
            setSubcategories(subcategoryList);
          } else {
            console.log("No subcategories found for this category.");
            setSubcategories([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching subcategories: ", error);
        });
    } else {
      setSubcategories([]);
    }
  }, [category]);

  // Fetch brands for the selected subcategory from Firestore
  useEffect(() => {
    if (category && subcategory) {
      fs.collection("Categories")
        .doc(category)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const brandsList = doc.data()[subcategory] || [];
            setBrands(brandsList);
          } else {
            console.log("No brands found for this subcategory.");
            setBrands([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching brands: ", error);
        });
    } else {
      setBrands([]);
    }
  }, [category, subcategory]);

  const handleAddData = (e) => {
    e.preventDefault();

    // Add category, subcategory, and brand data to Firestore
    if (category && (subcategory || brand)) {
      let subcategoryToAdd = subcategory;
      if (!subcategories.includes(subcategory)) {
        // If the subcategory is not in the subcategories list, it's a new value
        // Add it to the subcategories list
        subcategoryToAdd = subcategory;
        setSubcategories([...subcategories, subcategory]);
      }

      let brandToAdd = brand;
      if (!brands.includes(brand)) {
        // If the brand is not in the brands list, it's a new value
        // Add it to the brands list
        brandToAdd = brand;
        setBrands([...brands, brand]);
      }

      fs.collection("Categories")
        .doc(category)
        .set(
          {
            [subcategoryToAdd]:
              firebase.firestore.FieldValue.arrayUnion(brandToAdd),
          },
          { merge: true }
        )
        .then(() => {
          console.log("Data added to Firestore successfully!");
          setCategory("");
          setSubcategory("");
          setBrand("");
        })
        .catch((error) => {
          console.error("Error adding data to Firestore: ", error);
        });
    } else {
      console.log("Please enter values for all fields.");
    }
  };

  return (
    <div className="container">
      <h1>Add Data to Firestore</h1>
      <form onSubmit={handleAddData}>
        <div className="form-group">
          <label>Category:</label>
          <select
            className="form-control"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Subcategory:</label>
          <input
            type="text"
            className="form-control"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            list="subcategoryList" // Add list attribute for datalist
          />
          {/* Datalist for available subcategories */}
          <datalist id="subcategoryList">
            {subcategories.map((subcat) => (
              <option key={subcat} value={subcat} />
            ))}
          </datalist>
        </div>
        <div className="form-group">
          <label>Brand:</label>
          <input
            type="text"
            className="form-control"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            list="brandList" // Add list attribute for datalist
          />
          {/* Datalist for available brands */}
          <datalist id="brandList">
            {brands.map((brand) => (
              <option key={brand} value={brand} />
            ))}
          </datalist>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddNewAddprods;
