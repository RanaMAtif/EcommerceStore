import React, { useState, useEffect } from "react";
import { fs } from "../../Config/Config"; // Import your Firestore instance
import { getDocs, doc, collection, setDoc } from "firebase/firestore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HandlePOM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      const productsSnapshot = await getDocs(collection(fs, "Products"));
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const handleAddToPOM = async (productId) => {
    try {
      await setDoc(doc(fs, "POM", productId), { productId });
      toast.success("Product added to Product of the Month");
    } catch (error) {
      console.error("Error adding product to POM: ", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Add Product of the Month</h1>
        <hr />
        <input
          type="text"
          className="form-control"
          placeholder="Search by product title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchTerm.trim() !== "" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          {filteredProducts.length === 0 ? (
            <div>No products found.</div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product">
                <div className="product-img">
                  <img src={product.imageUrl} alt="product-img" />
                </div>
                <div className="product-text title">{product.title}</div>
                <div className="product-text description">
                  {product.description}
                </div>
                <div style={{ fontWeight: "bold" }}>{product.brand}</div>
                <div className="product-text price">$ {product.price}</div>
                <Tooltip title="Add to POM">
                  <IconButton
                    variant="contained"
                    onClick={() => handleAddToPOM(product.id)}
                    aria-label="add-to-pom"
                  >
                    <AddCircleIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
