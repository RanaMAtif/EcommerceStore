import React, { useState, useEffect } from "react";
import { storage, fs } from "../../Config/Config";
import {
  uploadBytes,
  getDownloadURL,
  ref,
  deleteObject,
} from "firebase/storage";
import {
  addDoc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
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

export default function HandleSideBanner() {
  const [selectedLeftFile, setSelectedLeftFile] = useState("");
  const [selectedLeftBottomFile, setSelectedLeftBottomFile] = useState("");
  const [selectedRightFile, setSelectedRightFile] = useState("");
  const [selectedRightBottomFile, setSelectedRightBottomFile] = useState("");

  const [leftBannerLink, setLeftBannerLink] = useState("");
  const [leftBottomBannerLink, setLeftBottomBannerLink] = useState("");
  const [rightBannerLink, setRightBannerLink] = useState("");
  const [rightBottomBannerLink, setRightBottomBannerLink] = useState("");

  const [isLeftSideBannerEnabled, setLeftSideBannerEnabled] = useState(false);
  const [isLeftBottomSideBannerEnabled, setLeftBottomSideBannerEnabled] =
    useState(false);
  const [isRightSideBannerEnabled, setRightSideBannerEnabled] = useState(false);
  const [isRightBottomSideBannerEnabled, setRightBottomSideBannerEnabled] =
    useState(false);

  // Fetch the checkbox values from Firestore on component mount
  useEffect(() => {
    const settingsRef = doc(fs, "admin", "sideBannersSettings");

    getDoc(settingsRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setLeftSideBannerEnabled(data.isLeftSideBannerEnabled);
          setLeftBottomSideBannerEnabled(data.isLeftBottomSideBannerEnabled);
          setRightSideBannerEnabled(data.isRightSideBannerEnabled);
          setRightBottomSideBannerEnabled(data.isRightBottomSideBannerEnabled);
        }
      })
      .catch((error) => {
        console.error("Error fetching settings:", error);
      });
  }, []);
  //update checks value function
  const updateCheckboxValueInFirestore = async (
    checkboxName,
    checkboxValue
  ) => {
    const settingsRef = doc(fs, "admin", "sideBannersSettings");

    // Check if the document exists
    const docSnapshot = await getDoc(settingsRef);
    if (docSnapshot.exists()) {
      // Update the existing document
      try {
        await updateDoc(settingsRef, {
          [checkboxName]: checkboxValue,
        });
        console.log(`${checkboxName} value updated successfully!`);
      } catch (error) {
        console.error(`Error updating ${checkboxName} value:`, error);
      }
    } else {
      // Create the document with default values
      try {
        await setDoc(settingsRef, {
          [checkboxName]: checkboxValue,
        });
        console.log(`${checkboxName} value set successfully!`);
      } catch (error) {
        console.error(`Error creating ${checkboxName} document:`, error);
      }
    }
  };

  const handleLeftSideBannerCheckboxChange = (event) => {
    const newValue = event.target.checked;
    setLeftSideBannerEnabled(newValue);
    updateCheckboxValueInFirestore("isLeftSideBannerEnabled", newValue);
  };

  const handleLeftBottomSideBannerCheckboxChange = (event) => {
    const newValue = event.target.checked;
    setLeftBottomSideBannerEnabled(newValue);
    updateCheckboxValueInFirestore("isLeftBottomSideBannerEnabled", newValue);
  };

  const handleRightSideBannerCheckboxChange = (event) => {
    const newValue = event.target.checked;
    setRightSideBannerEnabled(newValue);
    updateCheckboxValueInFirestore("isRightSideBannerEnabled", newValue);
  };
  const handleRightBottomSideBannerCheckboxChange = (event) => {
    const newValue = event.target.checked;
    setRightBottomSideBannerEnabled(newValue);
    updateCheckboxValueInFirestore("isRightBottomSideBannerEnabled", newValue);
  };

  //left side

  const handleLeftFileChange = (event) => {
    setSelectedLeftFile(event.target.files[0]);
  };

  const handleLeftUpload = async () => {
    if (selectedLeftFile) {
      try {
        // Fetch the existing image document from Firestore
        const bannerCollectionRef = collection(fs, "sideBanners");
        const leftBannerCollectionRef = collection(
          doc(bannerCollectionRef, "leftSideBanner"),
          "Image"
        );
        const existingImageSnapshot = await getDocs(leftBannerCollectionRef);

        // Delete the existing image from storage and Firestore
        existingImageSnapshot.forEach(async (doc) => {
          const imageUrl = doc.data().imageUrl;
          const storageRef = ref(storage, imageUrl);
          await deleteObject(storageRef);
          await deleteDoc(doc.ref);
          console.log("Existing Left image deleted from Storage and Firestore");
        });

        // Upload new image and store its URL in the subcollection
        const storageRef = ref(
          storage,
          "sidebanner-images/left-side-banner-image" +
            Date.now() +
            selectedLeftFile.name
        );
        await uploadBytes(storageRef, selectedLeftFile);

        const imageURL = await getDownloadURL(storageRef);
        await addDoc(leftBannerCollectionRef, { imageUrl: imageURL });

        // Show success toast
        toast.success("Left Side Banner Successfully updated", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });

        // Reset fields
        setSelectedLeftFile(null);
      } catch (error) {
        console.error("Error updating left banner image: ", error);
      }
    }
  };
  // Save left banner link
  const handleLeftLinkSave = async () => {
    if (leftBannerLink) {
      try {
        const bannerCollectionRef = collection(fs, "sideBanners");
        const leftBannerLinkRef = collection(
          doc(bannerCollectionRef, "leftSideBanner"),
          "Link"
        );

        // Delete existing link from Firestore
        const existingLinkSnapshot = await getDocs(leftBannerLinkRef);
        existingLinkSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        // Save the provided link
        await addDoc(leftBannerLinkRef, { link: leftBannerLink });

        toast.success("Left Banner Link Successfully saved", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });

        // Reset field
        setLeftBannerLink("");
      } catch (error) {
        console.error("Error saving left banner link: ", error);
      }
    }
  };

  //left bottom side

  const handleLeftBottomFileChange = (event) => {
    setSelectedLeftBottomFile(event.target.files[0]);
  };

  const handleLeftBottomUpload = async () => {
    if (selectedLeftBottomFile) {
      try {
        // Fetch the existing image document from Firestore
        const bannerCollectionRef = collection(fs, "sideBanners");
        const leftBottomBannerCollectionRef = collection(
          doc(bannerCollectionRef, "leftBottomSideBanner"),
          "Image"
        );
        const existingImageSnapshot = await getDocs(
          leftBottomBannerCollectionRef
        );

        // Delete the existing image from storage and Firestore
        existingImageSnapshot.forEach(async (doc) => {
          const imageUrl = doc.data().imageUrl;
          const storageRef = ref(storage, imageUrl);
          await deleteObject(storageRef);
          await deleteDoc(doc.ref);
          console.log(
            "Existing Left bottom image deleted from Storage and Firestore"
          );
        });

        // Upload new image and store its URL in the subcollection
        const storageRef = ref(
          storage,
          "sidebanner-images/left-bottom-side-banner-image" +
            Date.now() +
            selectedLeftBottomFile.name
        );
        await uploadBytes(storageRef, selectedLeftBottomFile);

        const imageURL = await getDownloadURL(storageRef);
        await addDoc(leftBottomBannerCollectionRef, { imageUrl: imageURL });

        // Show success toast
        toast.success("Left Bottom Side Banner Successfully updated", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });

        // Reset fields
        setSelectedLeftBottomFile(null);
      } catch (error) {
        console.error("Error updating left Bottom banner image: ", error);
      }
    }
  };
  // Save left bottom banner link
  const handleLeftBottomLinkSave = async () => {
    if (leftBottomBannerLink) {
      try {
        const bannerCollectionRef = collection(fs, "sideBanners");
        const leftBottomBannerLinkRef = collection(
          doc(bannerCollectionRef, "leftBottomSideBanner"),
          "Link"
        );

        // Delete existing link from Firestore
        const existingLinkSnapshot = await getDocs(leftBottomBannerLinkRef);
        existingLinkSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        // Save the provided link
        await addDoc(leftBottomBannerLinkRef, { link: leftBottomBannerLink });

        toast.success("Left Banner Link Successfully saved", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });

        // Reset field
        setLeftBottomBannerLink("");
      } catch (error) {
        console.error("Error saving left banner link: ", error);
      }
    }
  };

  //right side
  const handleRightFileChange = (event) => {
    setSelectedRightFile(event.target.files[0]);
  };

  const handleRightUpload = async () => {
    if (selectedRightFile) {
      try {
        // Fetch the existing image document from Firestore
        const bannerCollectionRef = collection(fs, "sideBanners");
        const rightBannerCollectionRef = collection(
          doc(bannerCollectionRef, "rightSideBanner"),
          "Image"
        );
        const existingImageSnapshot = await getDocs(rightBannerCollectionRef);

        // Delete the existing image from storage and Firestore
        existingImageSnapshot.forEach(async (doc) => {
          const imageUrl = doc.data().imageUrl;
          const storageRef = ref(storage, imageUrl);
          await deleteObject(storageRef);
          await deleteDoc(doc.ref);
          console.log(
            "Existing Right image deleted from Storage and Firestore"
          );
        });

        // Upload new image and store its URL in the subcollection
        const storageRef = ref(
          storage,
          "sidebanner-images/right-side-banner-image" +
            Date.now() +
            selectedRightFile.name
        );
        await uploadBytes(storageRef, selectedRightFile);

        const imageURL = await getDownloadURL(storageRef);
        await addDoc(rightBannerCollectionRef, { imageUrl: imageURL });

        // Show success toast
        toast.success("Right Side Banner Successfully updated", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });

        // Reset fields
        setSelectedRightFile(null);
      } catch (error) {
        console.error("Error updating right banner image: ", error);
      }
    }
  };

  const handleRightLinkSave = async () => {
    if (rightBannerLink) {
      try {
        const bannerCollectionRef = collection(fs, "sideBanners");
        const rightBannerLinkRef = collection(
          doc(bannerCollectionRef, "rightSideBanner"),
          "Link"
        );

        // Delete existing link from Firestore
        const existingLinkSnapshot = await getDocs(rightBannerLinkRef);
        existingLinkSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        // Save the provided link
        await addDoc(rightBannerLinkRef, { link: rightBannerLink });

        toast.success("Right Banner Link Successfully saved", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });

        // Reset field
        setRightBannerLink("");
      } catch (error) {
        console.error("Error saving right banner link: ", error);
      }
    }
  };

  //right bottom side
  const handleRightBottomFileChange = (event) => {
    setSelectedRightBottomFile(event.target.files[0]);
  };

  const handleRightBottomUpload = async () => {
    if (selectedRightBottomFile) {
      try {
        // Fetch the existing image document from Firestore
        const bannerCollectionRef = collection(fs, "sideBanners");
        const rightBottomBannerCollectionRef = collection(
          doc(bannerCollectionRef, "rightBottomSideBanner"),
          "Image"
        );
        const existingImageSnapshot = await getDocs(
          rightBottomBannerCollectionRef
        );

        // Delete the existing image from storage and Firestore
        existingImageSnapshot.forEach(async (doc) => {
          const imageUrl = doc.data().imageUrl;
          const storageRef = ref(storage, imageUrl);
          await deleteObject(storageRef);
          await deleteDoc(doc.ref);
          console.log(
            "Existing Right bottom image deleted from Storage and Firestore"
          );
        });

        // Upload new image and store its URL in the subcollection
        const storageRef = ref(
          storage,
          "sidebanner-images/right-bottom-side-banner-image" +
            Date.now() +
            selectedRightBottomFile.name
        );
        await uploadBytes(storageRef, selectedRightBottomFile);

        const imageURL = await getDownloadURL(storageRef);
        await addDoc(rightBottomBannerCollectionRef, { imageUrl: imageURL });

        // Show success toast
        toast.success("Right Bottom Side Banner Successfully updated", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });

        // Reset fields
        setSelectedRightBottomFile(null);
      } catch (error) {
        console.error("Error updating right bottom banner image: ", error);
      }
    }
  };

  const handleRightBottomLinkSave = async () => {
    if (rightBottomBannerLink) {
      try {
        const bannerCollectionRef = collection(fs, "sideBanners");
        const rightBottomBannerLinkRef = collection(
          doc(bannerCollectionRef, "rightBottomSideBanner"),
          "Link"
        );

        // Delete existing link from Firestore
        const existingLinkSnapshot = await getDocs(rightBottomBannerLinkRef);
        existingLinkSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        // Save the provided link
        await addDoc(rightBottomBannerLinkRef, { link: rightBottomBannerLink });

        toast.success("Right Bottom Banner Link Successfully saved", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });

        // Reset field
        setRightBottomBannerLink("");
      } catch (error) {
        console.error("Error saving right bottom banner link: ", error);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Side Banners Settings
      </Typography>

      {/* Top Section: Left Side Banner and Right Side Banner */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ border: "1px solid #ccc", padding: "20px", flex: 1 }}>
          {/* Left Side Banner */}
          <div>
            <Typography variant="h5" gutterBottom>
              Left Side Banner
            </Typography>
            <div style={isLeftSideBannerEnabled ? {} : { filter: "blur(4px)" }}>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLeftFileChange}
                  style={{ display: "none" }}
                  id="left-upload-input"
                />
                <label htmlFor="left-upload-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Choose Image
                  </Button>
                </label>
                <Dialog
                  open={!!selectedLeftFile}
                  onClose={() => setSelectedLeftFile(null)}
                >
                  <DialogTitle>Preview Image</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {selectedLeftFile && (
                        <img
                          src={URL.createObjectURL(selectedLeftFile)}
                          alt="Preview"
                          style={{ maxWidth: "100%", maxHeight: "400px" }}
                        />
                      )}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setSelectedLeftFile(null)}
                      color="secondary"
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleLeftUpload}
                      color="primary"
                      variant="outlined"
                      startIcon={<CloudDownloadIcon />}
                    >
                      Upload Left Banner
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
              <div>
                <Typography variant="h6" gutterBottom>
                  Left Banner Link
                </Typography>
                <input
                  type="text"
                  placeholder="Enter link URL"
                  value={leftBannerLink}
                  onChange={(e) => setLeftBannerLink(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleLeftLinkSave}
                >
                  Save Link
                </Button>
              </div>
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isLeftSideBannerEnabled}
                  onChange={handleLeftSideBannerCheckboxChange}
                />
              }
              label="Enable Left Side Banner Settings"
            />
          </div>
        </div>
        <div style={{ width: "20px" }}></div> {/* Space between the sections */}
        <div style={{ border: "1px solid #ccc", padding: "20px", flex: 1 }}>
          {/* Right Side Banner */}
          <div>
            <Typography variant="h5" gutterBottom>
              Right Side Banner
            </Typography>
            <div
              style={isRightSideBannerEnabled ? {} : { filter: "blur(4px)" }}
            >
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleRightFileChange}
                  style={{ display: "none" }}
                  id="right-upload-input"
                />
                <label htmlFor="right-upload-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Choose Image
                  </Button>
                </label>
                <Dialog
                  open={!!selectedRightFile}
                  onClose={() => setSelectedRightFile(null)}
                >
                  <DialogTitle>Preview Image</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {selectedRightFile && (
                        <img
                          src={URL.createObjectURL(selectedRightFile)}
                          alt="Preview"
                          style={{ maxWidth: "100%", maxHeight: "400px" }}
                        />
                      )}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setSelectedRightFile(null)}
                      color="secondary"
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRightUpload}
                      color="primary"
                      variant="outlined"
                      startIcon={<CloudDownloadIcon />}
                    >
                      Upload Right Banner
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
              <div>
                <Typography variant="h6" gutterBottom>
                  Right Banner Link
                </Typography>
                <input
                  type="text"
                  placeholder="Enter link URL"
                  value={rightBannerLink}
                  onChange={(e) => setRightBannerLink(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleRightLinkSave}
                >
                  Save Link
                </Button>
              </div>
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRightSideBannerEnabled}
                  onChange={handleRightSideBannerCheckboxChange}
                />
              }
              label="Enable Right Side Banner Settings"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Left Bottom Side Banner and Right Bottom Side Banner */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ border: "1px solid #ccc", padding: "20px", flex: 1 }}>
          {/* Left Bottom Side Banner */}
          <div>
            <Typography variant="h5" gutterBottom>
              Left Bottom Side Banner
            </Typography>
            <div
              style={
                isLeftBottomSideBannerEnabled ? {} : { filter: "blur(4px)" }
              }
            >
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLeftBottomFileChange}
                  style={{ display: "none" }}
                  id="left-bottom-upload-input"
                />
                <label htmlFor="left-bottom-upload-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Choose Image
                  </Button>
                </label>
                <Dialog
                  open={!!selectedLeftBottomFile}
                  onClose={() => setSelectedLeftBottomFile(null)}
                >
                  <DialogTitle>Preview Image</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {selectedLeftBottomFile && (
                        <img
                          src={URL.createObjectURL(selectedLeftBottomFile)}
                          alt="Preview"
                          style={{ maxWidth: "100%", maxHeight: "400px" }}
                        />
                      )}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setSelectedLeftBottomFile(null)}
                      color="secondary"
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleLeftBottomUpload}
                      color="primary"
                      variant="outlined"
                      startIcon={<CloudDownloadIcon />}
                    >
                      Upload Left Bottom Banner
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
              <div>
                <Typography variant="h6" gutterBottom>
                  Left Bottom Banner Link
                </Typography>
                <input
                  type="text"
                  placeholder="Enter link URL"
                  value={leftBottomBannerLink}
                  onChange={(e) => setLeftBottomBannerLink(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleLeftBottomLinkSave}
                >
                  Save Link
                </Button>
              </div>
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isLeftBottomSideBannerEnabled}
                  onChange={handleLeftBottomSideBannerCheckboxChange}
                />
              }
              label="Enable Left Bottom Side Banner Settings"
            />
          </div>
        </div>
        <div style={{ width: "20px" }}></div> {/* Space between the sections */}
        <div style={{ border: "1px solid #ccc", padding: "20px", flex: 1 }}>
          {/* Right Bottom Side Banner */}
          <div>
            <Typography variant="h5" gutterBottom>
              Right Bottom Side Banner
            </Typography>
            <div
              style={
                isRightBottomSideBannerEnabled ? {} : { filter: "blur(4px)" }
              }
            >
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleRightBottomFileChange}
                  style={{ display: "none" }}
                  id="right-bottom-upload-input"
                />
                <label htmlFor="right-bottom-upload-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Choose Image
                  </Button>
                </label>
                <Dialog
                  open={!!selectedRightBottomFile}
                  onClose={() => setSelectedRightBottomFile(null)}
                >
                  <DialogTitle>Preview Image</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {selectedRightBottomFile && (
                        <img
                          src={URL.createObjectURL(selectedRightBottomFile)}
                          alt="Preview"
                          style={{ maxWidth: "100%", maxHeight: "400px" }}
                        />
                      )}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setSelectedRightBottomFile(null)}
                      color="secondary"
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRightBottomUpload}
                      color="primary"
                      variant="outlined"
                      startIcon={<CloudDownloadIcon />}
                    >
                      Upload Right Bottom Banner
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
              <div>
                <Typography variant="h6" gutterBottom>
                  Right Bottom Banner Link
                </Typography>
                <input
                  type="text"
                  placeholder="Enter link URL"
                  value={rightBottomBannerLink}
                  onChange={(e) => setRightBottomBannerLink(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleRightBottomLinkSave}
                >
                  Save Link
                </Button>
              </div>
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRightBottomSideBannerEnabled}
                  onChange={handleRightBottomSideBannerCheckboxChange}
                />
              }
              label="Enable Right Bottom Side Banner Settings"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
