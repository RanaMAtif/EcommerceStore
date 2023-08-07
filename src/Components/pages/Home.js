import React, { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "../navigationBar/Navbar";
import { fs } from "../../Config/Config";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { IndividualFilteredProduct } from "../IndividualFilteredProduct";
import Carousal from "../Carousal";
import { Button } from "@mui/material";
import Footer from "../footer/Footer";
import { SideBar } from "../sideBar/SideBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const footerStyle = {
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
  zIndex: 1, // Ensure the footer appears above other content
};

export const Home = (props) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [noProductsFound, setNoProductsFound] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalProductsInCart, setTotalProductsInCart] = useState(0);
  const isMounted = useRef(true);
  // Getting current user uid
  const GetUserUid = () => {
    const [uid, setUid] = useState(null);
    useEffect(() => {
      const auth = getAuth();

      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUid(user.uid);
        }
      });
    }, []);
    return uid;
  };

  const uid = GetUserUid();

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

      // Clean up the subscription when the component unmounts
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

  // Getting cart products
  useEffect(() => {
    const auth = getAuth();
    let sub = true;
    // Auth listener cleanup function
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

        // Return a cleanup function for the cart snapshot listener
        return () => {
          sub = false;
          unsubscribeCart(); // Unsubscribe from the snapshot listener
        };
      }
    });

    // Return a cleanup function for the auth listener
    return () => {
      unsubscribeAuth();
    };
  }, []);

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

  // Add to cart
  const addToCart = async (product) => {
    if (uid !== null) {
      const cartRef = collection(fs, "Carts", uid, "products");

      try {
        // Check if the product already exists in the user's cart
        const productRef = doc(cartRef, product.ID);
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
          // If the product already exists, show a notification and return
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

        // Check if the component is still mounted before updating the state
        if (isMounted.current) {
          await setDoc(productRef, productWithQtyAndTotalPrice);
        }

        console.log("Product successfully added to cart");
      } catch (error) {
        console.error("Error adding product to cart: ", error);
      }
    } else {
      props.history.push("/login");
    }
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
        totalProductsInCart={totalProductsInCart}
        handleCategoryChange={handleCategoryChange}
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
                  addToCart={addToCart}
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
