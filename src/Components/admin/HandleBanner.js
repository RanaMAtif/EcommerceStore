import React, { useState } from "react";
import { storage, fs } from "../../Config/Config"; // Import your storage and firestore instances
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HandleBanner() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const storageRef = ref(storage, "banner-images/banner-image"); // Use the same path as in Banner Component
      await uploadBytes(storageRef, selectedFile);

      const imageURL = await getDownloadURL(storageRef);

      // Save the image URL in Firestore
      try {
        const bannerCollectionRef = collection(fs, "banner");
        await addDoc(bannerCollectionRef, { imageUrl: imageURL });
        console.log("Image URL saved in Firestore");

        // Show success toast
        toast.success("Banner Successfully updated", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });

        // Reset fields
        setSelectedFile(null);
      } catch (error) {
        console.error("Error saving image URL in Firestore: ", error);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Change Banner Image
      </Typography>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="upload-input"
      />
      <label htmlFor="upload-input">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Choose Image
        </Button>
      </label>
      <Dialog open={!!selectedFile} onClose={() => setSelectedFile(null)}>
        <DialogTitle>Preview Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "400px" }}
              />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSelectedFile(null)}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            color="primary"
            variant="outlined"
            startIcon={<CloudDownloadIcon />}
          > 
            Upload Banner
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
