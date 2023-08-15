import React, { useState, useEffect, useRef } from "react";
import { fs, auth } from "../../Config/Config";
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Navbar } from "../navigationBar/Navbar";
import { CartProducts } from "./CartProducts";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "./Modal";

toast.configure();

export const Cart = () => {
  // show modal state
  const [showModal, setShowModal] = useState(false);
  const isMounted = useRef(true);
  const [user, setUser] = useState(null);
  // trigger modal
  const triggerModal = () => {
    setShowModal(true);
  };

  // hide modal
  const hideModal = () => {
    setShowModal(false);
  };

  // state of cart products
  const [cartProducts, setCartProducts] = useState([]);
  // Calculate the total quantity of products in the cart
  const totalProductsInCart = cartProducts.reduce(
    (accumulator, cartProduct) => accumulator + cartProduct.qty,
    0
  );

  // getting cart products from firestore collection and updating the state
  // Loading state to indicate data fetching
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup when unmounting
  }, []);

  useEffect(() => {
    if (user) {
      console.log("user", user);
    const auth = getAuth();
    if (auth.currentUser) {
      const cartCollectionRef = collection(
        fs,
        "Carts",
        auth.currentUser.uid,
        "products"
      );
      const unsubscribe = onSnapshot(
        cartCollectionRef,
        (querySnapshot) => {
          const newCartProduct = querySnapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
          setLoading(false); // Set loading to false when data is fetched
        },
        (error) => {
          console.error("Error fetching cart products:", error);
          setLoading(false); // Set loading to false in case of error
        }
      );

      return () => {
        unsubscribe();
        isMounted.current = false;
      };
    } else {
      setLoading(false); // Set loading to false if user is not authenticated
    }}
  }, [user]);

  // Calculate the total quantity and total price of products in the cart
  const totalQuantity = cartProducts.reduce(
    (accumulator, cartProduct) => accumulator + cartProduct.qty,
    0
  );

  const totalPrice = cartProducts.reduce(
    (accumulator, cartProduct) => accumulator + cartProduct.TotalProductPrice,
    0
  );

  // cart product increase function
  const cartProductIncrease = (cartProduct) => {
    // console.log(cartProduct);
    let Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.price;

    // initializing Firebase
    const auth = getAuth();

    // updating in database
    const user = auth.currentUser;
    if (user) {
      updateDoc(doc(fs, "Carts", user.uid, "products", cartProduct.ID), Product)
        .then(() => {
          console.log("increment added");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    } else {
      console.log("user is not logged in to increment");
    }
  };
  // cart product decrease functionality
  const cartProductDecrease = (cartProduct) => {
    // console.log(cartProduct);
    let Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.price;

      // initializing Firebase
      const auth = getAuth();

      // updating in database
      const user = auth.currentUser;
      if (user) {
        updateDoc(
          doc(fs, "Carts", user.uid, "products", cartProduct.ID),
          Product
        )
          .then(() => {
            console.log("decrement added");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      } else {
        console.log("user is not loggedin");
      }
    }
  };

  // charging payment
  const history = useHistory();
  const handleToken = async (token) => {
    const cart = { name: "All Products", totalPrice };
    try {
      const response = await axios.post("http://localhost:8080/checkout", {
        token,
        cart,
      });
      console.log(response);
      const { status } = response.data;
      console.log(status);
      if (status === "success") {
        history.push("/home");
        toast.success("Your order has been placed successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });

        // Delete the documents within the user's cart collection from Firestore
        if (auth.currentUser) {
          const cartCollectionRef = collection(
            fs,
            "Carts",
            auth.currentUser.uid,
            "products"
          );
          const cartSnapshot = await getDocs(cartCollectionRef);

          // Delete each document within the collection
          const deletePromises = cartSnapshot.docs.map(async (doc) => {
            await deleteDoc(doc.ref);
          });

          await Promise.all(deletePromises);
        }
      } else {
        alert("Something went wrong in checkout");
      }
    } catch (error) {
      console.error("Error processing payment: ", error);
    }
  };
  const handleProductDelete = async (productId) => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        // Reference to the cart document
        const cartRef = doc(fs, `Carts/${auth.currentUser.uid}`);

        // Reference to the specific product document within the cart
        const productRef = doc(cartRef, "products", productId);

        // Delete the product document
        await deleteDoc(productRef);
      }
    } catch (error) {
      console.error("Error deleting product from cart: ", error);
    }
  };
  return (
    <>
      <Navbar user={user} totalProductsInCart={totalProductsInCart} />
      <br />
      {loading ? (
        <div>Loading...</div>
      ) : cartProducts.length > 0 ? (
        <div className="container-fluid">
          <h1 style={{ display: "flex", justifyContent: "center" }}>Cart</h1>
          <div
            className="products-box cart"
            style={{
              width: "100%",
              marginLeft: "auto",
              marginRight: "auto",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CartProducts
              cartProducts={cartProducts}
              cartProductIncrease={cartProductIncrease}
              cartProductDecrease={cartProductDecrease}
              onProductDeleteSuccess={handleProductDelete}
            />
          </div>
          <div className="summary-box">
            <h5>Cart Summary</h5>
            <br />
            <div>
              Total No of Products: <span>{totalQuantity}</span>
            </div>
            <div>
              Total Price to Pay: <span>$ {totalPrice}</span>
            </div>
            <br />
            <StripeCheckout
              stripeKey="pk_test_51NRC5HB19CqeJrhWp5wt638E25qSNjaohB7TJVwURTWvoiz9cYBSOR37e5CsncI7TOVCeyIuJWS3JqtuXS0SbsxH00iAtYudOQ"
              token={handleToken}
              billingAddress
              shippingAddress
              name="All Products"
              amount={totalPrice * 100}
            ></StripeCheckout>
            <h6 className="text-center" style={{ marginTop: "7px" }}>
              OR
            </h6>
            <button
              className="btn btn-secondary btn-md"
              onClick={() => triggerModal()}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      ) : (
        <div className="container-fluid text-center">
          <h1>Cart</h1>
          <h3>No products in the cart.</h3>
        </div>
      )}

      {showModal === true && (
        <Modal
          TotalPrice={totalPrice}
          totalQty={totalQuantity}
          hideModal={hideModal}
        />
      )}
    </>
  );
};
