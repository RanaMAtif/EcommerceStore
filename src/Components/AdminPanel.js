import React, { useState } from "react";
import { AddProducts } from "./AddProducts";
import AddCarousal from "./AddCarousal";
import { Button, Modal, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

const AdminContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "50vh",
});

const ButtonContainer = styled("div")({
  display: "flex",
  flexDirection: "column", // Set buttons to render vertically
  gap: "20px",
  alignItems: "center",
  justifyContent: "center",
});

const ButtonStyled = styled(Button)({
  width: "200px",
  height: "100px",
  backgroundColor: "#4CAF50", // Set the background color to green
  color: "#fff", // Set the text color to white
  "&:hover": {
    backgroundColor: "#45a049", // Set the background color on hover
  },
});
const ProductButton = styled(ButtonStyled)({
  backgroundColor: "#007BFF", // Set the background color to blue
  "&:hover": {
    backgroundColor: "#0056b3", // Set the background color to a darker blue on hover
  },
});

const CarousalButton = styled(ButtonStyled)({
  backgroundColor: "#4CAF50", // Set the background color to green
});

const ModalContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
});

const ModalContent = styled("div")({
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "4px",
  maxWidth: "600px",
  margin: "auto",
  position: "relative",
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
});

export default function AdminPanel() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCarousalModalOpen, setIsCarousalModalOpen] = useState(false);

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
          <ProductButton variant="contained" onClick={handleOpenProductModal}>
            Product Settings
          </ProductButton>
          <CarousalButton variant="contained" onClick={handleOpenCarousalModal}>
            Carousal Settings
          </CarousalButton>
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
              <AddProducts />
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
              <AddCarousal />
            </ModalContent>
          </ModalContainer>
        </Modal>
      </AdminContainer>
    </>
  );
}
