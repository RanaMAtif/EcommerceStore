import React, { useState, useEffect } from "react";
import { Navbar } from "../navigationBar/Navbar";
import { auth, fs } from "../../Config/Config";
import { CartProducts } from "./CartProducts";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
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
  const GetCurrentUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDocRef = doc(fs, "users", user.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              setUser(userData.FirstName);
            } else {
              console.log("User document does not exist or is missing required field");
              setUser(null);
            }
          } catch (error) {
            console.log("Error fetching user data:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      });

      // Clean up the subscription when the component unmounts
      return () => unsubscribe();
    }, []);

    return user;
  };

  const user = GetCurrentUser();

  // state of cart products
  const [cartProducts, setCartProducts] = useState([]);

  // getting cart products from firestore collection and updating the state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const cartRef = collection(fs, "Cart " + user.uid);
        const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
        });

        // Clean up the cart listener when the component unmounts
        return () => {
          unsubscribeCart();
        };
      }
    });

    // Clean up the auth listener when the component unmounts
    return () => {
      unsubscribeAuth();
    };
  }, []);

  // getting the qty from cartProducts in a separate array
  const qty = cartProducts.map((cartProduct) => {
    return cartProduct.qty;
  });

  // reducing the qty in a single value
  const reducerOfQty = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalQty = qty.reduce(reducerOfQty, 0);

  // getting the TotalProductPrice from cartProducts in a separate array
  const price = cartProducts.map((cartProduct) => {
    return cartProduct.TotalProductPrice;
  });

  // reducing the price in a single value
  const reducerOfPrice = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalPrice = price.reduce(reducerOfPrice, 0);

  // global variable
  let Product;

  // cart product increase function
  const cartProductIncrease = (cartProduct) => {
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.price;
    // Updating in database
    auth.onAuthStateChanged((user) => {
      if (user) {
        const cartDocRef = doc(fs, "Cart " + user.uid, cartProduct.ID);
        updateDoc(cartDocRef, Product)
          .then(() => {
            console.log("Increment added");
          })
          .catch((error) => {
            console.log("Error updating cart product:", error);
          });
      } else {
        console.log("User is not logged in to increment");
      }
    });
  };

  // cart product decrease functionality
  const cartProductDecrease = (cartProduct) => {
    Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.price;
      // Updating in database
      auth.onAuthStateChanged((user) => {
        if (user) {
          const cartDocRef = doc(fs, "Cart " + user.uid, cartProduct.ID);
          updateDoc(cartDocRef, Product)
            .then(() => {
              console.log("Decrement");
            })
            .catch((error) => {
              console.log("Error updating cart product:", error);
            });
        } else {
          console.log("User is not logged in to decrement");
        }
      });
    }
  };

  // state of totalProducts
  const [totalProducts, setTotalProducts] = useState(0);
  // getting cart products
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const cartRef = collection(fs, "Cart " + user.uid);
        const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
        });

        // Clean up the cart listener when the component unmounts
        return () => {
          unsubscribeCart();
        };
      }
    });
    
    // Clean up the auth listener when the component unmounts
    return () => {
      unsubscribeAuth();
    };
  }, []);

  // charging payment
  const history = useHistory();
  const handleToken = async (token) => {
    const cart = { name: "All Products", totalPrice };
    const response = await axios.post("http://localhost:8080/checkout", {
      token,
      cart,
    });
    console.log(response);
    let { status } = response.data;
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
      const carts = await fs.collection("Cart " + uid).get();
      for (var snap of carts.docs) {
        fs.collection("Cart " + uid)
          .doc(snap.id)
          .delete();
      }
    } else {
      alert("Something went wrong in checkout");
    }
  };

  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} />
      <br></br>
      {cartProducts.length > 0 && (
        <div className="container-fluid">
          <h1 className="text-center">Cart</h1>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CartProducts
              cartProducts={cartProducts}
              cartProductIncrease={cartProductIncrease}
              cartProductDecrease={cartProductDecrease}
            />
          </div>
          <div className="summary-box">
            <h5>Cart Summary</h5>
            <br></br>
            <div>
              Total No of Products: <span>{totalQty}</span>
            </div>
            <div>
              Total Price to Pay: <span>$ {totalPrice}</span>
            </div>
            <br></br>
            <StripeCheckout
              stripeKey="YOUR_STRIPE_PUBLISHABLE_KEY"
              token={handleToken}
              billingAddress
              shippingAddress
              name="All Products"
              amount={totalPrice * 100}
            ></StripeCheckout>
            <h6 className="text-center" style={{ marginTop: 7 + "px" }}>
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
      )}
      {cartProducts.length < 1 && (
        <div className="container-fluid">No products to show</div>
      )}

      {showModal === true && (
        <Modal
          TotalPrice={totalPrice}
          totalQty={totalQty}
          hideModal={hideModal}
        />
      )}
    </>
  );
};