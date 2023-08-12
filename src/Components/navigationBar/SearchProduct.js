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

  return (
    <div className="container">
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search Products"
          value={searchTerm}
          onChange={handleSearchTermChange}
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
              <Link to={`/product/${product.id}`} key={product.id} className="product">
                <div className="product-img">
                  <img src={product.imageUrl} alt="product-img" />
                </div>
                <div className="product-text title">{product.title}</div>
                <div className="product-text description">
                  {product.description}
                </div>
                <div style={{ fontWeight: "bold" }}>{product.brand}</div>
                <div className="product-text price">$ {product.price}</div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};
