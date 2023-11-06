import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { object, string } from "yup";
import { auth, fs } from "../../Config/Config";
import logsiga from "../../Images/logsiga.png";
import logsigb from "../../Images/logsigb.png";
import lodsigc from "../../Images/lodsigc.png";
import logsigd from "../../Images/logsigd.png";
import logsige from "../../Images/logsige.png";
import logsigf from "../../Images/logsigf.png";
import { Grid } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

const imageUrls = [logsiga, logsigb, lodsigc, logsigd, logsige, logsigf];
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const validation = object({
  firstName: string().required("First Name is required"),
  lastName: string().required("Last Name is required"),
  email: string().email("Invalid email address").required("Required"),
  password: string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export const Signup = () => {
  const history = useHistory();
  const [logoUrl, setLogoUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [currentImageUrl, setCurrentImageUrl] = useState(
    imageUrls[Math.floor(Math.random() * imageUrls.length)]
  );
  useEffect(() => {
    setCurrentImageUrl(imageUrls[Math.floor(Math.random() * imageUrls.length)]);
  }, []);
  const handleSignup = (values) => {
    const { firstName, lastName, email, password } = values;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);

        setDoc(doc(fs, "users", user.uid), {
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Password: password,
        })
          .then(() => {
            setSuccessMsg(
              "Signup Successful. You will now automatically get redirected to Login"
            );
            setErrorMsg("");
            setTimeout(() => {
              setSuccessMsg("");
              history.push("/login");
            }, 3000);
          })
          .catch((error) => setErrorMsg(error.message));
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  const fetchImageURL = async () => {
    try {
      const docRef = doc(collection(fs, "SignupLogo"), "Image");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const imageData = docSnap.data();
        setLogoUrl(imageData.imageUrl);
      }
    } catch (error) {
      console.error("Error fetching image URL:", error);
    }
  };
  useEffect(() => {
    fetchImageURL();
  }, []);
  return (
    <Grid
      sx={{
        p: 1,
        my: 8,
        mx: "auto",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { md: "center" },
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        maxWidth: "800px", // Optional: Limit the max width of the outer box
      }}
    >
      <Box
        sx={{
          flex: 1,
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "11%",
        }}
      >
        <img
          src={currentImageUrl}
          alt="Signup"
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </Box>

      <Box sx={{ flex: 1, p: 0 }}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="PowerLog"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "30px",
              display: "flex",
            }}
          />
        ) : (
          <h3>Loading</h3>
        )}
        <Typography component="h1" variant="h5" align="center">
          Sign Up
        </Typography>
        {successMsg && (
          <>
            <Alert variant="outlined" severity="success">
              {successMsg}
            </Alert>
            <br />
          </>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={(values) => handleSignup(values)}
        >
          <Form>
            <Box sx={{ mt: 1 }}>
              <Field
                as={TextField}
                label="First Name"
                margin="normal"
                name="firstName"
                fullWidth
                required
              />
              <div style={{ color: "red", fontSize: "14px" }}>
                <ErrorMessage name="firstName" />
              </div>

              <Field
                as={TextField}
                label="Last Name"
                margin="normal"
                name="lastName"
                fullWidth
                required
              />
              <div style={{ color: "red", fontSize: "14px" }}>
                <ErrorMessage name="lastName" />
              </div>
              <Field
                as={TextField}
                label="Email"
                margin="normal"
                name="email"
                type="email"
                fullWidth
                required
              />
              <div style={{ color: "red", fontSize: "14px" }}>
                <ErrorMessage name="email" />
              </div>
              {errorMsg && (
                <Alert variant="outlined" severity="error">
                  {errorMsg}
                </Alert>
              )}

              <Field
                as={TextField}
                label="Password"
                margin="normal"
                type="password"
                name="password"
                fullWidth
                required
              />
              <div style={{ color: "red", fontSize: "14px" }}>
                <ErrorMessage name="password" />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                SIGN UP
              </Button>

              <Typography variant="body2" align="center">
                Already have an account? <a href="/login">Login Here</a>
              </Typography>
            </Box>
          </Form>
        </Formik>
      </Box>
    </Grid>
  );
};
