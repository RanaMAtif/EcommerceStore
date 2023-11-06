import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import { Modal } from "@mui/material";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import IconButton from "@mui/joy/IconButton";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Sheet from "@mui/joy/Sheet";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { AboutUs } from "./AboutUs";
import { fs } from "../../Config/Config";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

const emailFieldStyles = {
  "& .MuiInputLabel-root": {
    color: "white", // Label text color
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white", // Border color when unfocused
    },
    "&:hover fieldset": {
      borderColor: "white", // Border color when hovered
    },
    "&.Mui-focused fieldset": {
      borderColor: "white", // Border color when focused
    },
  },
  "& .MuiInputBase-input": {
    color: "white", // Text color
  },
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#ffffff",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const Footer = () => {
  const [aboutUsModalOpen, setAboutUsModalOpen] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [cachedFooterImage, setCachedFooterImage] = useState(null);
  const footer = useSelector((state) => state.footer);
  const history = useHistory();

  //fetchImage

  const fetchImageURL = async () => {
    const localStorageKey = "footer-image"; // Unique key for image caching
    try {
      // Check if the image URL is cached in localStorage
      const cachedImageUrl = localStorage.getItem(localStorageKey);

      if (cachedImageUrl) {
        setCachedFooterImage(cachedImageUrl);
      } else {
        const docRef = doc(collection(fs, "FooterSettings"), "Image");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const imageData = docSnap.data();
          const imageUrl = imageData.imageUrl;

          // Cache the image URL in localStorage
          localStorage.setItem(localStorageKey, imageUrl);
          // setFooterImage(imageUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching image URL:", error);
    }
  };
  useEffect(() => {
    fetchImageURL();
  }, []);

  const handleCloseAboutUsModal = () => {
    setAboutUsModalOpen(false);
  };

  const handleOpenAboutUsModal = () => {
    setAboutUsModalOpen(true);
  };

  const handleRedirect = (path) => () => {
    history.push(path);
  };

  const handleFacebookClick = () => {
    if (footer.facebook) {
      window.open(footer.facebook, "_blank");
    }
  };

  const handleInstagramClick = () => {
    if (footer.instagram) {
      window.open(footer.instagram, "_blank");
    }
  };

  const handleWhatsAppClick = () => {
    if (footer.whatsapp) {
      window.open(footer.whatsapp, "_blank");
    }
  };

  const handleSubscriberEmailChange = (event) => {
    setSubscriberEmail(event.target.value);
  };

  const handleSubscribeClick = async () => {
    try {
      const newsletterCollectionRef = collection(fs, "NewsletterEmails");
      await addDoc(newsletterCollectionRef, { email: subscriberEmail });

      // Open the subscription modal
      setSubscriptionModalOpen(true);

      // Clear the email input
      setSubscriberEmail("");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
    }
  };

  return (
    <Sheet
      variant="solid"
      color={"primary"}
      invertedColors
      sx={{
        flexGrow: 1,
        p: 2,
        mx: 0,
        my: 0,
        borderRadius: "8px",
        backgroundColor: "#37474f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Card
          variant="soft"
          size="sm"
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
          }}
        >
          <AspectRatio minHeight={80} sx={{ flexBasis: 200 }}>
            {cachedFooterImage ? (
              <img alt="Powerstore Logo" src={cachedFooterImage} /> // Use the cached image
            ) : (
              <h2>Loading</h2> // Fallback if image hasn't loaded yet
            )}
          </AspectRatio>
          <CardContent>
            {footer.text && (
              <Typography level="body2">{footer.text}</Typography>
            )}
          </CardContent>
        </Card>
        <List
          size="sm"
          orientation="horizontal"
          wrap
          sx={{ flexGrow: 0, "--ListItem-radius": "8px" }}
        >
          <ListItem nested sx={{ width: "100%" }}>
            <ListSubheader>Contact Information</ListSubheader>
            <List>
              <ListItem>
                <LocationOnIcon />
                <Typography sx={{ ml: 1 }}>{footer.location}</Typography>
              </ListItem>
              <ListItem>
                <EmailIcon />
                <Typography sx={{ ml: 1 }}>{footer.email}</Typography>
              </ListItem>
              <ListSubheader>Follow Us</ListSubheader>
              <ListItem>
                <FacebookRoundedIcon
                  onClick={handleFacebookClick}
                  sx={{ cursor: "pointer" }}
                />
                <InstagramIcon
                  onClick={handleInstagramClick}
                  sx={{ cursor: "pointer" }}
                />
                <WhatsAppIcon
                  onClick={handleWhatsAppClick}
                  sx={{ cursor: "pointer" }}
                />
              </ListItem>
            </List>
          </ListItem>
        </List>
        <List
          size="sm"
          orientation="horizontal"
          wrap
          sx={{ flexGrow: 0, "--ListItem-radius": "8px" }}
        >
          <ListItem nested sx={{ width: "100%" }}>
            <ListSubheader>Useful Links</ListSubheader>
            <List>
              <ListItem
                button
                onClick={handleRedirect("/")}
                sx={{ cursor: "pointer" }}
              >
                <Typography>Home</Typography>
              </ListItem>
              <ListItem
                button
                onClick={handleRedirect("/contactus")}
                sx={{ cursor: "pointer" }}
              >
                <Typography>Contact Us</Typography>
              </ListItem>
              <ListItem
                button
                onClick={handleOpenAboutUsModal}
                sx={{ cursor: "pointer" }}
              >
                <Typography>About Us</Typography>
              </ListItem>
            </List>
          </ListItem>
        </List>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography>Subscribe to Newsletter -{`>`}</Typography>
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            value={subscriberEmail}
            onChange={handleSubscriberEmailChange}
            sx={emailFieldStyles}
          />
          <IconButton color="primary" onClick={handleSubscribeClick}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          level="body2"
          startDecorator={<Typography textColor="text.tertiary">by</Typography>}
        >
          Powerstore
        </Typography>

        <Typography level="body3" sx={{ ml: "auto" }}>
          Copyright 2023
        </Typography>
      </Box>
      <Modal
        open={aboutUsModalOpen}
        onClose={handleCloseAboutUsModal}
        aria-labelledby="about-us-modal-title"
      >
        <Box sx={{ ...modalStyle, width: "60%" }}>
          <Typography id="about-us-modal-title" variant="h6">
            About Us
          </Typography>
          <AboutUs onClose={handleCloseAboutUsModal} />
        </Box>
      </Modal>
      <Modal
        open={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        aria-labelledby="subscription-modal-title"
      >
        <Box sx={{ ...modalStyle, width: "60%" }}>
          <Typography id="subscription-modal-title" variant="h6">
            Thank You for Subscribing!
          </Typography>
          <Typography>
            You've successfully subscribed to our newsletter.
          </Typography>
        </Box>
      </Modal>
    </Sheet>
  );
};
