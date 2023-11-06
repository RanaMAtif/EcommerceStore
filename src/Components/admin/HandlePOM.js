import React, { useState, useEffect } from "react";
import { fs } from "../../Config/Config";
import {
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "20px",
};

const leftSectionStyle = {
  flex: 1,
  marginRight: "20px",
};

const rightSectionStyle = {
  flex: 1,
  marginLeft: "20px",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "20px",
};

const searchInputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const productContainerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
};

const productImageStyle = {
  width: "100px",
  height: "100px",
  marginRight: "10px",
};

const productInfoStyle = {
  flex: 1,
};

const saveButtonStyle = {
  background: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const saveButtonHoverStyle = {
  background: "#45a049",
};

export default function HandlePOM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchInitialPOM();
  }, []);

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

  const fetchInitialPOM = async () => {
    try {
      const POMCollectionRef = collection(fs, "POM");
      const POMQuerySnapshot = await getDocs(POMCollectionRef);
      const initialPOMProducts = POMQuerySnapshot.docs.map(
        (doc) => doc.data().productId
      );
      setSelectedProducts(initialPOMProducts);
    } catch (error) {
      console.error("Error fetching initial POM products: ", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToPOM = (productId) => {
    if (selectedProducts.length < 4 && !selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      toast.error("You can only add up to 4 products as Product of the Month.");
    }
  };

  const handleRemoveFromPOM = (productId) => {
    setSelectedProducts(selectedProducts.filter((id) => id !== productId));
  };

  const handleSavePOM = async () => {
    try {
      const POMCollectionRef = collection(fs, "POM");

      // Delete existing documents in the POM collection
      const existingPOMQuerySnapshot = await getDocs(POMCollectionRef);
      await Promise.all(
        existingPOMQuerySnapshot.docs.map(async (docSnapshot) => {
          await deleteDoc(doc(POMCollectionRef, docSnapshot.id));
        })
      );

      // Add selected products as new documents to the POM collection
      await Promise.all(
        selectedProducts.map(async (productId) => {
          const pomDocData = { productId };
          await addDoc(POMCollectionRef, pomDocData);
        })
      );

      toast.success("Products added to Product of the Month.");
    } catch (error) {
      console.error("Error adding products to POM: ", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <div style={leftSectionStyle}>
        <h2 style={titleStyle}>Products of the Month</h2>
        {selectedProducts.length > 0 ? (
          selectedProducts.map((productId) => {
            const product = products.find((p) => p.id === productId);
            return (
              <div key={productId} style={productContainerStyle}>
                <div style={productImageStyle}>
                  <img
                    src={product.imageUrl}
                    alt="product-img"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={productInfoStyle}>
                  <div>{product.title}</div>
                  <Tooltip title="Remove from POM">
                    <IconButton
                      aria-label="remove-from-pom"
                      onClick={() => handleRemoveFromPOM(productId)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            );
          })
        ) : (
          <p>No products are currently in the Products of the Month section.</p>
        )}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={handleSavePOM}
            style={saveButtonStyle}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = saveButtonHoverStyle.background)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = saveButtonStyle.background)
            }
          >
            Save
          </button>
        </div>
      </div>

      <div style={rightSectionStyle}>
        <div style={titleStyle}>
          <h1>Products of the Month Settings</h1>
          <hr />
        </div>
        <div>
          <input
            type="text"
            style={searchInputStyle}
            placeholder="Search by product title"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {filteredProducts.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            {filteredProducts.map((product) => (
              <div key={product.id} style={productContainerStyle}>
                <div style={productImageStyle}>
                  <img
                    src={product.imageUrl}
                    alt="product-img"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={productInfoStyle}>
                  <div>{product.title}</div>
                  <div>{product.description}</div>
                  <div style={{ fontWeight: "bold" }}>{product.brand}</div>
                  <div>$ {product.price}</div>
                  {selectedProducts.includes(product.id) ? (
                    <div>
                      <span style={{ color: "#4caf50", fontWeight: "bold" }}>
                        Product of the Month
                      </span>{" "}
                      <IconButton
                        aria-label="remove-from-pom"
                        onClick={() => handleRemoveFromPOM(product.id)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </div>
                  ) : (
                    <Tooltip title="Add to POM">
                      <IconButton
                        variant="contained"
                        onClick={() => handleAddToPOM(product.id)}
                        aria-label="add-to-pom"
                      >
                        <AddCircleIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
