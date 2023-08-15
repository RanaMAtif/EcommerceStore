import React from "react";
import { useState, useEffect } from "react";
import Carousal from "./carousal/Carousal";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Banner from "./Banner";
import ProductOfMonth from "./ProductOfMonth";
import SideBanner from "./SideBanner";
import { Navbar } from "./navigationBar/Navbar";
import { doc, getDoc } from "firebase/firestore";
import { fs } from "../Config/Config";
import { Footer } from "./footer/Footer";

const footerStyle = {
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
  zIndex: 1,
};

export default function LandingPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDocRef = doc(fs, "users", authUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUser({
              firstName: userData.FirstName,
              email: authUser.email,
              uid: authUser.uid,
            });
          } else {
            console.log(
              "User document does not exist or is missing required field"
            );
            setUser(null);
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div>
      <Navbar user={user} />
      <div>
        <Carousal />
        <Banner />
        <SideBanner />
        <ProductOfMonth />
      </div>
      <Footer style={footerStyle} />
    </div>
  );
}
 