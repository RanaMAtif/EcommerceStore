import React, { useState, useEffect } from "react";
import { fs } from "../../Config/Config"; // Import your Firestore instance
import { getDocs, collection } from "firebase/firestore";

export default function Banner() {
  const [bannerImage, setBannerImage] = useState("");

  const localStorageKey = "banner-image"; // Unique key for caching

  const fetchBannerImage = async () => {
    try {
      // Check if the banner image is cached in localStorage
      const cachedBannerImage = localStorage.getItem(localStorageKey);

      if (cachedBannerImage) {
        setBannerImage(cachedBannerImage);
      } else {
        const bannerCollectionRef = collection(fs, "banner");
        const bannerQuerySnapshot = await getDocs(bannerCollectionRef);

        if (!bannerQuerySnapshot.empty) {
          const firstBannerDocSnapshot = bannerQuerySnapshot.docs[0];
          const imageUrl = firstBannerDocSnapshot.data().imageUrl;

          // Cache the banner image in localStorage
          localStorage.setItem(localStorageKey, imageUrl);
          setBannerImage(imageUrl);
        } else {
          console.error("No banner image documents found in Firestore.");
        }
      }
    } catch (error) {
      console.error("Error fetching banner image: ", error);
    }
  };

  useEffect(() => {
    fetchBannerImage();
  }, []);

  const bannerStyles = {
    position: "initial",
    width: "100%",
    maxHeight: "fit-Content",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
  };

  const imageStyles = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  return (
    <div style={bannerStyles}>
      {bannerImage && (
        <img style={imageStyles} src={bannerImage} alt="Banner" />
      )}
    </div>
  );
}
