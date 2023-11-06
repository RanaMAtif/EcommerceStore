import React, { useState, useEffect } from "react";
import { setDoc, doc, getDoc, collection } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { fs } from "../../Config/Config";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import MenuItem from "@mui/material/MenuItem";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const phoneCodeOptions = [
  { value: "+1", label: "+1" },
  { value: "+44", label: "+44" },
  { value: "+91", label: "+91" },
  { value: "+92", label: "+92" },
  { value: "+61", label: "+61" },
  { value: "+81", label: "+81" },
  { value: "+86", label: "+86" },
  { value: "+33", label: "+33" },
  { value: "+49", label: "+49" },
  { value: "+39", label: "+39" },
  { value: "+7", label: "+7" },
];

const inputContainerStyle = {
  width: "100%",
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center", // Center the input fields
  alignItems: "center",
};

const inputIconStyle = {
  marginRight: "10px",
};
const HandleFooter = () => {
  const [image, setImage] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState(null);
  const [location, setLocation] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappCountryCode, setWhatsappCountryCode] = useState("+1");
  const [email, setEmail] = useState("");
  // const [emails, setEmails] = useState([]);
  const [footerText, setFooterText] = useState("");

  // Fetch the old image URL from Firestore when component mounts
  async function fetchOldImageUrl() {
    try {
      const docSnapshot = await getDoc(doc(fs, "FooterSettings", "Image"));
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

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleImageUpload = async () => {
    if (image) {
      const storage = getStorage(); // Get the storage instance
      const storageRef = ref(storage, "footer-image/" + image.name);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);

      // Save the downloadURL to Firestore
      const footerSettingsRef = doc(fs, "FooterSettings", "Image");
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
      toast.success("Footer Image Updaed successfully", {
        position: toast.POSITION.TOP_RIGHT_CENTER,
      });
      console.log("Image URL saved in Firestore");
    }
  };

  const handleContactInfoUpdate = async () => {
    const settingsRef = doc(fs, "FooterSettings", "ContactInformation");
    await setDoc(settingsRef, { location, email }, { merge: true });

    console.log("Contact information updated in Firestore");
    toast.success("Contact Information updated successfully", {
      position: toast.POSITION.TOP_RIGHT_CENTER,
    });
  };

  const handleSocialMediaUpdate = async () => {
    const socialMediaRef = doc(fs, "FooterSettings", "SocialMedia");
    const socialMediaData = {
      facebook: facebookLink,
      instagram: instagramLink,
      whatsapp: `https://wa.me/${whatsappCountryCode}${whatsappNumber}`,
    };
    await setDoc(socialMediaRef, socialMediaData, { merge: true });

    console.log("Social media links updated in Firestore");
    toast.success("Social Media links updated successfully", {
      position: toast.POSITION.TOP_RIGHT_CENTER,
    });
  };

  // const fetchEmails = async () => {
  //   try {
  //     const emailsCollectionRef = collection(fs, "NewsletterEmails");
  //     const emailsSnapshot = await getDocs(emailsCollectionRef);
  //     const emailList = [];

  //     emailsSnapshot.forEach((doc) => {
  //       const emailData = doc.data();
  //       emailList.push({ id: doc.id, email: emailData.email });
  //     });

  //     setEmails(emailList);
  //   } catch (error) {
  //     console.error("Error fetching emails:", error);
  //   }
  // };

  // const handleDeleteEmail = async (emailId) => {
  //   try {
  //     const emailDocRef = doc(fs, "NewsletterEmails", emailId);
  //     await deleteDoc(emailDocRef);

  //     // Remove the deleted email from the emails state
  //     setEmails(emails.filter((email) => email.id !== emailId));
  //     toast.success("Email Deleted Successfully", {
  //       position: toast.POSITION.TOP_RIGHT_CENTER,
  //     });
  //   } catch (error) {
  //     console.error("Error deleting email:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchEmails();
  // }, []);

  // Load existing footer text from Firestore
  const fetchTextData = async () => {
    try {
      const docRef = doc(collection(fs, "FooterSettings"), "ImagePhrase");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFooterText(data.text || "");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchTextData();
  }, []);

  const saveFooterTextToFirestore = async () => {
    try {
      if (footerText.length < 40) {
        toast.info("Image text must be equal or > 40 characters", {
          position: toast.POSITION.TOP_RIGHT_CENTER,
        });
        return;
      }
      const docRef = doc(collection(fs, "FooterSettings"), "ImagePhrase");
      await setDoc(docRef, {
        text: footerText,
      });
      setFooterText("");
      toast.success("Text Added Successfully", {
        position: toast.POSITION.TOP_RIGHT_CENTER,
      });
    } catch (error) {
      console.error("Error saving footer text:", error);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="h2">Footer Settings</Typography>
      </div>
      <div
        style={{
          borderRadius: "2px",
          border: "1px solid black",
          marginRight: "5%",
          marginLeft: "5%",
          maxWidth: "100%",
        }}
      >
        <div
          className="head"
          style={{ display: "flex", justifyContent: "center", margiTop: "2%" }}
        >
          <Typography variant="h4">Edit Image and Image Text</Typography>
        </div>
        <div
          className="body"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            borderRadius: "2px",
            border: "1px solid black",
            padding: "50px",
          }}
        >
          <div
            className="image"
            style={{
              borderRadius: "2px",
              border: "1px solid black",
              padding: "50px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "50%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h1>Footer Image</h1>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: "10px" }}
              />
              <Button
                onClick={handleImageUpload}
                variant="contained"
                color="primary"
              >
                Upload Image
              </Button>
            </div>
          </div>
          <div
            className="text"
            style={{
              borderRadius: "2px",
              border: "1px solid black",
              padding: "50px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "50%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h1>Footer Text</h1>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                width: "95%",
              }}
            >
              <TextField
                label="Text Must be = or > than 40 characters"
                onChange={(e) => setFooterText(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
                style={{ marginBottom: "10px" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={saveFooterTextToFirestore}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="Main"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="contact"
          style={{
            borderRadius: "2px",
            border: "1px solid black",
            marginRight: "20%",
            marginLeft: "20%",
            marginTop: "5%",
            padding: "50px",
            width: "45%",
          }}
        >
          <div>
            <h1 style={{ textAlign: "center" }}>Edit Contact Information</h1>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div style={inputContainerStyle}>
              <LocationOnIcon style={inputIconStyle} />
              <TextField
                type="text"
                label="Location"
                value={location}
                variant="outlined"
                margin="normal"
                onChange={(e) => setLocation(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
            </div>
            <div style={inputContainerStyle}>
              <EmailIcon style={inputIconStyle} />
              <TextField
                type="email"
                label="Email"
                value={email}
                variant="outlined"
                margin="normal"
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
            </div>
            <Button
              onClick={handleContactInfoUpdate}
              variant="contained"
              color="primary"
            >
              Update Contact Information
            </Button>
          </div>
        </div>
        <div
          className="social"
          style={{
            borderRadius: "2px",
            border: "1px solid black",
            marginRight: "20%",
            marginLeft: "20%",
            marginTop: "5%",
            padding: "50px",
            width: "45%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ textAlign: "center" }}>Edit Social Media Links</h1>
          </div>
          <div style={inputContainerStyle}>
            <FacebookRoundedIcon style={inputIconStyle} />
            <TextField
              type="url"
              label="Facebook Page Link"
              value={facebookLink}
              onChange={(e) => setFacebookLink(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
          </div>
          <div style={inputContainerStyle}>
            <InstagramIcon style={inputIconStyle} />
            <TextField
              type="url"
              label="Instagram Page Link"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
          </div>
          <div style={inputContainerStyle}>
            <PhoneIcon style={inputIconStyle} />
            <TextField
              select
              value={whatsappCountryCode}
              label="Code"
              name="mobile_phone_code"
              onChange={(e) => setWhatsappCountryCode(e.target.value)}
              variant="outlined"
              style={{ marginBottom: "10px", width: "40%" }}
            >
              {phoneCodeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="tel"
              label="Add Whatsapp Number"
              value={whatsappNumber}
              name="mobile_phone_number"
              variant="outlined"
              onChange={(e) => setWhatsappNumber(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
          </div>
          <Button
            onClick={handleSocialMediaUpdate}
            variant="contained"
            color="primary"
          >
            Update Social Media Links
          </Button>
        </div>
      </div>
      {/* <div>
        <h2>Newsletter Emails</h2>
        <ul>
          {emails.map((email) => (
            <li key={email.id}>
              {email.email}
              <button onClick={() => handleDeleteEmail(email.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default HandleFooter;
