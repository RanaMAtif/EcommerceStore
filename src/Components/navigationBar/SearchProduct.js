import React, { useState, useEffect } from "react";
import { fs } from "../../Config/Config";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

export const SearchProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  // Fetch products from Firestore whenever the searchTerm changes
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

  // Function to handle the search term change
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchResultsStyle = {
    position: "absolute",
    top: "100px", // Adjust this value to match your search input height
    left: "50",
    width: "400px", // Equal to the input width
    backgroundColor: "white",
    zIndex: "9999",
    padding: "30px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
  };

  const searchResultItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    fontWeight: "bold",
    textDecoration: "none",
  };

  return (
    <div className="container">
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search Products"
          value={searchTerm}
          onChange={handleSearchTermChange}
          style={{ width: "400px" }}
        />
      </div>

      {searchTerm.trim() !== "" && (
        <div style={searchResultsStyle}>
          <div className="search-results-content">
            {filteredProducts.length === 0 ? (
              <div>No products found.</div>
            ) : (
              <div>
                {filteredProducts.map((product) => (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    style={searchResultItemStyle}
                  >
                    <div>{product.brand}</div>
                    <div>${product.price}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};