import React, { useState, useEffect } from "react";
import { Favorite, FavoriteBorder, Share } from "@mui/icons-material";
import { fs } from "../../Config/Config";
import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

const styles = {
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
  icons: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px", // Adjusted margin
  },
  icon: {
    padding: "5px",
    borderRadius: "50%",
    margin: "0 5px",
    cursor: "pointer",
  },
  iconLiked: {},
  sharedIcon: {
    padding: "5px",
    borderRadius: "50%",
    margin: "0 5px",
    cursor: "pointer",
  },
  sharedIconShared: {},
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
};

export const IndividualFilteredProduct = ({
  individualFilteredProduct,
  onClickProductDetails,
}) => {
  const { ID, imageUrl, title, brand, price } = individualFilteredProduct;
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (user) {
        try {
          const userFavoritesRef = doc(fs, "userfavorites", user.UID);
          const userFavoritesSnapshot = await getDoc(userFavoritesRef);

          if (userFavoritesSnapshot.exists()) {
            const userFavoritesData = userFavoritesSnapshot.data();
            setIsLiked(userFavoritesData.favoriteProducts.includes(ID));
          }
        } catch (error) {
          console.error("Error fetching user favorites:", error);
        }
      }
    };

    fetchUserFavorites();
  }, [user, ID]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();

    if (!user) return;

    try {
      const userFavoritesRef = doc(fs, "userfavorites", user.UID);

      const userFavoritesSnapshot = await getDoc(userFavoritesRef);
      const userFavoritesData = userFavoritesSnapshot.data();

      // If userFavorites document doesn't exist, create it
      if (!userFavoritesSnapshot.exists()) {
        await setDoc(userFavoritesRef, {
          favoriteProducts: [ID],
        });
        setIsLiked(true);
        return;
      }

      // Check if the product ID is already in the user's favoriteProducts array
      if (userFavoritesData.favoriteProducts.includes(ID)) {
        // If yes, remove the product ID from the array
        await updateDoc(userFavoritesRef, {
          favoriteProducts: arrayRemove(ID),
        });
        setIsLiked(false);
      } else {
        // If no, add the product ID to the array
        await updateDoc(userFavoritesRef, {
          favoriteProducts: arrayUnion(ID),
        });
        setIsLiked(true);
        toast.success("Product added as Favorite successfully", {
          position: toast.POSITION.TOP_RIGHT_CENTER,
        });
      }
    } catch (error) {
      console.error("Error updating user favorites:", error);
    }
  };

  const handleShareClick = async () => {
    try {
      await navigator.share({
        title: title,
        text: `${title} - ${brand}`,
        url: window.location.href,
      });
      setIsShared(true);
      console.log("Shared successfully");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div
      style={styles.product}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
      }}
    >
      <div
        style={styles.productImgContainer}
        onClick={() => onClickProductDetails(ID)}
      >
        <img src={imageUrl} alt="product-img" style={styles.productImg} />
      </div>
      <div style={styles.title}>{title}</div>
      <div style={styles.brand}>{brand}</div>
      <div style={styles.price}>$ {price}</div>
      <div style={styles.icons}>
        <div
          style={{
            ...styles.icon,
            ...(isLiked ? styles.iconLiked : {}),
          }}
          onClick={handleLikeClick}
        >
          {isLiked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
        </div>
        <div
          style={{
            ...styles.sharedIcon,
            ...(isShared ? styles.sharedIconShared : {}),
          }}
          onClick={handleShareClick}
        >
          <Share />
        </div>
      </div>
    </div>
  );
};
