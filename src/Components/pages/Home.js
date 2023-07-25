import React, { useState, useEffect } from "react";
import { Navbar } from "../navigationBar/Navbar";
import { Products } from "../product/Products";
import { auth, fs } from "../../Config/Config";
import { IndividualFilteredProduct } from "../IndividualFilteredProduct";
import Carousal from "../Carousal";
import { SideBar } from "../sideBar/SideBar";
import { Button } from "@mui/material";
import Footer from "../footer/Footer";

export const Home = (props) => {
  // Getting current user uid
  const GetUserUid = () => {
    const [uid, setUid] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
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
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              if (snapshot.exists) {
                const userData = snapshot.data();
                setUser({
                  firstName: userData.FirstName,
                  email: user.email,
                });
              } else {
                console.log(
                  "User document does not exist or is missing required field"
                );
                setUser(null);
              }
            })
            .catch((error) => {
              console.log("Error fetching user data:", error);
              setUser(null);
            });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  };

  const user = GetCurrentUser();
  // State of products
  const [products, setProducts] = useState([]);

  // Getting products function
  const getProducts = async () => {
    const products = await fs.collection("Products").get();
    const productsArray = [];
    products.forEach((doc) => {
      const data = doc.data();
      data.ID = doc.id;
      productsArray.push(data);
    });
    setProducts(productsArray);
  };

  useEffect(() => {
    getProducts();
  }, []);

  // State of totalProducts
  const [totalProducts, setTotalProducts] = useState(0);

  // Getting cart products
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid).onSnapshot((snapshot) => {
          const qty = snapshot.docs.length;
          setTotalProducts(qty);
        });
      }
    });
  }, []);

  // Add to cart
  const addToCart = (product) => {
    if (uid !== null) {
      const Product = product;
      Product.qty = 1;
      Product.TotalProductPrice = Product.qty * Product.price;
      fs.collection("Cart " + uid)
        .doc(product.ID)
        .set(Product)
        .then(() => {
          console.log("successfully added to cart");
        });
    } else {
      props.history.push("/login");
    }
  };

  // Filtered products state and functions
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategories([]);
    setSelectedBrands([]);

    let filtered = [];
    if (category === "All") {
      filtered = products;
    } else {
      filtered = products.filter((product) => product.category === category);
    }
    setFilteredProducts(filtered);
  };

  const handleSubcategoryChange = (subcategory) => {
    let updatedSubcategories = [];
    if (selectedSubcategories.includes(subcategory)) {
      updatedSubcategories = selectedSubcategories.filter(
        (item) => item !== subcategory
      );
    } else {
      updatedSubcategories = [...selectedSubcategories, subcategory];
    }
    setSelectedSubcategories(updatedSubcategories);

    let filtered = products.filter((product) => {
      if (selectedCategory === "All") {
        return updatedSubcategories.includes(product.subcategory);
      } else {
        return updatedSubcategories.length > 0
          ? product.category === selectedCategory &&
              updatedSubcategories.includes(product.subcategory)
          : product.category === selectedCategory;
      }
    });
    setFilteredProducts(filtered);
  };

  const handleBrandChange = (brand) => {
    let updatedBrands = [];
    if (selectedBrands.includes(brand)) {
      updatedBrands = selectedBrands.filter((item) => item !== brand);
    } else {
      updatedBrands = [...selectedBrands, brand];
    }
    setSelectedBrands(updatedBrands);

    let filtered = products.filter((product) => {
      const isSelectedCategoryAll = selectedCategory === "All";
      const isSelectedSubcategoriesEmpty = selectedSubcategories.length === 0;
      const isSelectedBrandsEmpty = updatedBrands.length === 0;

      if (isSelectedCategoryAll && isSelectedSubcategoriesEmpty) {
        return isSelectedBrandsEmpty
          ? true
          : updatedBrands.includes(product.brand);
      } else if (isSelectedCategoryAll && !isSelectedSubcategoriesEmpty) {
        return (
          selectedSubcategories.includes(product.subcategory) &&
          (isSelectedBrandsEmpty ? true : updatedBrands.includes(product.brand))
        );
      } else if (!isSelectedCategoryAll && isSelectedSubcategoriesEmpty) {
        return (
          product.category === selectedCategory &&
          (isSelectedBrandsEmpty ? true : updatedBrands.includes(product.brand))
        );
      } else {
        return (
          product.category === selectedCategory &&
          selectedSubcategories.includes(product.subcategory) &&
          (isSelectedBrandsEmpty ? true : updatedBrands.includes(product.brand))
        );
      }
    });
    setFilteredProducts(filtered);
  };

  return (
    <>
      <Navbar
        user={user}
        totalProducts={totalProducts}
        handleCategoryChange={handleCategoryChange}
      />
      <div className="content-container">
        <div>
          {selectedCategory !== "" && (
            <div>
              <SideBar
                category={selectedCategory}
                subcategory={selectedSubcategories}
                handleSubcategoryChange={handleSubcategoryChange}
                handleBrandChange={handleBrandChange}
              />
            </div>
          )}
        </div>
      </div>
      <br />
      <div>{selectedCategory === "" && <Carousal />}</div>
      <div className="container-fluid filter-products-main-box">
        {filteredProducts.length > 0 ? (
          <div className="my-products">
            <h1 className="text-center">{selectedCategory}</h1>
            <Button onClick={() => handleCategoryChange("All")}>
              Return to All Products
            </Button>
            <div className="products-box">
              {filteredProducts.map((individualFilteredProduct) => (
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
      <Footer />
    </>
  );
};
