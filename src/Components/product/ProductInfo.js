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
  deleteDoc,
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
  const [totalProductsInCart, setTotalProductsInCart] = useState(0);
  const [user, setUser] = useState(null);
  const [clicked, setClicked] = useState(false);

  ////userdata
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDocRef = doc(fs, "users", authUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUser({
              firstName: userData.FirstName,
              email: authUser.email,
              uid: authUser.uid,
            });
          } else {
            console.log(
              "User document does not exist or is missing required field"
            );
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

    return () => unsubscribe();
  }, []);

  const fetchReviews = async () => {
    try {
      const reviewsQuerySnapshot = await getDocs(
        collection(fs, "Reviews", productId, "ProdReviews")
      );

      if (!reviewsQuerySnapshot.empty) {
        const reviewList = [];
        reviewsQuerySnapshot.forEach((doc) => {
          const reviewData = { id: doc.id, ...doc.data() }; // Include the review ID
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
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
  const calculateTotalProductsInCart = async () => {
    if (user) {
      try {
        const cartRef = collection(fs, "Carts", user.uid, "products");
        const cartSnapshot = await getDocs(cartRef);

        // Count unique product IDs
        const uniqueProductIds = new Set();
        cartSnapshot.forEach((doc) => {
          uniqueProductIds.add(doc.id);
        });

        setTotalProductsInCart(uniqueProductIds.size);
      } catch (error) {
        console.error("Error calculating total products in cart:", error);
      }
    }
  };

  useEffect(() => {
    calculateTotalProductsInCart();
  }, [user, clicked]);

  useEffect(() => {
    fetchReviews();
  }, [productId, fs, user]);

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
    if (user) {
      const cartRef = collection(fs, "Carts", user.uid, "products");
      setClicked(true);

      try {
        const productRef = doc(cartRef, productId);
        const productSnapshot = await getDoc(productRef);
        console.log(clicked);
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
      localStorage.setItem(
        "product",
        JSON.stringify({ id: productId, product })
      );
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
    setClicked(false);
  };

  const deleteReview = async (reviewId) => {
    try {
      const reviewRef = doc(fs, "Reviews", productId, "ProdReviews", reviewId);
      await deleteDoc(reviewRef);
      fetchReviews(); // Refresh the reviews list
      toast.success("Review deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error deleting review: ", error);
      toast.error("An error occurred while deleting the review", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <div>
        <Navbar user={user} totalProductsInCart={totalProductsInCart} />
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
              {user && user.email === review.email && (
                <div style={{ width: "100px" }}>
                  <Button
                    variant="outlined"
                    color="secondary" 
                    onClick={() => deleteReview(review.id)}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              )}
            </div>
          ))}

          {user && (
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
