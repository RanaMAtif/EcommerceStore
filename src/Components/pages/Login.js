import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { object, string } from "yup";
import { auth } from "../../Config/Config";
import logsiga from "../../Images/logsiga.png";
import logsigb from "../../Images/logsigb.png";
import lodsigc from "../../Images/lodsigc.png";
import logsigd from "../../Images/logsigd.png";
import logsige from "../../Images/logsige.png";
import logsigf from "../../Images/logsigf.png";

const initialValues = {
  email: "",
  password: "",
};
const imageUrls = [logsiga, logsigb, lodsigc, logsigd, logsige, logsigf];

const validation = object({
  email: string().email("Invalid email address").required("Required"),
  password: string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export const Login = () => {
  const history = useHistory();

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [currentImageUrl, setCurrentImageUrl] = useState(
    imageUrls[Math.floor(Math.random() * imageUrls.length)]
  );
  useEffect(() => {
    setCurrentImageUrl(imageUrls[Math.floor(Math.random() * imageUrls.length)]);
  }, []);

  const handleLogin = (values) => {
    const { email, password } = values;

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setEmailError(false);
        setPasswordError(false);
        setSuccessMsg(
          "Login Successfull. You will get redirected to the Home page"
        );

        setTimeout(() => {
          setSuccessMsg("");
          history.push("/");
        }, 3000);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/wrong-password") {
          setPasswordError(true);
        } else {
          setEmailError(true);
        }
      });
  };

  return (
    <Grid
      sx={{
        my: 8,
        p: 1,
        mx: "auto",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { md: "center" },
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        maxWidth: "800px",
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
        <Typography component="h1" variant="h5" align="center">
          Log in
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
          onSubmit={(values) => handleLogin(values)}
        >
          <Form>
            <Box sx={{ mt: 1 }}>
              <Field
                as={TextField}
                label={"Email"}
                margin="normal"
                name={"email"}
                type="email"
                fullWidth
                required
              />
              <div style={{ color: "red", fontSize: "14px" }}>
                <ErrorMessage name="email" />
              </div>
              {emailError && (
                <Alert variant="outlined" severity="error">
                  Email address is not registered!
                </Alert>
              )}

              <Field
                as={TextField}
                label={"Password"}
                margin="normal"
                type="password"
                name={"password"}
                fullWidth
                required
              />

              {passwordError && (
                <Alert variant="outlined" severity="error">
                  Wrong password!
                </Alert>
              )}
              <div style={{ color: "red", fontSize: "14px" }}>
                <ErrorMessage name="password" />
              </div>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                LOGIN
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Typography variant="body2" align="center">
                    Dont have an account? <a href="/signup">SignUp Here</a>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Form>
        </Formik>
      </Box>
    </Grid>
  );
};
