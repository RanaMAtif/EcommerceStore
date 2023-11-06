import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { HandleLogin } from "./HandleLogin";
import { HandleSignup } from "./HandleSignup";
import HandleFooter from "./HandleFooter";
import HandleNavBar from "./HandleNavBar";
import HandleProducts from "./HandleProducts";
import HandleCarousal from "./HandleCarousal";
import { useHistory } from "react-router-dom";
import { styled } from "@mui/system";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { fs } from "../../Config/Config";
import HandleSideBanner from "./HandleSideBanner";
import HandlePOM from "./HandlePOM";
import HandleBanner from "./HandleBanner";
import { Home } from "@mui/icons-material";

const ButtonStyled = styled(Button)({
  width: "200px",
  height: "100px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#45a049",
  },
});

const LoginButton = styled(ButtonStyled)({
  backgroundColor: "#000000", // Set the background color to blue
  "&:hover": {
    backgroundColor: "#000000", // Set the background color to a darker blue on hover
  },
});
const SignupButton = styled(ButtonStyled)({
  backgroundColor: "#000000", // Set the background color to blue
  "&:hover": {
    backgroundColor: "#000000", // Set the background color to a darker blue on hover
  },
});
const NavbarButton = styled(ButtonStyled)({
  backgroundColor: "#000000", // Set the background color to blue
  "&:hover": {
    backgroundColor: "#000000", // Set the background color to a darker blue on hover
  },
});
const FooterButton = styled(ButtonStyled)({
  backgroundColor: "#000000", // Set the background color to blue
  "&:hover": {
    backgroundColor: "#000000", // Set the background color to a darker blue on hover
  },
});
const ProductButton = styled(ButtonStyled)({
  backgroundColor: "#007BFF", // Set the background color to blue
  "&:hover": {
    backgroundColor: "#0056b3", // Set the background color to a darker blue on hover
  },
});
const CarousalButton = styled(ButtonStyled)({
  backgroundColor: "#4CAF50",
  varient: "contained",
});
const BannerButton = styled(ButtonStyled)({
  backgroundColor: "#FFC107", // Yellow background color
  "&:hover": {
    backgroundColor: "#FFA000", // Lighter yellow on hover
  },
});
const POMButton = styled(ButtonStyled)({
  backgroundColor: "#E57373", // Red for Product of the Month
  "&:hover": {
    backgroundColor: "#D32F2F",
  },
});
const SideBannerButton = styled(ButtonStyled)({
  backgroundColor: "#9FA8DA", // Purple for Column Carousal
  "&:hover": {
    backgroundColor: "#7E57C2",
  },
});

const drawerWidth = 240;

export default function AdminPanel() {
  const [isCarousalEnabled, setIsCarousalEnabled] = useState(false);
  const [isBannerEnabled, setIsBannerEnabled] = useState(false);
  const history = useHistory();
  const [isPOMEnabled, setIsPOMEnabled] = useState(false);

  const [isSideBannerEnabled, setIsSideBannerEnabled] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);

  const handleHomeClick = () => {
    history.push("/");
  };
  // Fetch the checkbox values from Firestore on component mount
  useEffect(() => {
    const settingsRef = doc(fs, "admin", "settings");

    getDoc(settingsRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setIsCarousalEnabled(data.isCarousalEnabled);
          setIsBannerEnabled(data.isBannerEnabled);
          setIsPOMEnabled(data.isPOMEnabled);
          setIsSideBannerEnabled(data.isSideBannerEnabled);
        }
      })
      .catch((error) => {
        console.error("Error fetching settings:", error);
      });
  }, []);
  //update checks value function
  const updateCheckboxValueInFirestore = async (
    checkboxName,
    checkboxValue
  ) => {
    const settingsRef = doc(fs, "admin", "settings");

    // Check if the document exists
    const docSnapshot = await getDoc(settingsRef);
    if (docSnapshot.exists()) {
      // Update the existing document
      try {
        await updateDoc(settingsRef, {
          [checkboxName]: checkboxValue,
        });
        console.log(`${checkboxName} value updated successfully!`);
      } catch (error) {
        console.error(`Error updating ${checkboxName} value:`, error);
      }
    } else {
      // Create the document with default values
      try {
        await setDoc(settingsRef, {
          [checkboxName]: checkboxValue,
        });
        console.log(`${checkboxName} value set successfully!`);
      } catch (error) {
        console.error(`Error creating ${checkboxName} document:`, error);
      }
    }
  };

  const handleCarousalCheckboxChange = (event) => {
    const newValue = event.target.checked;
    setIsCarousalEnabled(newValue);
    updateCheckboxValueInFirestore("isCarousalEnabled", newValue);
  };

  const handleBannerCheckboxChange = (event) => {
    const newValue = event.target.checked;
    setIsBannerEnabled(newValue);
    updateCheckboxValueInFirestore("isBannerEnabled", newValue);
  };

  const handlePOMCheckboxChange = (event) => {
    const newValue = event.target.checked;
    setIsPOMEnabled(newValue);
    updateCheckboxValueInFirestore("isPOMEnabled", newValue);
  };

  const handleSideBannerCheckboxChange = (event) => {
    const newValue = event.target.checked;
    setIsSideBannerEnabled(newValue);
    updateCheckboxValueInFirestore("isSideBannerEnabled", newValue);
  };

  const openComponent = (componentName) => {
    setActiveComponent(componentName);
  };

  // const closeComponent = () => {
  //   setActiveComponent(null);
  // };

  const renderComponent = (componentName, component) => {
    if (activeComponent === componentName) {
      return <div>{component}</div>;
    }
    return null;
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          style={{
            justifyContent: "space-evenly",
            display: "flex",
            flexDirection: "row",
            marginLeft: "-42%",
          }}
        >
          <Home onClick={handleHomeClick} style={{cursor:"pointer"}}></Home>
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <div
              style={{
                width: "80%",
                height: "70px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LoginButton
                style={{ width: "75%", height: "80%", padding: "10px" }}
                variant="contained"
                onClick={() => openComponent("login")}
              >
                Login Settings
              </LoginButton>
            </div>
            <div
              style={{
                width: "80%",
                height: "70px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SignupButton
                style={{ width: "75%", height: "80%", padding: "10px" }}
                variant="contained"
                onClick={() => openComponent("signup")}
              >
                Signup Settings
              </SignupButton>
            </div>
            <div
              style={{
                width: "80%",
                height: "70px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NavbarButton
                style={{ width: "75%", height: "80%", padding: "10px" }}
                variant="contained"
                onClick={() => openComponent("navbar")}
              >
                Navigation bar Settings
              </NavbarButton>
            </div>
            <div
              style={{
                width: "80%",
                height: "70px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FooterButton
                style={{ width: "75%", height: "80%", padding: "10px" }}
                variant="contained"
                onClick={() => openComponent("footer")}
              >
                Footer Settings
              </FooterButton>
            </div>
            <div
              style={{
                width: "80%",
                height: "70px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ProductButton
                style={{ width: "75%", height: "80%", padding: "10px" }}
                variant="contained"
                onClick={() => openComponent("product")}
              >
                Product Settings
              </ProductButton>
            </div>

            <div
              style={{
                width: "260%",
                height: "auto",
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #4CAF50",
                borderRadius: "5px",
              }}
            >
              <CarousalButton
                variant="contained"
                onClick={() => openComponent("carousal")}
                disabled={!isCarousalEnabled}
                style={{
                  width: "50%",
                  height: "40px",
                  backgroundColor: isCarousalEnabled ? "#4CAF50" : "#999",
                  "&:hover": {
                    backgroundColor: isCarousalEnabled ? "#45a049" : "#999",
                  },
                }}
              >
                Carousal Settings
              </CarousalButton>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCarousalEnabled}
                    size="large"
                    onChange={handleCarousalCheckboxChange}
                  />
                }
                label="Enable Carousal"
              />
            </div>
            <div
              style={{
                width: "260%",
                height: "auto",
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #FFC107",
                borderRadius: "5px",
              }}
            >
              <BannerButton
                variant="contained"
                onClick={() => openComponent("banner")}
                disabled={!isBannerEnabled}
                style={{
                  width: "50%",
                  height: "40px",
                  backgroundColor: isBannerEnabled ? "#FFC107" : "#999",
                  "&:hover": {
                    backgroundColor: isBannerEnabled ? "#FFA000" : "#999",
                  },
                }}
              >
                Main Banner Settings
              </BannerButton>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isBannerEnabled}
                    size="large"
                    onChange={handleBannerCheckboxChange}
                  />
                }
                label="Enable Banner"
              />
            </div>

            <div
              style={{
                width: "260%",
                height: "auto",
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #E57373",
                borderRadius: "5px",
              }}
            >
              <POMButton
                style={{ width: "50%", height: "40px", padding: "5px" }}
                variant="contained"
                onClick={() => openComponent("pom")}
                disabled={!isPOMEnabled}
              >
                Product of the Month Settings
              </POMButton>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPOMEnabled}
                    size="large"
                    onChange={handlePOMCheckboxChange}
                  />
                }
                label="Enable Product of the Month"
              />
            </div>

            <div
              style={{
                width: "260%",
                height: "auto",
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #9FA8DA",
                borderRadius: "5px",
              }}
            >
              <SideBannerButton
                style={{ width: "50%", height: "40px" }}
                variant="contained"
                onClick={() => openComponent("sideBanner")}
                disabled={!isSideBannerEnabled}
              >
                Side Banners Settings
              </SideBannerButton>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSideBannerEnabled}
                    size="large"
                    onChange={handleSideBannerCheckboxChange}
                  />
                }
                label="Enable SideBanner"
              />
            </div>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {/* //render components here */}
        {renderComponent("login", <HandleLogin />)}
        {renderComponent("signup", <HandleSignup />)}
        {renderComponent("navbar", <HandleNavBar />)}
        {renderComponent("footer", <HandleFooter />)}
        {renderComponent("product", <HandleProducts />)}
        {renderComponent("carousal", <HandleCarousal />)}
        {renderComponent("banner", <HandleBanner />)}
        {renderComponent("pom", <HandlePOM />)}
        {renderComponent("sideBanner", <HandleSideBanner />)}
      </Box>
    </Box>
  );
}
