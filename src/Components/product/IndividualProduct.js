import React from "react";
import { Button } from "@mui/material";
export const IndividualProduct = ({ individualProduct, addToCart }) => {
  const handleAddToCart = () => {
    addToCart(individualProduct);
  };
  return (
    <div className="product">
      <div className="product-img">
        <img src={individualProduct.url} alt="product-img" />
      </div>
      <div className="product-text title">{individualProduct.title}</div>
      <div className="product-text description">
        {individualProduct.description}
      </div>
      <div style={{ fontWeight: "bold" }}>{individualProduct.brand}</div>
      <div className="product-text price">$ {individualProduct.price}</div>
      <div className="btn btn-danger btn-md cart-btn">
        <Button
          onClick={handleAddToCart}
          style={{
            color: "black",
            background: "#FFD300",
            border: "1px solid #FFD300",
            marginleft: "80px",
          }}
        >
          ADD TO CART
        </Button>
      </div>
    </div>
  );
};
