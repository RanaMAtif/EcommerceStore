import React, { useState, useEffect } from "react";
import { fs, storage } from "../Config/Config";
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

  const handleDelete = (productId, imageUrl) => {
    // Delete the product image from Firebase Storage
    if (imageUrl) {
      const storageRef = storage.refFromURL(imageUrl); // Corrected line
      storageRef
        .delete()
        .then(() => {
          console.log("Product image deleted successfully from Firebase Storage");
        })
        .catch((error) => {
          console.error("Error deleting product image: ", error);
        });
    } else {
      console.log("Image URL is empty, not entering if block");
    }
  
    // Delete the product with the given ID from Firestore
    fs.collection("Products")
      .doc(productId)
      .delete()
      .then(() => {
        toast.success("Product Deleted Successfully");
        // After successful deletion, update the products list
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error deleting product: ", error);
      });
  };
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="container"
      
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
                    onClick={() => handleDelete(product.id, product.url)}
                    aria-label="delete"
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
