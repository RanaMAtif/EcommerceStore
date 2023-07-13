import React from "react";
import { Button } from "@mui/material";
export const IndividualFilteredProduct = ({
  individualFilteredProduct,
  addToCart,
}) => {
  const handleAddToCart = () => {
    addToCart(individualFilteredProduct);
  };

  return (
    <div className="product">
      <div className="product-img">
        <img src={individualFilteredProduct.url} alt="product-img" />
      </div>
      <div className="product-text title">
        {individualFilteredProduct.title}
      </div>
      <div className="product-text description">
        {individualFilteredProduct.description}
      </div>
      <div style={{ fontWeight: "bold" }}>
        {individualFilteredProduct.brand}
      </div>
      <div className="product-text price">
        $ {individualFilteredProduct.price}
      </div>
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
