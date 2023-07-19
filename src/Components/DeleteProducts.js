import React, { useState, useEffect } from "react";
import { fs } from "../Config/Config";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const DeleteProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from Firestore whenever the searchTerm changes
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = () => {
    // Fetch all products from Firestore collection "Products"
    fs.collection("Products")
      .get()
      .then((snapshot) => {
        const productsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      })
      .catch((error) => console.error("Error fetching products: ", error));
  };

  const handleDelete = (productId) => {
    // Delete the product with the given ID from Firestore
    fs.collection("Products")
      .doc(productId)
      .delete()
      .then(() => {
        toast.success("Product Deleted Successfully");
        // After successful deletion, update the products list
        fetchProducts();
      })
      .catch((error) => console.error("Error deleting product: ", error));
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100vh",
        
      overflowY: "auto",
      }}
    >
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Delete Products</h1>
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
        // Only render the products if searchTerm is not empty
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
                  <img src={product.url} alt="product-img" />
                </div>
                <div className="product-text title">{product.title}</div>
                <div className="product-text description">
                  {product.description}
                </div>
                <div style={{ fontWeight: "bold" }}>{product.brand}</div>
                <div className="product-text price">$ {product.price}</div>
                <Tooltip title="Delete Image">
                  <IconButton
                    variant="contained"
                    onClick={() => handleDelete(product.id)} // Pass productId to the handleDelete function
                    aria-label="delete" // Add aria-label for accessibility
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
