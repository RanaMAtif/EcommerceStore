import React, { useState, useEffect } from "react";
import { AddProducts } from "./AddProducts";
import HandleCarousal from "./HandleCarousal";
import { Button, Modal, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import { DeleteProducts } from "./DeleteProducts";
import { Tooltip } from "@mui/material";
import { UpdateProducts } from "./UpdateProducts";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import HandleBanner from "./HandleBanner";
import HandlePOM from "./HandlePOM";
import HandleSideBanner from "./HandleSideBanner";
import { doc, getDoc, updateDoc,setDoc } from "firebase/firestore";
import { fs } from "../../Config/Config";


const AdminContainer = styled("div")({
  textAlign: "center",
  fontFamily: "Comic Sans MS",
  fontSize: "36px",
  color: "#0040FF",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  padding: "20px",
});

const ButtonContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "20px",
});

const ButtonStyled = styled(Button)({
  width: "200px",
  height: "100px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#45a049",
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

// const FlashSaleButton = styled(ButtonStyled)({
//   backgroundColor: "#81C784", // Green for Flash Sale
//   "&:hover": {
//     backgroundColor: "#388E3C",
//   },
// });

const ModalContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  overflowY: "auto",
});

const ModalContent = styled("div")({
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "4px",
  maxWidth: "600px",
  margin: "auto",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  alignItems: "center",
});

const BigButton = styled(Button)({
  width: "100%",
  height: "100px",
  fontSize: "24px",
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
});

export default function AdminPanel() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCarousalModalOpen, setIsCarousalModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] =
    useState(false);
  const [isCarousalEnabled, setIsCarousalEnabled] = useState(true);

  const [isBannerEnabled, setIsBannerEnabled] = useState(true);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  const [isPOMEnabled, setIsPOMEnabled] = useState(true);
  const [isPOMModalOpen, setIsPOMModalOpen] = useState(false);

  const [isSideBannerEnabled, setIsSideBannerEnabled] = useState(true);
  const [isSideBannerModalOpen, setIsSideBannerModalOpen] = useState(false);

  // const [isFlashSaleEnabled, setIsFlashSaleEnabled] = useState(true);
  // const [isFlashSaleModalOpen, setIsFlashSaleModalOpen] = useState(false);

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
          // setIsFlashSaleEnabled(data.isFlashSaleEnabled);
        }
      })
      .catch((error) => {
        console.error("Error fetching settings:", error);
      });
  }, []);
  // Update the checkbox values in Firestore when they are changed
  useEffect(() => {
    const settingsRef = doc(fs, "admin", "settings");

    updateDoc(settingsRef, {
      isCarousalEnabled,
      isBannerEnabled,
      isPOMEnabled,
      isSideBannerEnabled,
      // isFlashSaleEnabled,
    }).catch((error) => {
      console.error("Error updating settings:", error);
    });
  }, [
    isCarousalEnabled,
    isBannerEnabled,
    isPOMEnabled,
    isSideBannerEnabled,
    // isFlashSaleEnabled,
  ]);
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

  const handleOpenProductModal = () => {
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
  };

  const handleOpenCarousalModal = () => {
    setIsCarousalModalOpen(true);
  };

  const handleCloseCarousalModal = () => {
    setIsCarousalModalOpen(false);
  };

  const handleOpenAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const handleCloseAddProductModal = () => {
    setIsAddProductModalOpen(false);
  };
  const handleOpenDeleteProductModal = () => {
    setIsDeleteProductModalOpen(true);
  };

  const handleCloseDeleteProductModal = () => {
    setIsDeleteProductModalOpen(false);
  };
  const handleOpenUpdateProductModal = () => {
    setIsUpdateProductModalOpen(true);
  };

  const handleCloseUpdateProductModal = () => {
    setIsUpdateProductModalOpen(false);
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
  const handleOpenBannerModal = () => {
    setIsBannerModalOpen(true);
  };
  const handleCloseBannerModal = () => {
    setIsBannerModalOpen(false);
  };

  const handlePOMCheckboxChange = (event) => {
    const newValue = event.target.checked;
    setIsPOMEnabled(newValue);
    updateCheckboxValueInFirestore("isPOMEnabled", newValue);
  };
  const handleOpenPOMModal = () => {
    setIsPOMModalOpen(true);
  };
  const handleClosePOMModal = () => {
    setIsPOMModalOpen(false);
  };

  const handleSideBannerCheckboxChange = (event) => {
    const newValue = event.target.checked;
    setIsSideBannerEnabled(newValue);
    updateCheckboxValueInFirestore("isSideBannerEnabled", newValue);
  };
  const handleOpenSideBannerModal = () => {
    setIsSideBannerModalOpen(true);
  };
  const handleCloseSideBannerModal = () => {
    setIsSideBannerModalOpen(false);
  };

  // const handleFlashSaleCheckboxChange = (event) => {
  //   const newValue = event.target.checked;
  //   setIsFlashSaleEnabled(newValue);
  //   updateCheckboxValueInFirestore("isFlashSaleEnabled", newValue);
  // };
  // const handleOpenFlashSaleModal = () => {
  //   setIsFlashSaleModalOpen(true);
  // };
  // const handleCloseFlashSaleModal = () => {
  //   setIsFlashSaleModalOpen(false);
  // };

  return (
    <>
      <div
        style={{
          fontFamily: "Comic Sans MS",
          fontSize: "36px",
          color: "#0040FF",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "30px",
          borderBottom: "5px solid #648ccd",
        }}
      >
        <h1>Admin Panel</h1>
      </div>

      <AdminContainer>
        <ButtonContainer>
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
              style={{ width: "75%", height: "40px" }}
              variant="contained"
              onClick={handleOpenProductModal}
            >
              Product Settings
            </ProductButton>
          </div>

          <div
            style={{
              width: "60%",
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
              onClick={handleOpenCarousalModal}
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
              width: "60%",
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
              onClick={handleOpenBannerModal}
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
              Banner Settings
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
              width: "60%",
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
              style={{ width: "50%", height: "40px" }}
              variant="contained"
              onClick={handleOpenPOMModal}
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
              width: "60%",
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
              onClick={handleOpenSideBannerModal}
              disabled={!isSideBannerEnabled}
            >
              Side Banner Settings
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

          {/* <div
            style={{
              width: "60%",
              height: "auto",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #81C784",
              borderRadius: "5px",
            }}
          >
            <FlashSaleButton
              style={{ width: "50%", height: "40px" }}
              variant="contained"
              onClick={handleOpenFlashSaleModal}
              disabled={!isFlashSaleEnabled}
            >
              Flash Sale Settings
            </FlashSaleButton>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isFlashSaleEnabled}
                  size="large"
                  onChange={handleFlashSaleCheckboxChange}
                />
              }
              label="Enable Flash Sale"
            />
          </div> */}
        </ButtonContainer>

        <Modal open={isProductModalOpen} onClose={handleCloseProductModal}>
          <ModalContainer>
            <ModalContent>
              <CloseButton
                color="inherit"
                onClick={handleCloseProductModal}
                size="small"
              >
                <CloseIcon />
              </CloseButton>
              <BigButton
                variant="contained"
                color="primary"
                onClick={handleOpenAddProductModal}
              >
                <AddIcon fontSize="large" />
                Add Product
              </BigButton>
              <BigButton
                variant="contained"
                color="error"
                onClick={handleOpenDeleteProductModal}
              >
                <DeleteIcon fontSize="large" />
                Delete Product
              </BigButton>
              <BigButton
                variant="contained"
                color="info"
                onClick={handleOpenUpdateProductModal}
              >
                <UpdateIcon fontSize="large" />
                Update Product
              </BigButton>
              <ModalContent>
                <Tooltip title="Close">
                  <CloseButton
                    color="inherit"
                    onClick={handleCloseProductModal}
                    size="small"
                  >
                    <CloseIcon />
                  </CloseButton>
                </Tooltip>
              </ModalContent>
              {isAddProductModalOpen && (
                <Modal
                  open={isAddProductModalOpen}
                  onClose={handleCloseAddProductModal}
                >
                  <ModalContainer>
                    <ModalContent>
                      <CloseButton
                        color="inherit"
                        onClick={handleCloseAddProductModal}
                        size="small"
                      >
                        <CloseIcon />
                      </CloseButton>
                      <AddProducts />
                    </ModalContent>
                  </ModalContainer>
                </Modal>
              )}
              {isDeleteProductModalOpen && (
                <Modal
                  open={isDeleteProductModalOpen}
                  onClose={handleCloseDeleteProductModal}
                >
                  <ModalContainer>
                    <ModalContent>
                      <CloseButton
                        color="inherit"
                        onClick={handleCloseDeleteProductModal}
                        size="small"
                      >
                        <CloseIcon />
                      </CloseButton>

                      <DeleteProducts />
                    </ModalContent>
                  </ModalContainer>
                </Modal>
              )}
              {isUpdateProductModalOpen && (
                <Modal
                  open={isUpdateProductModalOpen}
                  onClose={handleCloseUpdateProductModal}
                >
                  <ModalContainer>
                    <ModalContent>
                      <CloseButton
                        color="inherit"
                        onClick={handleCloseUpdateProductModal}
                        size="small"
                      >
                        <CloseIcon />
                      </CloseButton>
                      <UpdateProducts />
                    </ModalContent>
                  </ModalContainer>
                </Modal>
              )}
            </ModalContent>
          </ModalContainer>
        </Modal>

        <Modal open={isCarousalModalOpen} onClose={handleCloseCarousalModal}>
          <ModalContainer>
            <ModalContent>
              <CloseButton
                color="inherit"
                onClick={handleCloseCarousalModal}
                size="small"
              >
                <CloseIcon />
              </CloseButton>
              <HandleCarousal />
            </ModalContent>
          </ModalContainer>
        </Modal>
        <Modal open={isBannerModalOpen} onClose={handleCloseBannerModal}>
          <ModalContainer>
            <ModalContent>
              <CloseButton
                color="inherit"
                onClick={handleCloseBannerModal}
                size="small"
              >
                <CloseIcon />
              </CloseButton>

              <HandleBanner />
            </ModalContent>
          </ModalContainer>
        </Modal>
        <Modal open={isPOMModalOpen} onClose={handleClosePOMModal}>
          <ModalContainer>
            <ModalContent>
              <CloseButton
                color="inherit"
                onClick={handleClosePOMModal}
                size="small"
              >
                <CloseIcon />
              </CloseButton>
              <HandlePOM /> 
            </ModalContent>
          </ModalContainer>
        </Modal>
        <Modal
          open={isSideBannerModalOpen}
          onClose={handleCloseSideBannerModal}
        >
          <ModalContainer>
            <ModalContent>
              <CloseButton
                color="inherit"
                onClick={handleCloseSideBannerModal}
                size="small"
              >
                <CloseIcon />
              </CloseButton>
              <HandleSideBanner />
            </ModalContent>
          </ModalContainer>
        </Modal>
        {/* <Modal open={isFlashSaleModalOpen} onClose={handleCloseFlashSaleModal}>
          <ModalContainer>
            <ModalContent>
              <CloseButton
                color="inherit"
                onClick={handleCloseFlashSaleModal}
                size="small"
              >
                <CloseIcon />
              </CloseButton>
              <FlashSale />
            </ModalContent>
          </ModalContainer>
        </Modal> */}
      </AdminContainer>
    </>
  );
}
