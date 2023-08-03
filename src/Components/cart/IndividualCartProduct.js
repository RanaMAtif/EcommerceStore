import React from "react";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { minus } from "react-icons-kit/feather/minus";
import { fs } from "../../Config/Config";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const IndividualCartProduct = ({
  cartProduct,
  cartProductIncrease,
  cartProductDecrease,
  onProductDeleteSuccess, // Add the callback prop here
}) => {
  const handleCartProductIncrease = () => {
    cartProductIncrease(cartProduct);
  };

  const handleCartProductDecrease = () => {
    cartProductDecrease(cartProduct);
  };

  const handleCartProductDelete = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const cartRef = doc(fs, `Cart/${user.uid}`);
          const cartDoc = await getDoc(cartRef);

          if (cartDoc.exists()) {
            // Remove the cartProduct from the Items array
            const newItems = cartDoc
              .data()
              .Items.filter((item) => item.ID !== cartProduct.ID);

            // Update the cart document with the new Items array
            await setDoc(cartRef, {
              Items: newItems.length > 0 ? newItems : {}, // Update to an empty object if no items left
            });

            console.log("Successfully deleted from cart");
          }
        } catch (error) {
          console.error("Error deleting from cart: ", error);
        }
      }
    });
  };  
  return (
    <div className="product">
      <div className="product-img">
        <img src={cartProduct.imageUrl} alt="product-img" />
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
