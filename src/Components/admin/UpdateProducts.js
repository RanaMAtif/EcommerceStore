import React, { useState, useEffect } from "react";
import { fs, storage } from "../../Config/Config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import EditIcon from "@mui/icons-material/Edit";
import { Modal, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import SaveIcon from "@mui/icons-material/Save";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
});

export const UpdateProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // Changed "updatedImage" to "selectedImage"
  const [imagePreview, setImagePreview] = useState(null);
  const [previousImageUrl, setPreviousImageUrl] = useState(null);

  // Fetch products from Firestore whenever the searchTerm changes
  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      const productsSnapshot = await getDocs(collection(fs, "Products"));
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  // Function to handle the search term change
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle the edit icon click and open the modal
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
    setUpdatedTitle(product.title);
    setUpdatedDescription(product.description);
    setUpdatedPrice(product.price.toString());
    // Set the previous image URL in state based on the selected product
    setPreviousImageUrl(product.imageUrl); // Change "Imageurl" to "imageUrl"
    setImagePreview(product.imageUrl); // Set the image preview for the selected product
  };

  // Function to handle the modal close
  const handleCloseModal = () => {
    setOpenModal(false);
    // Reset the form fields and image preview when the modal is closed
    setUpdatedTitle("");
    setUpdatedDescription("");
    setUpdatedPrice("");
    setSelectedImage(null); // Changed "updatedImage" to "selectedImage"
    setImagePreview(null);
  };

  // Function to handle the modal form submission
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setImagePreview(null);

    if (selectedProduct) {
      const updatedProductData = {
        title: updatedTitle,
        description: updatedDescription,
        price: Number(updatedPrice),
        imageUrl: previousImageUrl,
      };

      try {
        if (selectedImage) {
          // Upload the new image to Firebase Storage and get the URL
          const imageRef = ref(storage, `product-images/${selectedImage.name}`);
          await uploadBytes(imageRef, selectedImage);
          // Get the download URL of the uploaded image
          const url = await getDownloadURL(imageRef);
          // Update the product data with the new image URL
          updatedProductData.imageUrl = url;

          // Delete the previous image from Firebase Storage
          if (previousImageUrl) {
            const previousImageRef = ref(storage, previousImageUrl);
            await deleteObject(previousImageRef);
            console.log("Previous product image deleted successfully");
          } else {
            console.log("Something wrong with previousImageUrl");
          }
        }

        // Update the product data in Firestore
        const productRef = doc(fs, "Products", selectedProduct.id);
        await updateDoc(productRef, updatedProductData);
        console.log("Product updated successfully");
        toast.success("Product Updated Successfully");

        // After successful update, fetch the updated products
        fetchProducts();

        // Close the modal
        setOpenModal(false);
      } catch (error) {
        console.error("Error updating product: ", error);
      }
    }
  };

  // Adjust the useEffect for handling image preview
  useEffect(() => {
    if (selectedImage) {
      const objectURL = URL.createObjectURL(selectedImage);
      setImagePreview(objectURL);

      // Clean up the objectURL when the component unmounts or when a new image is selected
      return () => URL.revokeObjectURL(objectURL);
    }
  }, [selectedImage]); // Use "selectedImage" instead of "updatedImage"

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Update Products</h1>
        <hr />

        <input
          type="text"
          className="form-control"
          placeholder="Search by product title"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>

      {searchTerm.trim() !== "" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          {filteredProducts.length === 0 ? (
            <div>No products found.</div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product">
                <div className="product-img">
                  <img src={product.imageUrl} alt="product-img" />
                </div>
                <div className="product-text title">{product.title}</div>
                <div className="product-text description">
                  {product.description}
                </div>
                <div style={{ fontWeight: "bold" }}>{product.brand}</div>
                <div className="product-text price">$ {product.price}</div>
                {/* Edit Icon */}
                <Tooltip title="Edit Product">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: "blue",
                      cursor: "pointer",
                    }}
                  >
                    <EditIcon
                      onClick={() => handleEditClick(product)}
                      style={{
                        color: "white",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </Tooltip>
              </div>
            ))
          )}
        </div>
      )}
      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <ModalContainer>
          <ModalContent>
            <CloseButton
              color="inherit"
              onClick={handleCloseModal}
              size="small"
            >
              <CloseIcon />
            </CloseButton>
            <h2>Edit Product</h2>
            <form onSubmit={handleModalSubmit}>
              <TextField
                label="Title"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Description"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Price"
                value={updatedPrice}
                onChange={(e) => setUpdatedPrice(e.target.value)}
                fullWidth
                required
                margin="normal"
                type="number"
              />

              <label>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])} // Changed "updatedImage" to "selectedImage"
              />
              {selectedImage && (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      margin: "10px auto",
                    }}
                  />
                </div>
              )}
              <br />
              <div style={{ textAlign: "center" }}>
                <Tooltip title="Update">
                  <IconButton type="submit" color="primary">
                    <SaveIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </div>
            </form>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </div>
  );
};

export default UpdateProducts;
