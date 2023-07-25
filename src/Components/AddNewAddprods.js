import React, { useState, useEffect } from "react";
import { fs, storage } from "../Config/Config";
import firebase from "firebase/app";
import "firebase/firestore";

const AddNewAddprods = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadError, setUploadError] = useState("");

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

      // Check if the selected category is already in the categories list
      if (!categories.includes(category)) {
        // If the category is not in the categories list, it's a new value
        // Add it to the categories list
        fs.collection("Categories")
          .doc(category)
          .set({ [subcategoryToAdd]: [brandToAdd] })
          .then(() => {
            console.log("Category added to Firestore successfully!");
            setCategories([...categories, category]);
            setSubcategories([...subcategories, subcategory]);
            setBrands([...brands, brand]);
          })
          .catch((error) => {
            console.error("Error adding category to Firestore: ", error);
          });
      } else {
        // Category already exists, update the subcategory and brand
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
            setSubcategories([...subcategories, subcategory]);
            setBrands([...brands, brand]);
          })
          .catch((error) => {
            console.error("Error adding data to Firestore: ", error);
          });
      }

      // Clear the form fields after successful update
      setCategory("");
      setSubcategory("");
      setBrand("");
    } else {
      console.log("Please enter values for all fields.");
    }
  };

  const handleProductImg = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && selectedFile.type.includes("image")) {
        setImage(selectedFile);
        setImageError("");
        // Create an image preview URL and set it in the state
        setImagePreview(URL.createObjectURL(selectedFile));
      } else {
        setImage(null);
        setImageError(
          "Please select a valid image file type (png, jpg, or jpeg)"
        );
        // Clear the image preview when there is an error
        setImagePreview(null);
      }
    } else {
      console.log("Please select your file");
      // Clear the image preview when no file is selected
      setImagePreview(null);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (
      category &&
      subcategory &&
      brand &&
      title &&
      description &&
      price &&
      image
    ) {
      const uploadTask = storage.ref(`product-images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => setUploadError(error.message),
        () => {
          storage
            .ref("product-images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              // Add the product data to the 'Products' collection
              fs.collection("Products")
                .add({
                  title,
                  description,
                  category,
                  subcategory,
                  brand,
                  price: Number(price),
                  url,
                })
                .then(() => {
                  // After adding the product, update the 'Categories' collection
                  const batch = fs.batch();
                  const categoryRef = fs.collection("Categories").doc(category);

                  // Check if the subcategory exists in the current category
                  if (!subcategories.includes(subcategory)) {
                    batch.update(categoryRef, { [subcategory]: [] });
                  }

                  // Check if the brand exists in the current subcategory
                  if (!brands.includes(brand)) {
                    batch.update(categoryRef, {
                      [subcategory]:
                        firebase.firestore.FieldValue.arrayUnion(brand),
                    });
                  }

                  // Commit the batch update
                  return batch.commit();
                })
                .then(() => {
                  setSuccessMsg("Product added successfully");
                  setTitle("");
                  setDescription("");
                  setPrice("");
                  setImage(null);
                  setImagePreview(null);
                  setCategory("");
                  setSubcategory("");
                  setBrand("");
                  setTimeout(() => {
                    setSuccessMsg("");
                  }, 3000);
                })
                .catch((error) => setUploadError(error.message));
            });
        }
      );
    } else {
      console.log("Please fill in all product details.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleAddData}>
        {/* The form fields for adding category, subcategory, and brand */}
      </form>
      <br />
      <br />
      <h1>Add Products</h1>
      <hr />
      {successMsg && (
        <>
          <div className="success-msg">{successMsg}</div>
          <br />
        </>
      )}
      <form
        autoComplete="off"
        className="form-group"
        onSubmit={handleAddProduct}
      >
        <label>Product Title</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        {/* Add other product details fields here */}
        <br />
        <label>Product Description</label>
        <textarea
          className="form-control"
          required
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <br />
        <label>Product Price</label>
        <input
          type="number"
          className="form-control"
          required
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        />
        <br />
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
        <br />
        <label>Subcategory:</label>
        <input
          type="text"
          className="form-control"
          required
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
        <br />
        <label>Brand:</label>
        <input
          type="text"
          className="form-control"
          required
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
        <br />
        <label>Upload Product Image</label>
        <input
          type="file"
          id="file"
          className="form-control"
          required
          onChange={handleProductImg}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Product Image"
            style={{ width: "200px" }}
          />
        )}
        {imageError && (
          <>
            <br />
            <div className="error-msg">{imageError}</div>
          </>
        )}
        <br />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-success btn-md">
            SUBMIT
          </button>
        </div>
      </form>
      {uploadError && (
        <>
          <br />
          <div className="error-msg">{uploadError}</div>
        </>
      )}
    </div>
  );
};

export default AddNewAddprods;
