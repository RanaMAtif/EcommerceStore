import React, { useState, useEffect } from "react";
import { fs } from "../../Config/Config";
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
    top: 0, // Align to the top
    right: 0, // Align to the right
    width: "200px", // Set a specific width for the banner
    height: "100%", // Take full height
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  };

  const imageStyles = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <div style={bannerStyles}>
      {sideBannerImage && (
        <img style={imageStyles} src={sideBannerImage} alt="sideBanner" />
      )}
    </div>
  );
}
