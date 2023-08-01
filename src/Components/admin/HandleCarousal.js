import React, { useState, useEffect } from "react";
import { getStorage, ref, list, getDownloadURL, deleteObject, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Typography,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const IconContainer = styled("div")({
  display: "flex",
  gap: "10px",
});

const IconStyled = styled(CloudUploadIcon)({
  marginRight: (props) => props.theme.spacing(1),
  background: "transparent", // Hide the background
  borderRadius: "0", // Remove any border radius
});

const RootContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "20vh",
  minWidth: "50vh",
});

const Container = styled("div")({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: "20px",
  width: "80%",
  position: "relative",
});

const UploadContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const AddContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start", // Align items at the top
  flex: "1 0 50%", // Take up 50% of the available width
  maxWidth: "calc(50% - 10px)", // Limit the width of the container
});

const DeleteContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start", // Align items at the top
  flex: "1 0 50%", // Take up 50% of the available width
  maxWidth: "calc(600% - 20px)", // Limit the width of the container
  marginLeft: "20px",
});

const Line = styled("div")({
  width: "2px",
  height: "100%",
  backgroundColor: "#ccc",
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
});

const Input = styled("input")({
  display: "none",
});

const ImagePreview = styled("div")({
  marginTop: "10px",
  width: "200px",
  height: "200px",
  borderRadius: "4px",
  border: (props) =>
    props.selected ? "2px solid red" : "2px solid transparent",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

function HandleCarousal() {
  const [image, setImage] = useState(null);
  const [imagesList, setImagesList] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedDeleteImage, setSelectedDeleteImage] = useState("");
  const [selectedDeleteImageUrl, setSelectedDeleteImageUrl] = useState("");

  useEffect(() => {
    fetchImagesList();
  }, []);

  const fetchImagesList = async () => {
    try {
      const storage = getStorage();
      const listRef = ref(storage, "carousel-images");

      // Fetch the first page of 100 items.
      const firstPage = await list(listRef, { maxResults: 100 });

      // Process the items (files) found in the directory.
      const imageNames = firstPage.items.map((item) => item.name);
      setImagesList(imageNames);
    } catch (error) {
      console.error("Error fetching images list from Firebase Storage:", error);
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImageUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setSelectedImageUrl("");
    }
  };

  const handleAddImage = async () => {
    if (image) {
      try {
        const storage = getStorage();
        const imageRef = ref(storage, `carousel-images/${image.name}`);

        await uploadBytes(imageRef, image);

        console.log("Image Added Successfully");
        toast.success("Image added to the Carousal");
        setImage(null);
        setSelectedImage(""); // Reset the selectedImage
        setSelectedImageUrl("");
        // Fetch the updated list of images after addition
        await fetchImagesList();
      } catch (error) {
        console.error("Error adding image:", error);
        toast.error("Failed to add image");
      }
    }
  };

  const handleDeleteImage = () => {
    console.log("Image delete clicked");
    if (selectedDeleteImage) {
      const storage = getStorage();
      const imageRef = ref(storage, `carousel-images/${selectedDeleteImage}`);
      deleteObject(imageRef)
        .then(() => {
          console.log("Image deleted successfully");
          toast.success("Image deleted successfully");
          setSelectedDeleteImage("");
          setSelectedDeleteImageUrl("");
          // Fetch the updated list of images after deletion
          fetchImagesList();
        })
        .catch((error) => {
          console.error("Error deleting image:", error);
          toast.error("Failed to delete image");
        });
    } else {
      console.log("No Image to delete");
      toast.info("Please select an image to delete");
    }
  };

  const handleCancelAddImage = () => {
    setImage(null);
    setSelectedImage("");
    setSelectedImageUrl("");
  };

  const handleCancelDeleteImage = () => {
    setSelectedImage("");
    setSelectedDeleteImage("");
    setSelectedDeleteImageUrl("");
  };

  return (
    <RootContainer>
      <Container>
        <AddContainer>
          <Typography variant="h6">Add Image</Typography>
          <UploadContainer>
            <Input type="file" id="upload-input" onChange={handleImageChange} />
            <label htmlFor="upload-input">
              <Tooltip title="Select Image">
                <IconButton component="span" aria-label="upload image">
                  <IconStyled />
                </IconButton>
              </Tooltip>
            </label>
            <Typography variant="body2">
              {image ? image.name : "No image selected"}
            </Typography>
          </UploadContainer>
          <ImagePreview
            key={selectedImageUrl} // Add a key prop to the ImagePreview
            style={{
              backgroundImage: selectedImageUrl
                ? `url(${selectedImageUrl})`
                : "none",
            }}
            selected={selectedImage !== ""}
          />
          {image && (
            <IconContainer>
              <Tooltip title="Upload Image">
                <IconButton
                  variant="contained"
                  onClick={handleAddImage}
                  aria-label="upload"
                >
                  <FileUploadIcon color="success" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel">
                <IconButton
                  variant="contained"
                  onClick={handleCancelAddImage}
                  aria-label="cancel"
                >
                  <CancelIcon color="primary" />
                </IconButton>
              </Tooltip>
            </IconContainer>
          )}
        </AddContainer>
        <Line />
        <DeleteContainer>
          <Typography variant="h6">Delete Image</Typography>
          <Select
            value={selectedDeleteImage}
            onChange={(e) => {
              const imageName = e.target.value;
              setSelectedDeleteImage(imageName);
              const storage = getStorage();
              const imageUrl = ref(storage, `carousel-images/${imageName}`);
              getDownloadURL(imageUrl)
                .then((url) => {
                  setSelectedDeleteImageUrl(url);
                })
                .catch((error) => {
                  console.error("Error retrieving image URL:", error);
                  setSelectedDeleteImageUrl("");
                });
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {imagesList.map((imageName) => (
              <MenuItem key={imageName} value={imageName}>
                {imageName}
              </MenuItem>
            ))}
          </Select>
          {selectedDeleteImage && (
            <>
              <ImagePreview
                style={{ backgroundImage: `url(${selectedDeleteImageUrl})` }}
                selected={selectedDeleteImage !== ""}
              />
              <IconContainer>
                <Tooltip title="Delete Image">
                  <IconButton
                    variant="contained"
                    onClick={handleDeleteImage}
                    disabled={!selectedDeleteImage}
                    aria-label="delete"
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton
                    variant="contained"
                    onClick={handleCancelDeleteImage}
                    aria-label="cancel"
                  >
                    <CancelIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </IconContainer>
            </>
          )}
        </DeleteContainer>
      </Container>
    </RootContainer>
  );
}

export default HandleCarousal;
