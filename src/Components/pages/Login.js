import React, { useState, useEffect } from "react";
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router-dom";
import logsiga from "../../Images/logsiga.png";
import logsigb from "../../Images/logsigb.png";
import lodsigc from "../../Images/lodsigc.png";
import logsigd from "../../Images/logsigd.png";
import logsige from "../../Images/logsige.png";
import logsigf from "../../Images/logsigf.png";
import { fs } from "../../Config/Config";
import {
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../../redux/features/user/thunk";
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
  const [logoUrl, setLogoUrl] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userUid, setUserUid] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const [currentImageUrl, setCurrentImageUrl] = useState(
    imageUrls[Math.floor(Math.random() * imageUrls.length)]
  );
  useEffect(() => {
    setCurrentImageUrl(imageUrls[Math.floor(Math.random() * imageUrls.length)]);
  }, []);

  // Function to fetch user UID by email
  async function fetchUserId(email) {
    // Create a query to find the user document by email
    const usersCollection = collection(fs, "users");
    const q = query(usersCollection, where("Email", "==", email));

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        // No matching document found
        setUserUid(null); // Clear user UID in state
      } else {
        // Get the first matching document (assuming email is unique)
        const userDoc = querySnapshot.docs[0];
        // Access the document ID (which is the user UID)
        const uid = userDoc.id;
        // Use the callback form to ensure correct state update
        setUserUid((prevUserUid) => uid);
      }
    } catch (error) {
      console.error("Error fetching user UID:", error);
    }
  }
  const saveUserDataToFirestore = (firstName, lastName, email, uid) => {
    const userData = {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      UID: uid,
    };

    // Save user data in Firestore collection
    const usersCollectionRef = collection(fs, "users"); // Replace 'db' with your Firestore instance
    setDoc(doc(usersCollectionRef, uid), userData)
      .then(() => {
        // Redirect to the home page after successful login
        window.location.href = "/";
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };
  //Facebook log in
  const handleFacebookSignUp = () => {
    const provider = new FacebookAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const displayName = user.displayName;
        const [firstName, lastName] = displayName.split(" ");
        saveUserDataToFirestore(firstName, lastName, user.email, user.uid);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const displayName = user.displayName;
        const [firstName, lastName] = displayName.split(" ");
        const email = user.email;
        const uid = user.uid;
        saveUserDataToFirestore(firstName, lastName, email, uid);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };
  const handleLogin = async (values) => {
    const { email, password } = values;

    try {
      // Use signInWithEmailAndPassword from Firebase version 10
      await signInWithEmailAndPassword(auth, email, password);
      fetchUserId(email);
      setEmailError(false);
      setPasswordError(false);
      setSuccessMsg(
        "Login Successfull. You will get redirected to the Home page"
      );

      setTimeout(() => {
        setSuccessMsg("");
        history.push("/");
      }, 3000);
    } catch (error) {
      const errorCode = error.code;
      if (errorCode === "auth/wrong-password") {
        setPasswordError(true);
      } else {
        setEmailError(true);
      }
    }
  };

  const fetchImageURL = async () => {
    try {
      const docRef = doc(collection(fs, "LoginLogo"), "Image");
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

  useEffect(() => {
    if (userUid) {
      dispatch(fetchUserData(userUid)); // Dispatch fetchUserData when userUid is not null
    }
  }, [userUid, dispatch]);
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
          height: "20",
        }}
      >
        <img
          src={currentImageUrl}
          alt="Login"
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
                  <Button
                    onClick={handleGoogleSignIn}
                    fullWidth
                    variant="contained"
                    color="warning"
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Log In with Google
                  </Button>
                  <Button
                    onClick={handleFacebookSignUp}
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Log In with Facebook
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Form>
        </Formik>
      </Box>
    </Grid>
  );
};
