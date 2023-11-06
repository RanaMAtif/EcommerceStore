import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const productContainerStyle = {
  width: "150px",
  height: "250px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "transform 0.3s, box-shadow 0.3s",
  cursor: "pointer",
};

const productImageStyle = {
  width: "100px",
  height: "100px",
  objectFit: "cover",
  marginBottom: "10px",
};

export default function ProductOfMonth() {
  const pom = useSelector((state) => state.pom);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const handleProductHover = (productIndex) => {
    setHoveredProduct(productIndex);
  };

  const handleProductLeave = () => {
    setHoveredProduct(null);
  };

  const products = pom.pomProducts.map((product, index) => (
    <Link
      key={`${product.id}_${index}`}
      to={`/product/${product.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          ...productContainerStyle,
          transform: hoveredProduct === index ? "scale(1.05)" : "scale(1)",
          boxShadow:
            hoveredProduct === index
              ? "0 4px 12px rgba(0, 0, 0, 0.2)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={() => handleProductHover(index)}
        onMouseLeave={handleProductLeave}
      >
        <img src={product.imageUrl} alt="product" style={productImageStyle} />
        <p
          style={{
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: "center",
            margin: "0",
          }}
        >
          {product.title}
        </p>
        <p style={{ color: "#888", textAlign: "center" }}>{product.brand}</p>
        <p style={{ color: "#ff0707", textAlign: "center" }}>
          ${product.price}
        </p>
      </div>
    </Link>
  ));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Products of the Month
      </h2>
      <div style={{ display: "flex", gap: "20px" }}>{products}</div>
    </div>
  );
}
