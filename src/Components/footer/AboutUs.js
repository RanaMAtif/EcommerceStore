import React from "react";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

export const AboutUs = ({ onClose }) => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <CloseIcon onClick={onClose} style={{ cursor: "pointer" }} />
      </div>
      <Typography variant="body1">
        Powerstore is a platform where users can buy and sell products together.
        We strive to provide a seamless and enjoyable experience for all our
        users. If you have any questions or feedback, please feel free to reach
        out to us.
      </Typography>
    </div>
  );
};
