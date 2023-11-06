import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { fs, storage } from "../../Config/Config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "40vh",
});

function HandleNavBar() {
  const [image, setImage] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState(null);
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };
  // Fetch the old image URL from Firestore when component mounts
  async function fetchOldImageUrl() {
    try {
      const docSnapshot = await getDoc(doc(fs, "NavBarLogo", "Image"));
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.imageUrl) {
          setOldImageUrl(data.imageUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching old image URL:", error);
    }
  }

  useEffect(() => {
    fetchOldImageUrl();
  }, []);

  const handleImageUpload = async () => {
    if (image) {
      const storageRef = ref(storage, "navbar-logo/" + image.name);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);

      // Save the downloadURL to Firestore
      const footerSettingsRef = doc(fs, "NavBarLogo", "Image");
      await setDoc(
        footerSettingsRef,
        { imageUrl: downloadURL },
        { merge: true }
      );

      // Delete the old image from storage
      if (oldImageUrl) {
        try {
          const oldImageRef = ref(storage, oldImageUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
      toast.success("Navigation Bar Logo updated successfully", {
        position: toast.POSITION.TOP_RIGHT_CENTER,
      });
      console.log("Image URL saved in Firestore");
    }
  };

  return (
    <Container>
      <div>
        <Typography variant="h6">Edit Navigation Bar Logo</Typography>

        <input type="file" accept="image/*" onChange={handleImageChange} />
        <Button onClick={handleImageUpload} variant="contained" color="primary">
          Upload Image
        </Button>
      </div>
    </Container>
  );
}

export default HandleNavBar;
