import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { fs, auth } from "../../Config/Config";
import { Navbar } from "../navigationBar/Navbar";
import { Footer } from "../footer/Footer";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const footerStyle = {
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
  zIndex: 1,
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  margin: "10px",
};

const productDetailsStyle = {
  display: "flex",
  alignItems: "flex-start",
};

const productImageStyle = {
  flex: 2,
  marginRight: "40px",
};

const productDescriptionStyle = {
  flex: 2,
};

const reviewItemStyle = {
  marginBottom: "15px",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  display: "flex",
  justifyContent: "space-between",
  width: "600px",
  alignItems: "center",
  background: "#f5f5f5",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
};

const centeredContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "600px",
  margin: "0 auto",
};

const ProductInfo = () => {
  const history = useHistory();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [totalProductsInCart, setTotalProductsInCart] = useState(0);

  const fetchReviews = async () => {
    try {
      const reviewsQuerySnapshot = await getDocs(
        collection(fs, "Reviews", productId, "ProdReviews")
      );

      if (!reviewsQuerySnapshot.empty) {
        const reviewList = [];
        reviewsQuerySnapshot.forEach((doc) => {
          const reviewData = doc.data();
          reviewList.push(reviewData);
        });
        setReviews(reviewList);
      } else {
        setReviews([]); // No reviews available
      }
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productId) {
          const productDocRef = doc(fs, "Products", productId);

          const productDocSnapshot = await getDoc(productDocRef);

          if (productDocSnapshot.exists()) {
            const productData = productDocSnapshot.data();
            setProduct(productData);
          } else {
            console.log("Product not found.");
            setProduct(null);
          }
        }
      } catch (error) {
        console.error("Error fetching product data: ", error);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    fetchReviews();

    const fetchUserData = async () => {
      console.log(auth.currentUser);
      try {
        if (auth.currentUser) {
          const userDocRef = doc(fs, "users", auth.currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserEmail(userData.Email);
            setUserFirstName(userData.FirstName);
          }
        } 
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [productId, fs]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      if (!auth.currentUser) {
        console.log("User not logged in.");
        return;
      }

      // Fetch user data
      const userDocRef = doc(fs, "users", auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userEmail = userData.Email;
        const userFirstName = userData.FirstName;

        const reviewData = {
          email: userEmail,
          name: userFirstName,
          text: reviewText,
        };

        await addDoc(
          collection(fs, "Reviews", productId, "ProdReviews"),
          reviewData
        );

        setReviewText("");
        // Refresh the reviews list
        fetchReviews();
      }
    } catch (error) {
      console.error("Error submitting review: ", error);
    }
  };
  const fetchCartTotal = async () => {
    if (auth.currentUser) {
      const cartRef = collection(fs, "Carts", auth.currentUser.uid, "products");
      const cartSnapshot = await getDocs(cartRef);
      const totalProducts = cartSnapshot.docs.reduce(
        (acc, doc) => acc + doc.data().qty,
        0
      );
      setTotalProductsInCart(totalProducts);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchCartTotal();
  }, [productId, fs]);

  // Getting cart products
  useEffect(() => {
    const auth = getAuth();
    let sub = true;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const cartRef = collection(fs, "Carts", user.uid, "products");

        // Cart snapshot listener cleanup function

        const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
          if (sub) {
            const totalProducts = snapshot.docs.reduce(
              (acc, doc) => acc + doc.data().qty,
              0
            );
            setTotalProductsInCart(totalProducts);
          }
        });

        return () => {
          sub = false;
          unsubscribeCart();
        };
      }
    });

    // Return a cleanup function for the auth listener
    return () => {
      unsubscribeAuth();
    };
  }, []);

  const addToCart = async () => {
    if (auth.currentUser) {
      const cartRef = collection(fs, "Carts", auth.currentUser.uid, "products");

      try {
        const productRef = doc(cartRef, productId);
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
          toast.info("This product is already in your cart", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
          return;
        }

        // If the product does not exist, add it to the cart with quantity and total product price
        const productWithQtyAndTotalPrice = {
          ...product,
          qty: 1,
          TotalProductPrice: product.price,
        };

        await setDoc(productRef, productWithQtyAndTotalPrice);

        toast.success("Product successfully added to cart", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });

        // Remove the product from local storage if it was added while user was not logged in
        localStorage.removeItem(productId);
      } catch (error) {
        console.error("Error adding product to cart: ", error);
      }
    } else {
      // Save the product ID in local storage
      localStorage.setItem("product", JSON.stringify({id: productId, product}));
      toast.info("Product added to cart. Log in to save to your cart.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      history.push("/login");
    }
  };

  return (
    <>
      <div>
        <Navbar
          user={auth.currentUser}
          totalProductsInCart={totalProductsInCart}
        />
        <div style={containerStyle}>
          {product ? (
            <div style={productDetailsStyle}>
              <div style={productImageStyle}>
                <img
                  src={product.imageUrl}
                  alt="Product"
                  style={{ maxWidth: "500px", height: "200px" }}
                />
              </div>
              <div style={productDescriptionStyle}>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <h3>{product.brand}</h3>
                <Button
                  onClick={addToCart}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "16px" }}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ) : (
            <div>Product not found.</div>
          )}
        </div>
        <div style={centeredContainerStyle}>
          <h1 style={{ margin: "40px" }}>Reviews</h1>
          {reviews.length === 0 && <p>No reviews to show.</p>}
          {reviews.map((review, index) => (
            <div key={index} style={reviewItemStyle}>
              <div>
                <p style={{ marginBottom: "5px" }}>
                  <strong>{review.name}</strong>
                </p>
                <p style={{ width: "450px" }}>{review.text}</p>
              </div>
              {auth.currentUser && (
                <div style={{ width: "100px" }}>
                  <Button variant="outlined" color="secondary">
                    <DeleteIcon />
                  </Button>
                </div>
              )}
            </div>
          ))}

          {auth.currentUser && (
            <form
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "30px",
              }}
              onSubmit={handleSubmitReview}
            >
              <TextField
                style={{ width: "400px", margin: "20px" }}
                label="Write a review"
                variant="outlined"
                multiline
                fullWidth
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "8px" }}
              >
                Submit Review
              </Button>
            </form>
          )}
        </div>
      </div>
      <Footer style={footerStyle} />
    </>
  );
};

export default ProductInfo;
