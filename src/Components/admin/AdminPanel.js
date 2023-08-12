import React, { useState } from "react";
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
import Banner from "../Banner";
import ProductOfMonth from "../ProductOfMonth";
import FlashSale from "../FlashSale";
import SideBanner from "../SideBanner";
import Testimonial from "../Testimonial";

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

const FlashSaleButton = styled(ButtonStyled)({
  backgroundColor: "#81C784", // Green for Flash Sale
  "&:hover": {
    backgroundColor: "#388E3C",
  },
});

const TestimonialButton = styled(ButtonStyled)({
  backgroundColor: "#90A4AE", // Gray for Testimonial Section
  "&:hover": {
    backgroundColor: "#607D8B",
  },
});

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

  const [isFlashSaleEnabled, setIsFlashSaleEnabled] = useState(true);
  const [isFlashSaleModalOpen, setIsFlashSaleModalOpen] = useState(false);

  const [isTestimonialEnabled, setIsTestimonialEnabled] = useState(true);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

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
    setIsCarousalEnabled(event.target.checked);
  };

  const handleBannerCheckboxChange = (event) => {
    setIsBannerEnabled(event.target.checked);
  };
  const handleOpenBannerModal = () => {
    setIsBannerModalOpen(true);
  };
  const handleCloseBannerModal = () => {
    setIsBannerModalOpen(false);
  };

  const handlePOMCheckboxChange = (event) => {
    setIsPOMEnabled(event.target.checked);
  };
  const handleOpenPOMModal = () => {
    setIsPOMModalOpen(true);
  };
  const handleClosePOMModal = () => {
    setIsPOMModalOpen(false);
  };

  const handleSideBannerCheckboxChange = (event) => {
    setIsSideBannerEnabled(event.target.checked);
  };
  const handleOpenSideBannerModal = () => {
    setIsSideBannerModalOpen(true);
  };
  const handleCloseSideBannerModal = () => {
    setIsSideBannerModalOpen(false);
  };

  const handleFlashSaleCheckboxChange = (event) => {
    setIsFlashSaleEnabled(event.target.checked);
  };
  const handleOpenFlashSaleModal = () => {
    setIsFlashSaleModalOpen(true);
  };
  const handleCloseFlashSaleModal = () => {
    setIsFlashSaleModalOpen(false);
  };

  const handleTestimonialCheckboxChange = (event) => {
    setIsTestimonialEnabled(event.target.checked);
  };
  const handleOpenTestimonialModal = () => {
    setIsTestimonialModalOpen(true);
  };
  const handleCloseTestimonialModal = () => {
    setIsTestimonialModalOpen(false);
  };

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
        }}
      >
        <h1>Admin Panel</h1>
      </div>

      <AdminContainer>
        <ButtonContainer>
          <div>
            <ProductButton variant="contained" onClick={handleOpenProductModal}>
              Product Settings
            </ProductButton>
          </div>
          <div>
            <CarousalButton
              variant="contained"
              onClick={handleOpenCarousalModal}
              disabled={!isCarousalEnabled}
              style={{
                backgroundColor: isCarousalEnabled ? "#4CAF50" : "#999",
                "&:hover": {
                  backgroundColor: isCarousalEnabled ? "#45a049" : "#999",
                },
              }}
            >
              Carousal Settings
            </CarousalButton>

            <FormControlLabel
              style={{ marginLeft: "50px" }}
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
          <div>
            <BannerButton
              variant="contained"
              onClick={handleOpenBannerModal}
              disabled={!isBannerEnabled}
              style={{
                backgroundColor: isBannerEnabled ? "#FFC107" : "#999",
                "&:hover": {
                  backgroundColor: isBannerEnabled ? "#FFA000" : "#999",
                },
              }}
            >
              Banner Settings
            </BannerButton>

            <FormControlLabel
              style={{ marginLeft: "50px" }}
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
          <div>
            <POMButton
              variant="contained"
              onClick={handleOpenPOMModal}
              disabled={!isPOMEnabled}
            >
              Product of the Month Settings
            </POMButton>
            <FormControlLabel
              style={{ marginLeft: "50px" }}
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
          <div>
            <SideBannerButton
              variant="contained"
              onClick={handleOpenSideBannerModal}
              disabled={!isSideBannerEnabled}
            >
              Side Banner Settings
            </SideBannerButton>
            <FormControlLabel
              style={{ marginLeft: "50px" }}
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
          <div>
            <FlashSaleButton
              variant="contained"
              onClick={handleOpenFlashSaleModal}
              disabled={!isFlashSaleEnabled}
            >
              Flash Sale Settings
            </FlashSaleButton>
            <FormControlLabel
              style={{ marginLeft: "50px" }}
              control={
                <Checkbox
                  checked={isFlashSaleEnabled}
                  size="large"
                  onChange={handleFlashSaleCheckboxChange}
                />
              }
              label="Enable Flash Sale"
            />
          </div>
          <div>
            <TestimonialButton
              variant="contained"
              onClick={handleOpenTestimonialModal}
              disabled={!isTestimonialEnabled}
            >
              Testimonial Section Settings
            </TestimonialButton>
            <FormControlLabel
              style={{ marginLeft: "50px" }}
              control={
                <Checkbox
                  checked={isTestimonialEnabled}
                  size="large"
                  onChange={handleTestimonialCheckboxChange}
                />
              }
              label="Enable Testimonial Section"
            />
          </div>
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

              <Banner />
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
              <ProductOfMonth />
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
              <SideBanner />
            </ModalContent>
          </ModalContainer>
        </Modal>
        <Modal open={isFlashSaleModalOpen} onClose={handleCloseFlashSaleModal}>
          <ModalContainer>
            <ModalContent>
              <CloseButton
                color="inherit"
                onClick={handleCloseFlashSaleModal}
                size="small"
              >
                <CloseIcon />
              </CloseButton>
              {/* Render your FlashSale component here */}
              <FlashSale />
            </ModalContent>
          </ModalContainer>
        </Modal>
        <Modal
          open={isTestimonialModalOpen}
          onClose={handleCloseTestimonialModal}
        >
          <ModalContainer>
            <ModalContent>
              <CloseButton
                color="inherit"
                onClick={handleCloseTestimonialModal}
                size="small"
              >
                <CloseIcon />
              </CloseButton>
              {/* Render your Testimonial component here */}
              <Testimonial />
            </ModalContent>
          </ModalContainer>
        </Modal>
      </AdminContainer>
    </>
  );
}
