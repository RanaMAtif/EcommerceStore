import React, { useState, useEffect,useCallback } from "react";
import { Navbar } from "../navigationBar/Navbar";
import { Products } from "../product/Products";
import { fs } from "../../Config/Config";
import { doc, setDoc,getDoc,collection, getDocs,onSnapshot,query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { IndividualFilteredProduct } from "../IndividualFilteredProduct";
import Carousal from "../Carousal";
import { Button } from "@mui/material";
import Footer from "../footer/Footer";
import { SideBar } from "../sideBar/SideBar";
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
  // State of products
  const [products, setProducts] = useState([]);

  // Getting products function
  const getProducts = useCallback(async () => {
    let productsRef = collection(fs, "Products");
  
    if (selectedCategory !== "" && selectedCategory !== "All") {
      productsRef = query(productsRef, where("category", "==", selectedCategory));
    }
  
    if (selectedSubcategories.length > 0) {
      productsRef = query(
        productsRef,
        where("subcategory", "in", selectedSubcategories)
      );
    }
  
    // We'll handle the brand filtering separately
    // Filter products based on selected brands
    if (selectedBrands.length > 0) {
      const productsSnapshot = await getDocs(productsRef);
      const filteredProducts = productsSnapshot.docs.filter((doc) => {
        const productData = doc.data();
        return selectedBrands.includes(productData.brand);
      });
  
      if (filteredProducts.length === 0) {
        setNoProductsFound(true);
        setProducts([]); // No products to show, so set an empty array
        return;
      }
  
      // Now we have the filtered products based on brands
      const productsArray = filteredProducts.map((doc) => {
        const data = doc.data();
        data.ID = doc.id;
        return data;
      });
  
      setNoProductsFound(false);
      setProducts(productsArray);
    } else {
      // No brands selected, so fetch all products based on other filters
      const productsSnapshot = await getDocs(productsRef);
  
      if (productsSnapshot.empty) {
        // No products found for the selected filters
        setNoProductsFound(true);
        setProducts([]);
      } else {
        // Products found for the selected filters
        const productsArray = productsSnapshot.docs.map((doc) => {
          const data = doc.data();
          data.ID = doc.id;
          return data;
        });
  
        setNoProductsFound(false);
        setProducts(productsArray);
      }
    }
  },[selectedCategory, selectedSubcategories, selectedBrands])

  useEffect(() => {
    getProducts();
  }, [selectedCategory, selectedSubcategories, selectedBrands, getProducts]);

  // State of totalProducts
  const [totalProducts, setTotalProducts] = useState(0);

  // Getting cart products
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const cartRef = collection(fs, "Cart " + user.uid);
        const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
          const qty = snapshot.docs.length;
          setTotalProducts(qty);
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


  //clean up function

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
  const addToCart = (product) => {
    if (uid !== null) {
      const productWithQtyAndTotalPrice = {
        ...product,
        qty: 1,
        TotalProductPrice: product.price,
      };
  
      try {
        const cartRef = doc(fs, `Cart/${uid}`);
        setDoc(cartRef, productWithQtyAndTotalPrice)
          .then(() => {
            console.log("Product successfully added to cart");
          })
          .catch((error) => {
            console.error("Error adding product to cart: ", error);
          });
      } catch (error) {
        console.error("Error creating cart reference: ", error);
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
        totalProducts={totalProducts}
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
        {noProductsFound ? ( // Check if no products were found for the selected category
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
        ) : products.length > 0 ? ( // <-- Use 'products' instead of 'filteredProducts'
          <div className="my-products">
            <h1 className="text-center">{selectedCategory}</h1>
            <Button onClick={() => handleCategoryChange("All")}>
              Return to All Products
            </Button>
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
        ) : (
          <div className="my-products">
            <h1 className="text-center">All Products</h1>
            <div className="products-box">
              <Products products={products} addToCart={addToCart} />
            </div>
          </div>
        )}
      </div>
      <Footer style={footerStyle} />
    </>
  );
};
