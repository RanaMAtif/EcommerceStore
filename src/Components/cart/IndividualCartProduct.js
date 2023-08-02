import React from "react";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { minus } from "react-icons-kit/feather/minus";
import { fs } from "../../Config/Config";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";

export const IndividualCartProduct = ({
  cartProduct,
  cartProductIncrease,
  cartProductDecrease,
}) => {
  const handleCartProductIncrease = () => {
    cartProductIncrease(cartProduct);
  };

  const handleCartProductDecrease = () => {
    cartProductDecrease(cartProduct);
  };

  const handleCartProductDelete = (cartProduct) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const cartRef = doc(fs, "Cart", user.uid, "Items", cartProduct.ID);
        deleteDoc(cartRef)
          .then(() => {
            console.log("Successfully deleted from cart");
          })
          .catch((error) => {
            console.error("Error deleting from cart: ", error);
          });
      }
    });
  };

  return (
    <div className="product">
      <div className="product-img">
        <img src={cartProduct.url} alt="product-img" />
      </div>
      <div className="product-text title">{cartProduct.title}</div>
      <div className="product-text description">{cartProduct.description}</div>
      <div className="product-text price">$ {cartProduct.price}</div>
      <span>Quantity</span>
      <div className="product-text quantity-box">
        <div className="action-btns minus" onClick={handleCartProductDecrease}>
          <Icon icon={minus} size={20} />
        </div>
        <div>{cartProduct.qty}</div>
        <div className="action-btns plus" onClick={handleCartProductIncrease}>
          <Icon icon={plus} size={20} />
        </div>
      </div>
      <div className="product-text cart-price">
        $ {cartProduct.TotalProductPrice}
      </div>
      <div style={{ cursor: "pointer" }}>
        <DeleteIcon
          style={{ color: "red", fontSize: "32px" }}
          onClick={handleCartProductDelete}
        />
      </div>
    </div>
  );
};
