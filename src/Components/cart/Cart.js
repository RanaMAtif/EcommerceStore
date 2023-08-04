import React, { useState, useEffect } from "react";
import { fs, auth } from "../../Config/Config";
import {
  collection,
  getDocs,
  getDoc,
  onSnapshot,
  doc,
  updateDoc,
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

  // trigger modal
  const triggerModal = () => {
    setShowModal(true);
  };

  // hide modal
  const hideModal = () => {
    setShowModal(false);
  };

  // getting current user function
  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          getDocs(collection(fs, "users"))
            .then((querySnapshot) => {
              const userData = querySnapshot.docs.find(
                (doc) => doc.id === user.uid
              );
              if (userData) {
                setUser(userData.data().FirstName);
              } else {
                setUser(null);
              }
            })
            .catch((error) => {
              console.error("Error fetching user data: ", error);
            });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }

  const user = GetCurrentUser();

  // state of cart products
  const [cartProducts, setCartProducts] = useState([]);
// Calculate the total quantity of products in the cart
  const totalProductsInCart = cartProducts.reduce(
    (accumulator, cartProduct) => accumulator + cartProduct.qty,
    0
  );

  // getting cart products from firestore collection and updating the state
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Fetching cart products for user:", user.uid);
  
        const cartCollectionRef = collection(fs, "Carts", user.uid,"products");
  
        const unsubscribe = onSnapshot(
          cartCollectionRef,
          (querySnapshot) => {
            console.log("Query snapshot:", querySnapshot.docs);
  
            const newCartProduct = querySnapshot.docs.map((doc) => ({
              ID: doc.id,
              ...doc.data(),
            }));
  
            console.log("Fetched cart products:", newCartProduct);
            setCartProducts(newCartProduct);
          },
          (error) => {
            console.error("Error fetching cart products:", error);
          }
        );
  
        return () => unsubscribe();
      } else {
        console.log("User is not signed in to retrieve cart");
      }
    });
  }, []);

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
    const updatedCartProducts = cartProducts.map((product) =>
      product.ID === cartProduct.ID
        ? {
            ...product,
            qty: product.qty + 1,
            TotalProductPrice: product.price * (product.qty + 1),
          }
        : product
    );

    // Update the cart data in Firestore
    if (auth.currentUser) {
      const cartRef = doc(
        fs,
        `Carts/${auth.currentUser.uid}/products/${cartProduct.ID}`
      );
      updateDoc(cartRef, { products: updatedCartProducts });
    }
  };

  // cart product decrease functionality
  const cartProductDecrease = (cartProduct) => {
    if (cartProduct.qty > 1) {
      const updatedCartProducts = cartProducts.map((product) =>
        product.ID === cartProduct.ID
          ? {
              ...product,
              qty: product.qty - 1,
              TotalProductPrice: product.price * (product.qty - 1),
            }
          : product
      );

      // Update the cart data in Firestore
      if (auth.currentUser) {
        const cartRef = doc(fs, "Cart", auth.currentUser.uid);
        updateDoc(cartRef, { products: updatedCartProducts });
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
        history.push("/");
        toast.success("Your order has been placed successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });

        const uid = auth.currentUser.uid;
        const cartsSnapshot = await getDocs(collection(fs, "Cart", uid));
        cartsSnapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      } else {
        alert("Something went wrong in checkout");
      }
    } catch (error) {
      console.error("Error processing payment: ", error);
    }
  };

  const handleProductDelete = async (productId) => {
    const auth = getAuth();
    try {
      if (auth.currentUser) {
        // Remove the product with the given ID from Firestore
        const cartRef = doc(fs, `Carts/${auth.currentUser.uid}`);
        const cartDoc = await getDoc(cartRef);

        if (cartDoc.exists()) {
          const updatedProducts = cartDoc
            .data()
            .products.filter((product) => product.ID !== productId);

          await updateDoc(cartRef, { products: updatedProducts });
          onProductDeleteSuccess(productId);
        }
      }
    } catch (error) {
      console.error("Error deleting from cart: ", error);
    }
  };


  return (
    <>
      <Navbar user={user} totalProductsInCart={totalProductsInCart} />
      <br />
      {cartProducts.length > 0 ? (
        <div className="container-fluid">
          <h1 className="text-center">Cart</h1>
          <div className="products-box cart">
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
