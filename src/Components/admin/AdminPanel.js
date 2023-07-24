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
      </AdminContainer>
    </>
  );
}
