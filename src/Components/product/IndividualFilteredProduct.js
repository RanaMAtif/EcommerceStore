import React from "react";
export const IndividualFilteredProduct = ({
  individualFilteredProduct,
  addToCart,
  onClickProductDetails,
}) => {

  return (
    <div className="product">
      <div className="product-img">
        <img
          src={individualFilteredProduct.imageUrl}
          alt="product-img"
          onClick={() => onClickProductDetails(individualFilteredProduct.ID)}
        style={{ cursor: "pointer" }}
        />
      </div>
      <div
        className="product-text title"
        onClick={() => onClickProductDetails(individualFilteredProduct.ID)}
        style={{ cursor: "pointer" }}
      >
        {individualFilteredProduct.title}
      </div>
      <div className="product-text description" onClick={() => onClickProductDetails(individualFilteredProduct.ID)}
        style={{ cursor: "pointer" }}>
        {individualFilteredProduct.description}
      </div>
      <div style={{ fontWeight: "bold" }} >
        {individualFilteredProduct.brand}
      </div>
      <div className="product-text price">
        $ {individualFilteredProduct.price}

      </div>
    </div>
  );
};
