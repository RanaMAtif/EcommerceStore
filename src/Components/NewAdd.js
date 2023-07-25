import React, { useState, useEffect } from "react";
import { storage, fs } from "../Config/Config";
export const NewAdd = () => {
  // State variables for data fetched from Firestore
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(""); // Add this line
  const [subcategory, setSubcategory] = useState(""); // Add this line
  const [brand, setBrand] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadError, setUploadError] = useState("");
  const handleAddProducts = (e) => {
    e.preventDefault();

    // First, handle the image upload to Firebase Storage
    const uploadTask = storage.ref(`product-images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress if needed
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      },
      (error) => {
        setUploadError(error.message);
      },
      () => {
        // Once the image is uploaded, get its download URL
        storage
          .ref("product-images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // Now, add the product data along with the image URL to Firestore
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
                setSuccessMsg("Product added successfully");
                // Clear form fields and states after successful addition
                setTitle("");
                setDescription("");
                setCategory("");
                setSubcategory("");
                setBrand("");
                setPrice("");
                setImage(null);
                setImagePreview(null);
                setImageError("");
                setUploadError("");
                document.getElementById("file").value = "";
                setTimeout(() => {
                  setSuccessMsg("");
                }, 3000);
              })
              .catch((error) => {
                setUploadError(error.message);
              });
          });
      }
    );
  };
  const handleProductImg = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && types.includes(selectedFile.type)) {
        setImage(selectedFile);
        setImageError("");
        // Create an image preview URL and set it in the state
        setImagePreview(URL.createObjectURL(selectedFile));
      } else {
        setImage(null);
        setImageError("Please select a valid image file type (png or jpg)");
        // Clear the image preview when there is an error
        setImagePreview(null);
      }
    } else {
      console.log("Please select your file");
      // Clear the image preview when no file is selected
      setImagePreview(null);
    }
  };
  // Fetch categories from Firestore when the component mounts
  useEffect(() => {
    fs.collection("Categories")
      .get()
      .then((querySnapshot) => {
        const categoryList = querySnapshot.docs.map((doc) => doc.id);
        console.log("Categories: ", categoryList);
        setCategories(categoryList);
      })
      .catch((error) => {
        console.error("Error fetching categories: ", error);
      });
  }, []);

  // Fetch subcategories for the selected category from Firestore
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSubcategory("");
    setSubcategories([]);
  
    if (selectedCategory) {
      fs.collection("Categories")
        .doc(selectedCategory)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const categoryData = doc.data();
            const subcategoryList = Object.keys(categoryData).filter(
              (key) => key !== "id" // Exclude the 'id' field from subcategories
            );
            setSubcategories(subcategoryList);
          } else {
            console.log("No subcategories found for this category.");
            setSubcategories([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching subcategories: ", error);
        });
    }
  };

  return (
    <div className="container">
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
        onSubmit={handleAddProducts}
      >
        <label>Product Title</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <br />
        <label>Product Description</label>
        <input
          type="text"
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
        <select
          className="form-control"
          required
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">Select Product Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <br />
        <label>Product Subcategory</label>
        <select
          className="form-control"
          required
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
        >
          <option value="">Select Product Subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </select>
        <br />
        {/* <label>Product Brand</label>
        <select
          className="form-control"
          required
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">Select Product Brand</option>
          {brandOptions[category]?.[subcategory]?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <br /> */}
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
