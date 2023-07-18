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
  height: "100vh",
});

const ButtonContainer = styled("div")({
  display: "flex",
  gap: "20px",
});

const ButtonStyled = styled(Button)({
  width: "200px",
  height: "100px",
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
    <AdminContainer>
      <ButtonContainer>
        <ButtonStyled variant="contained" onClick={handleOpenProductModal}>
          Product Settings
        </ButtonStyled>
        <ButtonStyled variant="contained" onClick={handleOpenCarousalModal}>
          Carousal Settings
        </ButtonStyled>
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
  );
}
