import React, { useState } from "react";
import { fs } from "../../Config/Config";
import {
  getDoc,
  getDocs,
  collection,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export const Modal = ({ TotalPrice, totalQty, hideModal }) => {
  const history = useHistory();

  // form states
  const [cell, setCell] = useState(null);
  const [residentialAddress, setResidentialAddress] = useState("");
  const [cartPrice] = useState(TotalPrice);
  const [cartQty] = useState(totalQty);

  // close modal
  const handleCloseModal = () => {
    hideModal();
  };

  // cash on delivery
  const handleCashOnDelivery = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const uid = auth.currentUser.uid;

    try {
      // Fetch user data from Firestore collection "users"
      const userDocRef = doc(fs, "users", uid);
      const userData = await getDoc(userDocRef);

      // Add buyer's personal info to Firestore collection "Buyer-Personal-Info"
      await setDoc(collection(fs, "Buyer-Personal-Info"), {
        Name: userData.data().FirstName,
        Email: userData.data().Email,
        CellNo: cell,
        ResidentialAddress: residentialAddress,
        CartPrice: cartPrice,
        CartQty: cartQty,
      });

      // Fetch cart data from Firestore collection "Cart {uid}"
      const cartRef = collection(fs, "Cart " + uid);
      const cartSnapshot = await getDocs(cartRef);

      // Move cart data to Firestore collection "Buyer-Cart {uid}"
      for (const snap of cartSnapshot.docs) {
        const data = snap.data();
        data.ID = snap.id;
        await setDoc(collection(fs, "Buyer-Cart " + uid), data);
        await deleteDoc(snap.ref);
      }

      // Hide modal and navigate to homepage
      hideModal();
      history.push("/");

      // Show success toast message
      toast.success("Your order has been placed successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error handling cash on delivery: ", error);
      // Show error toast message
      toast.error("Error placing your order. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }
  };

  return (
    <div className="shade-area">
      <div className="modal-container">
        <form className="form-group" onSubmit={handleCashOnDelivery}>
          <input
            type="number"
            className="form-control"
            placeholder="Cell No"
            required
            onChange={(e) => setCell(e.target.value)}
            value={cell}
          />
          <br></br>
          <input
            type="text"
            className="form-control"
            placeholder="Residential Address"
            required
            onChange={(e) => setResidentialAddress(e.target.value)}
            value={residentialAddress}
          />
          <br></br>
          <label>Total Quantity</label>
          <input
            type="text"
            className="form-control"
            readOnly
            required
            value={cartQty}
          />
          <br></br>
          <label>Total Price</label>
          <input
            type="text"
            className="form-control"
            readOnly
            required
            value={cartPrice}
          />
          <br></br>
          <button type="submit" className="btn btn-success btn-md">
            Submit
          </button>
        </form>
        <div className="delete-icon" onClick={handleCloseModal}>
          x
        </div>
      </div>
    </div>
  );
};
