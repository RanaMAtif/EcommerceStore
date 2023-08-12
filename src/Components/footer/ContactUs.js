import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";

export const ContactUs = ({ onClose }) => {
  const [query, setQuery] = useState("");

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSendQuery = () => {
    const email = "atifranaofficial@gmail.com";
    const subject = "User Query";
    const body = `User Query: ${query}`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <CloseIcon onClick={onClose} style={{ cursor: "pointer" }} />
      </div>
      <Typography variant="body1">
        If you have any questions or inquiries, please feel free to contact us
        Or you can also contact us on this Contact no. (+920000000000)
      </Typography>
      <TextField
        variant="outlined"
        label="Your Query"
        multiline
        rows={4}
        fullWidth
        value={query}
        onChange={handleQueryChange}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={handleSendQuery} sx={{ mt: 2 }}>
        Send Query
      </Button>
    </div>
  );
};
