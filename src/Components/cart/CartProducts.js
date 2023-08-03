import React from "react";
import { IndividualCartProduct } from "./IndividualCartProduct";

export const CartProducts = ({
  cartProducts,
  cartProductIncrease,
  cartProductDecrease,
  removeProduct, // Use the prop name `removeProduct` instead of `onProductDeleteSuccess`
}) => {
  return cartProducts.map((cartProduct) => (
    <IndividualCartProduct
      key={cartProduct.ID}
      cartProduct={cartProduct}
      cartProductIncrease={cartProductIncrease}
      cartProductDecrease={cartProductDecrease}
      onProductDeleteSuccess={() => removeProduct(cartProduct.ID)} // Use the `removeProduct` callback here
    />
  ));
};
