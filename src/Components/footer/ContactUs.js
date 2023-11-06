import React, { useRef, useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { fs } from "../../Config/Config";
import emailjs from "@emailjs/browser";
import { useHistory } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "../navigationBar/Navbar";
import PersonIcon from "@mui/icons-material/Person";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "react-redux";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  marginTop: "15%",
};

const headerStyle = {
  marginBottom: "20px",
  fontSize: "28px",
  fontWeight: "bold",
  color: "#333",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flexWrap: "wrap",
  alignContent: "flex-start",
  justifyContent: "space-evenly",
};

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

const inputStyle = {
  width: "100%", // Adjusted the width for readability
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const submitButtonStyle = {
  backgroundColor: "#f50057",
  color: "#fff",
  padding: "12px 20px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  marginTop: "15px",
};

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

function ContactUs() {
  const form = useRef();
  const history = useHistory();
  const [totalProductsInCart, setTotalProductsInCart] = useState(0);
  const [selectedPhoneCode, setSelectedPhoneCode] = useState("+1");
  const user = useSelector((state) => state.user);

  //products in cart

  const calculateTotalProductsInCart = async () => {
    if (user) {
      try {
        const cartRef = collection(fs, "Carts", user.UID, "products");
        const cartSnapshot = await getDocs(cartRef);

        // Count unique product IDs
        const uniqueProductIds = new Set();
        cartSnapshot.forEach((doc) => {
          uniqueProductIds.add(doc.id);
        });

        setTotalProductsInCart(uniqueProductIds.size);
      } catch (error) {
        console.error("Error calculating total products in cart:", error);
      }
    }
  };

  useEffect(() => {
    calculateTotalProductsInCart();
  }, [user]);


  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        form.current,
        process.env.REACT_APP_PUBLIC_KEY
      )
      .then(
        (result) => {
          toast.success("Query sent successfully!", {
            position: "bottom-right",
            autoClose: 3000,
          });
          console.log(result.text);
          // Redirect to the home page
          setTimeout(() => {
            history.push("/");
          }, 2000);
        },

        (error) => {
          console.log(error.text);
        }
      );
  };

  const handlePhoneCodeChange = (event) => {
    setSelectedPhoneCode(event.target.value);
  };

  return (
    <div>
      <Navbar totalProductsInCart={totalProductsInCart} />
      <div style={containerStyle}>
        <Typography variant="h4" style={headerStyle}>
          Contact Us
        </Typography>
        <form style={formStyle} ref={form} onSubmit={sendEmail}>
          <div style={inputContainerStyle}>
            <PersonIcon style={inputIconStyle} />
            <TextField
              type="text"
              placeholder="Your Name"
              name="user_name"
              variant="outlined"
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <MailOutlineIcon style={inputIconStyle} />
            <TextField
              type="email"
              placeholder="Your Email Address"
              name="user_email"
              variant="outlined"
              style={inputStyle}
            />
          </div>
          <div style={inputContainerStyle}>
            <PhoneIcon style={inputIconStyle} />
            <TextField
              select
              value={selectedPhoneCode}
              name="mobile_phone_code"
              onChange={handlePhoneCodeChange}
              variant="outlined"
              style={{ width: "25%", marginRight: "10px" }}
            >
              {phoneCodeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="tel"
              placeholder="Mobile Phone Number"
              name="mobile_phone_number"
              variant="outlined"
              style={{ width: "75%" }}
            />
          </div>
          <div style={inputContainerStyle}>
            <TextField
              name="message"
              type="text"
              placeholder="Your Message"
              multiline
              rows={4}
              variant="outlined"
              style={inputStyle}
            />
          </div>
          <Button variant="contained" type="submit" style={submitButtonStyle}>
            Send Message
          </Button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ContactUs;
