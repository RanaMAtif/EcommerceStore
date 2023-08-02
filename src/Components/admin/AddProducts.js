import React, { useState, useEffect } from "react";
import { fs, storage } from "../../Config/Config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getDownloadURL } from "firebase/storage";
import { ref, uploadBytesResumable } from "firebase/storage";

export const AddProducts = () => {
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
    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(fs, "Categories");
        const querySnapshot = await getDocs(categoriesRef);

        const categoryList = querySnapshot.docs.map((doc) => doc.id);
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories for the selected category from Firestore
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        if (category) {
          const docRef = doc(fs, "Categories", category);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const subcategoryList = Object.keys(docSnap.data());
            setSubcategories(subcategoryList);
          } else {
            console.log("No subcategories found for this category.");
            setSubcategories([]);
          }
        } else {
          setSubcategories([]);
        }
      } catch (error) {
        console.error("Error fetching subcategories: ", error);
      }
    };

    fetchSubcategories();
  }, [category]);

  // Fetch brands for the selected subcategory from Firestore
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        if (category && subcategory) {
          const docRef = doc(fs, "Categories", category);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const brandsList = docSnap.data()[subcategory] || [];
            setBrands(brandsList);
          } else {
            console.log("No brands found for this subcategory.");
            setBrands([]);
          }
        } else {
          setBrands([]);
        }
      } catch (error) {
        console.error("Error fetching brands: ", error);
      }
    };

    fetchBrands();
  }, [category, subcategory]);
  

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
        setImageError("Please select a valid image file type (png, jpg, or jpeg)");
        // Clear the image preview when there is an error
        setImagePreview(null);
      }
    } else {
      console.log("Please select your file");
      // Clear the image preview when no file is selected
      setImagePreview(null);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (category && subcategory && brand && title && description && price && image) {
      try {
        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `product-images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
          },
          (error) => setUploadError(error.message),
          async () => {
            try {
              // Get the download URL of the uploaded image
              const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

              // After adding the product image, store product data in Firestore
              const productData = {
                category,
                subcategory,
                brand,
                title,
                description,
                price,
                imageUrl, // Add the download URL of the image
              };

              // Add the product data to Firestore
              const productsRef = collection(fs, "Products"); // Change "Products" to your desired collection name
              await setDoc(doc(productsRef), productData);

              // Update the subcategory and brand in the Categories collection
              const docRef = doc(fs, "Categories", category);
              const dataToUpdate = {};

              if (!subcategories.includes(subcategory)) {
                dataToUpdate[subcategory] = [brand];
              } else {
                dataToUpdate[subcategory] = arrayUnion(brand);
              }

              await updateDoc(docRef, dataToUpdate);

              // Product added successfully, update the state and clear form fields
              setSuccessMsg("Product added successfully");
              setTitle("");
              setDescription("");
              setPrice("");
              setImage(null);
              setImagePreview(null);
              setImageError("");
              setCategory("");
              setSubcategory("");
              setBrand("");
              setTimeout(() => {
                setSuccessMsg("");
              }, 3000);
            } catch (error) {
              setUploadError(error.message);
            }
          }
        );
      } catch (error) {
        console.error("Error uploading image: ", error);
        setUploadError(error.message);
      }
    } else {
      console.log("Please fill in all product details.");
    }
  };

  return (
    <div className="container">
      <h1>Add Products</h1>
      <hr />
      {successMsg && (
        <>
          <div className="success-msg">{successMsg}</div>
          <br />
        </>
      )}
      <form autoComplete="off" className="form-group" onSubmit={handleAddProduct}>
        <label>Product Title</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        {/* Rest of the form fields for product details */}
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
        <br />
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
          <img src={imagePreview} alt="Product" style={{ width: "200px" }} />
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
