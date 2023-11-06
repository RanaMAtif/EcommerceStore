import React, { useState } from "react";
import { AddProducts } from "./AddProducts";
import { DeleteProducts } from "./DeleteProducts";
import { UpdateProducts } from "./UpdateProducts";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Modal, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";

import { styled } from "@mui/system";

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
export default function HandleProducts() {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] =
    useState(false);

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
    <div
      className="main"
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        width: "20%",
        margin: "auto",
        marginTop: "10%",
      }}
    >
      <Typography variant="h3" style={{ textAlign: "center" }}>
        Product Settings
      </Typography>
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
    </div>
  );
}
