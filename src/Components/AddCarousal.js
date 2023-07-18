import React, { useState, useEffect } from "react";
import { storage } from "../Config/Config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Typography, Select, MenuItem } from "@mui/material";
import { styled } from "@mui/system";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const RootContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
});

const UploadContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "10px",
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
    setImage(e.target.files[0]);
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

  const handleCancelSelection = () => {
    setSelectedImage("");
    setSelectedImageUrl("");
  };

  return (
    <RootContainer>
      <Typography variant="h5">Add Image to Carousel</Typography>
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
      <ButtonStyled
        variant="contained"
        onClick={handleAddImage}
        disabled={!image}
      >
        Upload Image
      </ButtonStyled>
      <Typography variant="h6">Delete Image</Typography>
      <Select
        value={selectedImage}
        onChange={(e) => handleImageSelect(e.target.value)}
      >
        {imagesList.map((imageName) => (
          <MenuItem key={imageName} value={imageName}>
            {imageName}
          </MenuItem>
        ))}
      </Select>
      {selectedImageUrl && (
        <ImagePreview
          style={{ backgroundImage: `url(${selectedImageUrl})` }}
          selected={selectedImage !== ""}
        />
      )}
      <ButtonStyled
        variant="contained"
        onClick={handleDeleteImage}
        disabled={!selectedImage}
      >
        Delete Image
      </ButtonStyled>
      <ButtonStyled variant="contained" onClick={handleCancelSelection}>
        Cancel
      </ButtonStyled>
    </RootContainer>
  );
}

export default AddCarousal;
