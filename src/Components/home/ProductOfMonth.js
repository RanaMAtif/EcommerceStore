import React, { useState, useEffect } from "react";
import { fs } from "../../Config/Config"; // Import your firestore instance
import { collection, doc, getDoc, query, getDocs } from "firebase/firestore";

const CardStyles = {
  left: "20px",
  bottom: "20px",
  width: "200px",
  border: "1px solid #f0f0f0",
  borderRadius: "5px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffeead",
  padding: "10px",
  zIndex: 2,
  color: "#333",
  textAlign: "center", // Center align the content
};

const titleStyles = {
  fontSize: "18px",
  marginBottom: "10px",
  color: "#555",
  fontWeight: "bold", // Set font weight to bold
};

const productContainerStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const productNameStyles = {
  fontSize: "16px",
  marginTop: "10px",
  color: "#333",
  fontWeight: "bold", // Set font weight to bold
};

const imageStyles = {
  width: "100%",
  maxWidth: "150px",
  marginTop: "10px",
  borderRadius: "3px",
  cursor: "pointer",
};

const descriptionStyles = {
  marginTop: "10px",
  fontSize: "14px",
  color: "#777",
  fontWeight: "bold", // Set font weight to bold
};

const priceStyles = {
  fontWeight: "bold",
  marginTop: "10px",
  color: "#ff5722",
};
export default function ProductOfMonth({ onClickProductDetails }) {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductId = async () => {
      try {
        // Fetch the product ID from the POM collection
        const pomQuery = query(collection(fs, "POM")); // Assuming you have a collection named "POM"
        const pomQuerySnapshot = await getDocs(pomQuery);

        if (!pomQuerySnapshot.empty) {
          const pomDocSnapshot = pomQuerySnapshot.docs[0]; // Assuming you want the first document
          const pomData = pomDocSnapshot.data();
          const productIdFromPOM = pomData.productId;
          setProductId(productIdFromPOM);
        } else {
          console.log("POM collection is empty");
        }
      } catch (error) {
        console.error("Error fetching POM data: ", error);
      }
    };

    fetchProductId();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productId) {
          // Fetch the specific product using the fetched ID
          const productDocRef = doc(fs, "Products", productId);
          const productDocSnapshot = await getDoc(productDocRef);
          if (productDocSnapshot.exists()) {
            const productData = productDocSnapshot.data();
            setProduct(productData);
          } else {
            console.log("Product document doesn't exist");
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product data: ", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={CardStyles}>
      <h2 style={titleStyles}>Product of the Month</h2>
      {product ? (
        <div style={productContainerStyles}>
          <h3 style={productNameStyles}>{product.name}</h3>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={imageStyles}
            onClick={() => onClickProductDetails(productId)}
          />
          <p style={descriptionStyles}>{product.description}</p>
          <p style={priceStyles}>Price: ${product.price}</p>
        </div>
      ) : (
        <p>No product available for this month.</p>
      )}
    </div>
  );
}
