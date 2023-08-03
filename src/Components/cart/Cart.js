import React, { useState, useEffect } from "react";
import { Navbar } from "../navigationBar/Navbar";
import { auth, fs } from "../../Config/Config";
import { CartProducts } from "./CartProducts";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "./Modal";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

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

  // getting cart products from firestore collection and updating the state
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const cartCollectionGroupRef = collection(fs, "Cart");
        const q = query(cartCollectionGroupRef, where("__name__", "==", user.uid));

        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => { 
            const newCartProduct = querySnapshot.docs.map((doc) => ({
              ID: doc.id,
              ...doc.data(),
            }));
            setCartProducts(newCartProduct);
          },
          (error) => {
            console.error("Error fetching cart products:", error);
          }
        );

        return () => unsubscribe();
      } else {
        console.log("user is not signed in to retrieve cart");
      }
    });
  }, []);

  // getting the qty from cartProducts in a separate array
  const qty = cartProducts.map((cartProduct) => cartProduct.qty);

  // reducing the qty in a single value
  const totalQty = qty.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  // getting the TotalProductPrice from cartProducts in a separate array
  const price = cartProducts.map(
    (cartProduct) => cartProduct.TotalProductPrice
  );

  // reducing the price in a single value
  const totalPrice = price.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  // global variable
  let Product;

  // cart product increase function
  const cartProductIncrease = (cartProduct) => {
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.price;
    // updating in database
    auth.onAuthStateChanged((user) => {
      if (user) {
        const productRef = doc(fs, "Cart " + user.uid, cartProduct.ID);
        updateDoc(productRef, Product)
          .then(() => {
            console.log("increment added");
            // Manually update the cartProducts state after the Firestore update
            setCartProducts((prevCartProducts) =>
              prevCartProducts.map((item) =>
                item.ID === cartProduct.ID ? { ...Product } : item
              )
            );
          })
          .catch((error) => {
            console.error("Error updating product: ", error);
          });
      } else {
        console.log("user is not logged in to increment");
      }
    });
  };

  // cart product decrease functionality
  const cartProductDecrease = (cartProduct) => {
    Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.price;
      // updating in database
      auth.onAuthStateChanged((user) => {
        if (user) {
          const productRef = doc(fs, "Cart " + user.uid, cartProduct.ID);
          updateDoc(productRef, Product)
            .then(() => {
              console.log("decrement");
              // Manually update the cartProducts state after the Firestore update
              setCartProducts((prevCartProducts) =>
                prevCartProducts.map((item) =>
                  item.ID === cartProduct.ID ? { ...Product } : item
                )
              );
            })
            .catch((error) => {
              console.error("Error updating product: ", error);
            });
        } else {
          console.log("user is not logged in to decrement");
        }
      });
    }
  };

  // state of totalProducts
  const [totalProducts, setTotalProducts] = useState(0);
  // getting cart products
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const cartCollectionRef = collection(fs, "Cart " + user.uid);
        const unsubscribe = onSnapshot(cartCollectionRef, (querySnapshot) => {
          const qty = querySnapshot.size;
          setTotalProducts(qty);
        });
        return () => unsubscribe();
      }
    });
  }, []);

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
        const cartsSnapshot = await getDocs(collection(fs, "Cart " + uid));
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
  const handleProductDelete = (productId) => {
    // Filter out the product with the given ID from the cartProducts state
    setCartProducts((prevCartProducts) =>
      prevCartProducts.filter((product) => product.ID !== productId)
    );
  };
  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} />
      <br></br>
      {cartProducts.length > 0 ? (
        <div className="container-fluid">
          <h1 className="text-center">Cart</h1>
          <div className="products-box cart">
            <CartProducts
              cartProducts={cartProducts}
              cartProductIncrease={cartProductIncrease}
              cartProductDecrease={cartProductDecrease}
              removeProduct={handleProductDelete}
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
              stripeKey="pk_test_51NRC5HB19CqeJrhWp5wt638E25qSNjaohB7TJVwURTWvoiz9cYBSOR37e5CsncI7TOVCeyIuJWS3JqtuXS0SbsxH00iAtYudOQ"
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
      ) : (
        <div className="container-fluid text-center">
          <h1>Cart</h1>
          <h3>No products in the cart.</h3>
        </div>
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
