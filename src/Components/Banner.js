import React, { useState, useEffect } from "react";
import { fs } from "../Config/Config"; // Import your firestore instance
import { getDocs,collection } from "firebase/firestore";

export default function Banner() {
  const [bannerImage, setBannerImage] = useState("");

  useEffect(() => {
    const fetchBannerImage = async () => {
      try {
        const bannerCollectionRef = collection(fs, "banner");
        const bannerQuerySnapshot = await getDocs(bannerCollectionRef);
        
        if (!bannerQuerySnapshot.empty) {
          const firstBannerDocSnapshot = bannerQuerySnapshot.docs[0];
          const imageUrl = firstBannerDocSnapshot.data().imageUrl;
          setBannerImage(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching banner image: ", error);
      }
    };

    fetchBannerImage();
  }, []);

  const bannerStyles = {
    position: "relative",
    width: "100%",
    maxHeight: "400px",
    overflow: "hidden",
  };

  const imageStyles = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <div style={bannerStyles}>
      {bannerImage && <img style={imageStyles} src={bannerImage} alt="Banner" />}
    </div>
  );
}
