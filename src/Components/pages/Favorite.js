import React, { useState, useEffect } from "react";
import { fs } from "../../Config/Config"; // Import your Firestore instance
import {
  getDocs,
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { Footer } from "../footer/Footer";
import { Navbar } from "../navigationBar/Navbar";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@material-ui/core";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "18%",
  },
  content: {
    maxWidth: "800px",
    width: "100%",
    display: "contents",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: "20px",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid #ddd",
    padding: "20px 0",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    marginBottom: "10px",
  },
  product: {
    border: "1px solid #ddd",
    padding: "10px",
    margin: "10px",
    width: "180px", // Adjusted the width
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  productImgContainer: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
    borderRadius: "8px 8px 0 0",
    transition: "transform 0.3s ease", // Added transition for hover effect
  },
  productImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  title: {
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "center",
    maxWidth: "80%",
    transition: "color 0.3s ease", // Added transition for hover effect
  },
  brand: {
    marginTop: "5px",
    fontSize: "14px",
    color: "#888",
    textAlign: "center",
  },
  price: {
    marginTop: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "red", // Changed price color to red
  },
  deleteIcon: {
    color: "red",
    cursor: "pointer",
  },
  footerStyle: {
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
    zIndex: 1,
  },
};

export const Favorite = () => {
  const history = useHistory();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [totalProductsInCart, setTotalProductsInCart] = useState(0);
  const user = useSelector((state) => state.user);
  const [productsData, setProductsData] = useState([]);


  //Products in cart
  const calculateTotalProductsInCart = async () => {
    if (user) {
      try {
        const cartRef = collection(fs, "Carts", user.UID, "products");
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
  }, [user]);

  const fetchFavoriteProducts = async () => {
    if (user) {
      try {
        const userFavoritesRef = doc(fs, "userfavorites", user.UID);
        const userFavoritesSnapshot = await getDoc(userFavoritesRef);
        if (userFavoritesSnapshot.exists()) {
          const userFavoritesData = userFavoritesSnapshot.data();
          setFavoriteProducts(userFavoritesData.favoriteProducts);
        }
      } catch (error) {
        console.error("Error fetching user favorites:", error);
      }
    }
  };
  useEffect(() => {
    fetchFavoriteProducts();
  }, [user]);

  const fetchProductsData = async () => {
    try {
      const productsCollectionRef = collection(fs, "Products");
      const productsSnapshot = await getDocs(productsCollectionRef);
      const productsData = [];
      productsSnapshot.forEach((doc) => {
        if (favoriteProducts.includes(doc.id)) {
          const productData = doc.data();
          productData.id = doc.id; // Adding the product ID to the data
          productsData.push(productData);
        }
      });

      setProductsData(productsData);
    } catch (error) {
      console.error("Error fetching products data:", error);
    }
  };

  useEffect(() => {
    if (favoriteProducts.length > 0) {
      fetchProductsData();
    }
  }, [favoriteProducts]);

  const handleDeleteProduct = async (productId) => {
    if (user) {
      try {
        const userFavoritesRef = doc(fs, "userfavorites", user.uid);
        await updateDoc(userFavoritesRef, {
          favoriteProducts: arrayRemove(productId),
        });

        // Remove the deleted product from the state
        setProductsData((prevProductsData) =>
          prevProductsData.filter((product) => product.id !== productId)
        );

        toast.success("Product deleted successfully", {
          position: toast.POSITION.TOP_RIGHT_CENTER,
        });
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };
  return (
    <>
      <Navbar totalProductsInCart={totalProductsInCart} />
      <div className="test" style={styles.container}>
        <div style={styles.content}>
          <h2 style={styles.heading}>Favorite Products</h2>
          {productsData.length === 0 ? (
            <p>No products added as favorites.</p>
          ) : (
            productsData.map((product) => (
              <div
                style={styles.product}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 0, 0, 0.1)";
                }}
                key={product.id}
              >
                <img
                  src={product.imageUrl}
                  alt="product-img"
                  style={styles.image}
                  onClick={() => history.push(`/product/${product.id}`)}
                />
                <p style={styles.title}>{product.title}</p>
                <p style={styles.brand}>{product.brand}</p>
                <p style={styles.price}>${product.price}</p> 
                <IconButton
                  style={styles.deleteIcon}
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer style={styles.footerStyle} />
    </>
  );
};
