import React, { useState, useEffect } from "react";
import { storage } from "../Config/Config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Typography, Select, MenuItem } from "@mui/material";
import { styled } from "@mui/system";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const RootContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
});

const Container = styled("div")({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: "20px",
  width: "80%",
  position: "relative", // Add this line to the Container
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
  flex: "1 0 100%", // Take up 50% of the available width
  maxWidth: "calc(60% - 20px)", // Limit the width of the container
});

const DeleteContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start", // Align items at the top
  flex: "1 0 50%", // Take up 50% of the available width
  maxWidth: "calc(100% - 20px)", // Limit the width of the container
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

const ButtonStyled = styled(Button)({
  backgroundColor: (props) => props.theme.palette.primary.main,
  color: (props) => props.theme.palette.common.white,
  "&:hover": {
    backgroundColor: (props) => props.theme.palette.primary.dark,
  },
});

const IconStyled = styled(CloudUploadIcon)({
  marginRight: (props) => props.theme.spacing(1),
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

function AddCarousal() {
  const [image, setImage] = useState(null);
  const [imagesList, setImagesList] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedDeleteImage, setSelectedDeleteImage] = useState("");
  const [selectedDeleteImageUrl, setSelectedDeleteImageUrl] = useState("");

  useEffect(() => {
    const fetchImagesList = async () => {
      try {
        const imagesRef = storage.ref("carousel-images");
        const listResult = await imagesRef.listAll();

        const imageNames = listResult.items.map((item) => item.name);
        setImagesList(imageNames);
      } catch (error) {
        console.error(
          "Error fetching images list from Firebase Storage:",
          error
        );
      }
    };

    fetchImagesList();
  }, []);

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

    console.log("Image is selected");
  };

  const handleAddImage = () => {
    if (image) {
      const uploadTask = storage
        .ref(`carousel-images/${image.name}`)
        .put(image);
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image");
        },
        () => {
          console.log("Image Added Successfully");
          toast.success("Image added to the Carousal");
          setImage(null);
        }
      );
    }
  };

  const handleDeleteImage = () => {
    if (selectedImage) {
      const imageRef = storage.ref(`carousel-images/${selectedImage}`);
      imageRef
        .delete()
        .then(() => {
          toast.success("Image deleted successfully");
          setSelectedImage("");
          setSelectedImageUrl("");
        })
        .catch((error) => {
          console.error("Error deleting image:", error);
          toast.error("Failed to delete image");
        });
    }
  };

  const handleImageSelect = (imageName) => {
    setSelectedImage(imageName);
    const imageUrl = storage.ref(`carousel-images/${imageName}`);
    imageUrl
      .getDownloadURL()
      .then((url) => {
        setSelectedImageUrl(url);
      })
      .catch((error) => {
        console.error("Error retrieving image URL:", error);
        setSelectedImageUrl("");
      });
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
          <Typography variant="h5">Add Image</Typography>
          <UploadContainer>
            <Input type="file" id="upload-input" onChange={handleImageChange} />
            <label htmlFor="upload-input">
              <ButtonStyled
                variant="contained"
                component="span"
                startIcon={<IconStyled />}
              >
                Select Image
              </ButtonStyled>
            </label>
            <Typography variant="body2">
              {image ? image.name : "No image selected"}
            </Typography>
          </UploadContainer>
          <ImagePreview
            style={{ backgroundImage: `url(${selectedImageUrl})` }}
            selected={selectedImage !== ""}
          />
          {image && (
            <ButtonStyled variant="contained" onClick={handleAddImage}>
              Upload Image
            </ButtonStyled>
          )}
          {image && (
            <ButtonStyled variant="contained" onClick={handleCancelAddImage}>
              Cancel
            </ButtonStyled>
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
              const imageUrl = storage.ref(`carousel-images/${imageName}`);
              imageUrl
                .getDownloadURL()
                .then((url) => {
                  setSelectedDeleteImageUrl(url);
                })
                .catch((error) => {
                  console.error("Error retrieving image URL:", error);
                  setSelectedDeleteImageUrl("");
                });
            }}
          >
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
              <ButtonStyled
                variant="contained"
                onClick={handleDeleteImage}
                disabled={!selectedDeleteImage}
              >
                Delete Image
              </ButtonStyled>
              <ButtonStyled
                variant="contained"
                onClick={handleCancelDeleteImage}
              >
                Cancel
              </ButtonStyled>
            </>
          )}
        </DeleteContainer>
      </Container>
    </RootContainer>
  );
}

export default AddCarousal;
