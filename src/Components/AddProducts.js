import React, { useState } from "react";
import { storage, fs } from "../Config/Config";
export const subcategoryOptions = {
  Men: ["T_shirts", "Trousers", "Shoes", "Watches", "Hats", "Socks"],
  Women: ["Dresses", "Tops", "Shoes", "Jewelry", "Handbags", "Scarves"],
  Fitness: [
    "Yoga mats",
    "Dumbbells",
    "Resistance bands",
    "Barbells",
    "Treadmills",
    "Exercise bikes",
  ],
  Sports: [
    "Basketball",
    "Football",
    "Cricket ball",
    "Tennis racket",
    "Golf clubs",
  ],
  Electronics: [
    "Laptops",
    "Smartphones",
    "Headphones",
    "Refrigerator",
    "Televisions",
    "Cameras",
    "Airconditioners",
  ],
  Tools: [
    "Drills",
    "Screwdrivers",
    "Toolboxes",
    "Hammer",
    "Wrenches",
    "Measuring tape",
  ],
  Groceries: [
    "Fruits",
    "Vegetables",
    "Snacks",
    "Dairy products",
    "Canned goods",
    "Bakery items",
  ],
};

export const brandOptions = {
  Men: {
    T_shirts: ["Nike", "Adidas", "Puma", "Polo", "Levis"],
    Trousers: ["Nike", "Adidas", "Puma", "Levis"],
    Shoes: ["Nike", "Adidas", "Puma"],
    Watches: ["Rolex", "Casio", "Fossil", "Timex"],
    Hats: ["New Era", "Adidas", "Under Armour", "Puma"],
    Socks: ["Nike", "Adidas", "Puma"],
  },
  Women: {
    Dresses: ["Zara", "H&M", "Forever 21", "Mango"],
    Tops: ["Zara", "H&M", "Forever 21", "Mango"],
    Shoes: ["Nike", "Adidas", "Puma"],
    Jewelry: ["Pandora", "Swarovski", "Tiffany & Co", "Kate Spade"],
    Handbags: ["Michael Kors", "Coach", "Kate Spade"],
    Scarves: ["Hermes", "Burberry", "Gucci"],
  },
  Fitness: {
    Yogamats: ["Liforme", "Manduka", "Jade Yoga"],
    Dumbbells: ["Bowflex", "PowerBlock", "CAP Barbell"],
    Resistance_bands: ["Fit Simplify", "TheraBand", "WODFitters"],
    Barbells: ["Rogue Fitness", "CAP Barbell", "XMark Fitness"],
    Treadmills: ["NordicTrack", "ProForm", "Sole Fitness"],
    Exercise_bikes: ["Peloton", "Schwinn", "Nautilus"],
  },
  Sports: {
    Basketball: ["Nike", "Adidas", "Spalding"],
    Football: ["Nike", "Adidas", "Wilson"],
    Cricketball: ["Kookaburra", "Duke", "SG"],
    Tennisracket: ["Wilson", "Babolat", "Head"],
    Golfclubs: ["Callaway", "TaylorMade", "Titleist"],
  },
  Electronics: {
    Laptops: ["Apple", "Dell", "HP", "Lenovo"],
    Smartphones: ["Apple", "Samsung", "Google", "OnePlus"],
    Headphones: ["Sony", "Bose", "Sennheiser", "JBL"],
    Refrigerator: ["LG", "Samsung", "Whirlpool"],
    Televisions: ["Samsung", "LG", "Sony"],
    Cameras: ["Canon", "Nikon", "Sony"],
    Airconditioners: ["Daikin", "Carrier", "Mitsubishi"],
  },
  Tools: {
    Drills: ["Bosch", "DeWalt", "Makita"],
    Screwdrivers: ["Craftsman", "Klein Tools", "Wera"],
    Toolboxes: ["Stanley", "Husky", "Craftsman"],
    Hammer: ["Estwing", "Stanley", "Vaughan"],
    Wrenches: ["Craftsman", "Channellock", "Snap-on"],
    Measuringtape: ["Stanley", "Komelon", "Lufkin"],
  },
  Groceries: {
    Fruits: ["Apple", "Banana", "Orange", "Grapes"],
    Vegetables: ["Carrot", "Broccoli", "Tomato", "Spinach"],
    Snacks: ["Chips", "Cookies", "Popcorn", "Pretzels"],
    Dairyproducts: ["Milk", "Cheese", "Yogurt", "Butter"],
    Cannedgoods: ["Soup", "Beans", "Tomatoes", "Tuna"],
    Bakeryitems: ["Bread", "Bagels", "Croissants", "Muffins"],
  },
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
        setImageError("Please select a valid image file type (png or jpg)");
      }
    } else {
      console.log("Please select your file");
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

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSubcategory("");
    setBrand("");
  };

  const handleSubcategoryChange = (e) => {
    const selectedSubcategory = e.target.value;
    setSubcategory(selectedSubcategory);
    setBrand("");
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
          onChange={handleCategoryChange}
        >
          <option value="">Select Product Category</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Fitness">Fitness</option>
          <option value="Sports">Sports</option>
          <option value="Electronics">Electronics</option>
          <option value="Tools">Tools</option>
          <option value="Groceries">Groceries</option>
        </select>
        <br />
        <label>Product Subcategory</label>
        <select
          className="form-control"
          required
          value={subcategory}
          onChange={handleSubcategoryChange}
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
          {brandOptions[category]?.[subcategory]?.map((option) => (
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
