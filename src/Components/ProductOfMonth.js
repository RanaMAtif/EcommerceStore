import React, { useState, useEffect } from "react";
import { fs } from "../Config/Config"; // Import your firestore instance
import { collection, doc, getDoc, query, getDocs } from "firebase/firestore";

export default function ProductOfMonth() {
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
    <div>
      <h2>Product of the Month</h2>
      {product ? (
        <div>
          <h3>{product.name}</h3>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ maxWidth: "100%" }}
          />
          <p>Description: {product.description}</p>
          <p>Price: ${product.price}</p>
        </div>
      ) : (
        <p>No product available for this month.</p>
      )}
    </div>
  );
}
