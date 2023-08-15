import React, { useState, useEffect } from "react";
import { fs } from "../Config/Config";
import { getDocs, collection } from "firebase/firestore";

export default function SideBanner() {
  const [sideBannerImage, setSideBannerImage] = useState("");

  useEffect(() => {
    const fetchSideBannerImage = async () => {
      try {
        const SideBannerCollectionRef = collection(fs, "sideBanner");
        const SideBannerQuerySnapshot = await getDocs(SideBannerCollectionRef);

        if (!SideBannerQuerySnapshot.empty) {
          const firstSideBannerDocSnapshot = SideBannerQuerySnapshot.docs[0];
          const imageUrl = firstSideBannerDocSnapshot.data().imageUrl;
          setSideBannerImage(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching banner image: ", error);
      }
    };

    fetchSideBannerImage();
  }, []);

  const bannerStyles = {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", // Adding a subtle shadow
    borderRadius: "10px", // Adding rounded corners
    overflow: "hidden",
    backgroundColor: "#f0f0f0", // Adding a background color
  };

  const imageStyles = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <div style={bannerStyles}>
      {sideBannerImage && <img style={imageStyles} src={sideBannerImage} alt="sideBanner" />}
    </div>
  );
}
