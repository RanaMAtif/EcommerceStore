import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Navbar } from "../navigationBar/Navbar";
import { fs } from "../../Config/Config";
import { collection, getDocs } from "firebase/firestore";
import { selectFilteredProducts } from "../../redux/features/products/prodSlice";
import { IndividualFilteredProduct } from "../product/IndividualFilteredProduct";
import { Button } from "@mui/material";
import { SideBar } from "../sideBar/SideBar";
import { Footer } from "../footer/Footer";
import Carousal from "./Carousal";
import Banner from "./Banner";
import ProductOfMonth from "./ProductOfMonth";
import SideBanner from "./SideBanner";
import { useSelector } from "react-redux";

const contentContainerStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row", // Horizontal alignment
  marginTop: "20px", // Add space between Carousal and content
};

const footerStyle = {
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
  zIndex: 2,
};

const noProductsFoundStyles = {
  height: "50vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 400,
};

const noProductsFoundTitleStyles = {
  fontWeight: "bold",
  fontSize: "20px",
};

const filteredProductsContainerStyles = {
  margin: "20px 0",
};

const filteredProductsTitleStyles = {
  textAlign: "center",
  fontSize: "24px",
  marginBottom: "10px",
};

const returnToMainButtonStyles = {
  display: "block",
  margin: "10px auto",
};

const filteredProductsContentStyles = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
};

const productsOfTheMonthContainerStyles = {
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  justifyContent: "space-between",
  margin: "20px",
};

const divStyles = {
  flex: 1, // Distribute available space equally among the divs
};

const centerDivStyles = {
  ...divStyles,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const loadMoreButtonStyles = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px", // Adjust the margin as needed
};
export const Home = () => {
  const history = useHistory();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [noProductsFound, setNoProductsFound] = useState(false);
  const [totalProductsInCart, setTotalProductsInCart] = useState(0);
  const [showFilterNavDropdown, setShowFilterNavDropdown] = useState(false);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [noMoreProducts, setNoMoreProducts] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector((state) => state.user);
  const {
    isCarousalEnabled,
    isBannerEnabled,
    isPOMEnabled,
    isSideBannerEnabled,
  } = useSelector((state) => state.ui);
  const filteredProducts = useSelector((state) => {
    return selectFilteredProducts(
      state,
      selectedCategory,
      selectedSubcategories,
      selectedBrands
    );
  });

  useEffect(() => {
    const endIndex = currentPage * productsPerPage;

    setDisplayedProducts(filteredProducts.slice(0, endIndex));

    if (endIndex >= filteredProducts.length) {
      setNoMoreProducts(true);
    } else {
      setNoMoreProducts(false);
    }
  }, [currentPage, filteredProducts, productsPerPage]);

  const handleLoadMore = () => {
    setProductsPerPage(productsPerPage + 10);
  };
  // useEffect(() => {
  //   const settingsRef = doc(fs, "admin", "settings");

  //   getDoc(settingsRef)
  //     .then((docSnapshot) => {
  //       if (docSnapshot.exists()) {
  //         const data = docSnapshot.data();
  //         setShowCarousal(data.isCarousalEnabled);
  //         setShowBanner(data.isBannerEnabled);
  //         setShowPOME(data.isPOMEnabled);
  //         setShowSideBanner(data.isSideBannerEnabled);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching settings:", error);
  //     });
  // }, []);

  //products in cart

  const calculateTotalProductsInCart = async () => {
    if (user) {
      try {
        const cartRef = collection(fs, "Carts", user.UID, "products");
        const cartSnapshot = await getDocs(cartRef);

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

  const handleProductClick = (productId) => {
    history.push(`/product/${productId}`);
  };

  // Filtered products state and functions

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategories([]);
    setSelectedBrands([]);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowFilterNavDropdown(true);
      } else {
        setShowFilterNavDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <Navbar
        handleCategoryChange={handleCategoryChange}
        totalProductsInCart={totalProductsInCart}
        showFilterNavDropdown={showFilterNavDropdown}
      />
      <div>{isCarousalEnabled && selectedCategory === "" && <Carousal />}</div>

      <div style={productsOfTheMonthContainerStyles}>
        <div>
          {isSideBannerEnabled && selectedCategory === "" && (
            <SideBanner side="left" />
          )}
        </div>
        <div style={centerDivStyles}>
          {isPOMEnabled && selectedCategory === "" && (
            <ProductOfMonth onClickProductDetails={handleProductClick} />
          )}
        </div>
        <div>
          {isSideBannerEnabled && selectedCategory === "" && (
            <SideBanner side="right" />
          )}
        </div>
      </div>
      {isBannerEnabled && selectedCategory === "" && <Banner />}
      <div style={contentContainerStyles}>
        <div>
          <div
            className="container-fluid filter-products-main-box"
            style={{
              display: "flex",
              flexDirection: "row",
              ...(selectedCategory !== "" && {
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "200px",
                maxWidth: "1000px",
              }),
            }}
          >
            {noProductsFound ? (
              <div style={noProductsFoundStyles}>
                <h1 style={noProductsFoundTitleStyles}>
                  No products under this category.......
                </h1>
              </div>
            ) : (
              <div style={filteredProductsContainerStyles}>
                <h1 style={filteredProductsTitleStyles}>
                  {selectedCategory !== "" ? selectedCategory : "All Products"}
                </h1>
                {selectedCategory !== "" && (
                  <Button
                    style={returnToMainButtonStyles}
                    onClick={() => handleCategoryChange("")}
                  >
                    Return to Main Page
                  </Button>
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flexStart",
                    justifyContent: "spaceBetween",
                  }}
                >
                  <div>
                    {isSideBannerEnabled && selectedCategory === "" && (
                      <SideBanner side="leftBottom" />
                    )}
                  </div>
                  <div className="prod">
                    <div style={filteredProductsContentStyles}>
                      {displayedProducts.map((individualFilteredProduct) => (
                        <IndividualFilteredProduct
                          key={individualFilteredProduct.ID}
                          individualFilteredProduct={individualFilteredProduct}
                          onClickProductDetails={handleProductClick}
                        />
                      ))}
                    </div>
                    {filteredProducts.length > displayedProducts.length && (
                      <div style={loadMoreButtonStyles}>
                        <Button onClick={handleLoadMore}>Load More</Button>
                      </div>
                    )}
                  </div>

                  <div>
                    {isSideBannerEnabled && selectedCategory === "" && (
                      <SideBanner side="rightBottom" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ position: "fixed", top: "227px" }}>
        {selectedCategory !== "" && (
          <SideBar
            selectedCategory={selectedCategory}
            selectedSubcategories={selectedSubcategories}
            setSelectedSubcategories={setSelectedSubcategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
          />
        )}
      </div>
      <Footer style={footerStyle} />
    </div>
  );
};
