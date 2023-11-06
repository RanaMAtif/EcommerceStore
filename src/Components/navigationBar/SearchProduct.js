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
    backgroundCcolor: "white",
    // zIndex: "99",
    padding: "30px",

    boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 10px",
    position: "absolute",
    width: "100%",
    background: "white",
  };

  const searchResultItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    fontWeight: "bold",
    backgroundCcolor: "white",
    textDecoration: "none",
    // zIndex: "20",
  };

  return (
    <div
      className="container"
      style={{
        padding: "0",
        position: "fixed",
        width: "45%",
        top: "90px",
      }}
    >
      <div>
        <input
          type="text"
          className="form-control"
          placeholder="Search Products"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>
      <div>
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
                      <div>{product.title}</div>
                      <div>${product.price}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
