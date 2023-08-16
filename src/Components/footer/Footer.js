import * as React from "react";
import { useState } from "react";
import footer from "../../Images/footer.png";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import { Modal } from "@mui/material";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import { ContactUs } from "./ContactUs";
import { AboutUs } from "./AboutUs";
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
  const [contactUsModalOpen, setContactUsModalOpen] = useState(false);
  const [aboutUsModalOpen, setAboutUsModalOpen] = useState(false);

  const handleOpenContactUsModal = () => {
    setContactUsModalOpen(true);
  };

  const handleCloseContactUsModal = () => {
    setContactUsModalOpen(false);
  };
  const handleOpenAboutUsModal = () => {
    setAboutUsModalOpen(true);
  };

  const handleCloseAboutUsModal = () => {
    setAboutUsModalOpen(false);
  };
  return (
    <Sheet
      variant="solid"
      color={"primary"}
      invertedColors
      sx={{
        ...{
          bgcolor: `${"primary"}.800`,
        },
        flexGrow: 1,
        p: 1,
        mx: 0,
        my: 0,
        borderRadius: { xs: 0, sm: "xs" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Divider orientation="vertical" />
        <IconButton variant="plain">
          <FacebookRoundedIcon />
        </IconButton>
        <IconButton variant="plain">
          <GitHubIcon />
        </IconButton>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "flex-start" },
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Card
          variant="soft"
          size="sm"
          sx={{
            flexDirection: { xs: "row", md: "column" },
            minWidth: { xs: "100%", md: "auto" },
            gap: 1,
          }}
        >
          <AspectRatio
            ratio="20/10"
            minHeight={80}
            sx={{ flexBasis: { xs: 200, md: "initial" } }}
          >
            <img alt="Powerstore Logo" src={footer} />
          </AspectRatio>
          <CardContent>
            <Typography level="body2">
              Powerstore where we sell and buy together
            </Typography>
          </CardContent>
        </Card>
        <List
          size="sm"
          orientation="horizontal"
          wrap
          sx={{ flexGrow: 0, "--ListItem-radius": "8px" }}
        >
          <ListItem nested sx={{ width: { xs: "50%", md: 140 } }}>
            <ListSubheader>Customer Care</ListSubheader>
            <List>
              <ListItem>
                <ListItemButton onClick={handleOpenContactUsModal}>
                  Contact us
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton onClick={handleOpenAboutUsModal}>
                  About us
                </ListItemButton>
              </ListItem>
            </List>
          </ListItem>
        </List>
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
        open={contactUsModalOpen}
        onClose={handleCloseContactUsModal}
        aria-labelledby="contact-us-modal-title"
      >
        <Box sx={{ ...modalStyle, width: "60%" }}>
          <Typography id="contact-us-modal-title" variant="h6">
            Contact Us
          </Typography>
          <ContactUs onClose={handleCloseContactUsModal} />
        </Box>
      </Modal>
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
    </Sheet>
  );
};
