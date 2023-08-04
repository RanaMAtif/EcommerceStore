import React from "react";
import { IndividualCartProduct } from "./IndividualCartProduct";

export const CartProducts = ({
  cartProducts,
  cartProductIncrease,
  cartProductDecrease,
  onProductDeleteSuccess,
}) => {
  return cartProducts.map((cartProduct) => (
    <IndividualCartProduct
      key={cartProduct.ID}
      cartProduct={cartProduct}
      cartProductIncrease={() => cartProductIncrease(cartProduct)}
      cartProductDecrease={() => cartProductDecrease(cartProduct)}
      onProductDeleteSuccess={() => onProductDeleteSuccess(cartProduct.ID)}
    />
  ));
};