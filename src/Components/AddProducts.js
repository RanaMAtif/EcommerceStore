import React, { useState } from "react";
import { storage, fs } from "../Config/Config";
export const subcategoryOptions = {
  Men: ["T-shirts", "Trousers", "Shoes", "Watches"],
  Women: ["Dresses", "Tops", "Shoes", "Jewelry"],
  Fitness: ["Yoga mats", "Dumbbells", "Resistance bands", "Barbells"],
  Sports: ["Basketball", "Football", "cricket ball"],
  Electronics: ["Laptops", "Smartphones", "Headphones", "Refrigerator"],
  Tools: ["Drills", "Screwdrivers", "Toolboxes", "Hammer"],
  Groceries: ["Fruits", "Vegetables", "Snacks"],
};
export const brandOptions = {
  Men: ["Nike", "Adidas", "Puma", "Polo", "Levis"],
  Women: ["Nike", "Adidas", "Puma"],
  Fitness: ["Under Armour", "Reebok", "Nike"],
  Sports: ["Nike", "Adidas", "Puma"],
  Electronics: ["Apple", "Samsung", "Sony"],
  Tools: ["Bosch", "Makita", "DeWalt"],
  Groceries: ["Nestle", "Kellogg's", "PepsiCo"],
};

export const AddProducts = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [image, setImage] = useState(null);

  const [imageError, setImageError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadError, setUploadError] = useState("");

  const types = ["image/jpg", "image/jpeg", "image/png", "image/PNG"];

  const handleProductImg = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && types.includes(selectedFile.type)) {
        setImage(selectedFile);
        setImageError("");
      } else {
        setImage(null);
        setImageError("please select a valid image file type (png or jpg)");
      }
    } else {
      console.log("please select your file");
    }
  };

  const handleAddProducts = (e) => {
    e.preventDefault();

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
                setTitle("");
                setDescription("");
                setCategory("");
                setSubcategory("");
                setBrand("");
                setPrice("");
                document.getElementById("file").value = "";
                setImageError("");
                setUploadError("");
                setTimeout(() => {
                  setSuccessMsg("");
                }, 3000);
              })
              .catch((error) => setUploadError(error.message));
          });
      }
    );
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
        <label>Product Category</label>
        <select
          className="form-control"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Product Category</option>
          <option>Men</option>
          <option>Women</option>
          <option>Fitness</option>
          <option>Sports</option>
          <option>Electronics</option>
          <option>Tools</option>
          <option>Groceries</option>
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
          {subcategoryOptions[category]?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <br />
        <label>Product Brand</label>
        <select
          className="form-control"
          required
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">Select Product Brand</option>
          {brandOptions[category]?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <br />
        <label>Upload Product Image</label>
        <input
          type="file"
          id="file"
          className="form-control"
          required
          onChange={handleProductImg}
        />

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
