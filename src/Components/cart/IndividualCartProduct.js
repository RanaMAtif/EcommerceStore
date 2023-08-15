import React from "react";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { minus } from "react-icons-kit/feather/minus";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAuth } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { fs } from "../../Config/Config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const IndividualCartProduct = ({
  cartProduct,
  cartProductIncrease,
  cartProductDecrease,
  onProductDeleteSuccess,
}) => {
  const handleCartProductIncrease = () => {
    cartProductIncrease(cartProduct);
  };

  const handleCartProductDecrease = () => {
    cartProductDecrease(cartProduct);
  };

  const handleCartProductDelete = async (productId) => {
    const auth = getAuth();
    try {
      if (auth.currentUser) {
        const cartProductRef = doc(
          fs,
          `Carts/${auth.currentUser.uid}/products/${productId}`
        );

        await deleteDoc(cartProductRef);
        onProductDeleteSuccess(productId);
        toast.success("Cart product deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting from cart: ", error);
    }
  };

  return (
    <div
      className="product"
      style={{
        display: "flex",
        marginLeft: "auto",
        marginRight: "auto",
        justifyContent: "auto",
        alignItems: "center",
      }}
    >
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
          onClick={() => handleCartProductDelete(cartProduct.ID)}
        />
      </div>
    </div>
  );
};
