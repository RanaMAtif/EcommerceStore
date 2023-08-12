import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Navbar } from "../navigationBar/Navbar";
import { fs } from "../../Config/Config";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { IndividualFilteredProduct } from "../IndividualFilteredProduct";
import Carousal from "../carousal/Carousal";
import { Button } from "@mui/material";
import { SideBar } from "../sideBar/SideBar";
import { Footer } from "../footer/Footer";

const footerStyle = {
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
  zIndex: 1,
};

export const Home = () => {
  const history = useHistory();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [noProductsFound, setNoProductsFound] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalProductsInCart, setTotalProductsInCart] = useState(0);

  // ...

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

  // Getting current user
  const GetCurrentUser = () => {
    const [user, setUser] = useState(null);

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

    return user;
  };
  const user = GetCurrentUser();

  // Getting products function
  const getProducts = useCallback(async () => {
    let productsRef = collection(fs, "Products");

    if (selectedCategory !== "" && selectedCategory !== "All") {
      productsRef = query(
        productsRef,
        where("category", "==", selectedCategory)
      );
    }

    if (selectedSubcategories.length > 0) {
      productsRef = query(
        productsRef,
        where("subcategory", "in", selectedSubcategories)
      );
    }

    // Filtering products based on selected brands
    if (selectedBrands.length > 0) {
      const productsSnapshot = await getDocs(productsRef);
      const filteredProducts = productsSnapshot.docs.filter((doc) => {
        const productData = doc.data();
        return selectedBrands.includes(productData.brand);
      });

      if (filteredProducts.length === 0) {
        setNoProductsFound(true);
        setProducts([]);
        return;
      }

      const productsArray = filteredProducts.map((doc) => {
        const data = doc.data();
        data.ID = doc.id;
        return data;
      });

      setNoProductsFound(false);
      setProducts(productsArray);
    } else {
      const productsSnapshot = await getDocs(productsRef);

      if (productsSnapshot.empty) {
        setNoProductsFound(true);
        setProducts([]);
      } else {
        const productsArray = productsSnapshot.docs.map((doc) => {
          const data = doc.data();
          data.ID = doc.id;
          return data;
        });

        setNoProductsFound(false);
        setProducts(productsArray);
      }
    }
  }, [selectedCategory, selectedSubcategories, selectedBrands]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Cleanup function

  useEffect(() => {
    let isMounted = true;
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchProducts = async () => {
          try {
            const productsRef = collection(fs, "Products");
            const querySnapshot = await getDocs(productsRef);

            const productsArray = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              data.ID = doc.id;
              return data;
            });

            if (isMounted) {
              setProducts(productsArray);
            }
          } catch (error) {
            console.error("Error fetching products: ", error);
          }
        };

        fetchProducts();
      }
    });

    return () => {
      isMounted = false;
      // Unsubscribe from the onAuthStateChanged listener when the component unmounts
      unsubscribe();
    };
  }, []);

  const handleProductClick = (productId) => {
    history.push(`/product/${productId}`);
  };

  // Filtered products state and functions

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategories([]);
    setSelectedBrands([]);
  };

  return (
    <>
      <Navbar
        user={user}
        handleCategoryChange={handleCategoryChange}
        totalProductsInCart={totalProductsInCart}
      />
      <br />
      {selectedCategory !== "" && (
        <SideBar
          selectedCategory={selectedCategory}
          selectedSubcategories={selectedSubcategories}
          setSelectedSubcategories={setSelectedSubcategories}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
        />
      )}
      <br />
      <div>{selectedCategory === "" && <Carousal />}</div>
      <div className="container-fluid filter-products-main-box">
        {noProductsFound ? (
          <div
            style={{
              height: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 400,
            }}
          >
            <h1 style={{ fontWeight: "bold", fontSize: "20px" }}>
              No products under this category.......
            </h1>
          </div>
        ) : (
          <div className="my-products">
            <h1 className="text-center">
              {selectedCategory !== "" ? selectedCategory : "All Products"}
            </h1>
            {selectedCategory !== "" && (
              <Button onClick={() => handleCategoryChange("All")}>
                Return to All Products
              </Button>
            )}
            <div className="products-box">
              {products.map((individualFilteredProduct) => (
                <IndividualFilteredProduct
                  key={individualFilteredProduct.ID}
                  individualFilteredProduct={individualFilteredProduct}
                  onClickProductDetails={handleProductClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer style={footerStyle} />
    </>
  );
};
