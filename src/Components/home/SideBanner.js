import React, { useState, useEffect } from "react";
import { fs } from "../../Config/Config";
import { getDocs, collection } from "firebase/firestore";

export default function SideBanner({ side }) {
  const [sideBannerImage, setSideBannerImage] = useState("");
  const [sideBannerLink, setSideBannerLink] = useState("");

  useEffect(() => {
    const localStorageKeyImage = `${side}SideBannerImage`; // Unique key for image caching
    const localStorageKeyLink = `${side}SideBannerLink`;   // Unique key for link caching

    const fetchSideBannerData = async () => {
      try {
        // Check if the side banner image and link are cached in localStorage
        const cachedSideBannerImage = localStorage.getItem(localStorageKeyImage);
        const cachedSideBannerLink = localStorage.getItem(localStorageKeyLink);

        if (cachedSideBannerImage && cachedSideBannerLink) {
          setSideBannerImage(cachedSideBannerImage);
          setSideBannerLink(cachedSideBannerLink);
        } else {
          const sideBannerCollectionRefImage = collection(
            fs,
            "sideBanners",
            `${side}SideBanner`,
            "Image"
          );

          const sideBannerCollectionRefLink = collection(
            fs,
            "sideBanners",
            `${side}SideBanner`,
            "Link"
          );

          const sideBannerQuerySnapshotImage = await getDocs(
            sideBannerCollectionRefImage
          );

          const sideBannerQuerySnapshotLink = await getDocs(
            sideBannerCollectionRefLink
          );

          if (
            !sideBannerQuerySnapshotImage.empty &&
            !sideBannerQuerySnapshotLink.empty
          ) {
            const firstSideBannerDocSnapshotImage =
              sideBannerQuerySnapshotImage.docs[0];
            const dataImage = firstSideBannerDocSnapshotImage.data();

            const firstSideBannerDocSnapshotLink =
              sideBannerQuerySnapshotLink.docs[0];
            const dataLink = firstSideBannerDocSnapshotLink.data();

            const imageUrl = dataImage.imageUrl;
            const link = dataLink.link;

            // Cache the side banner image and link in localStorage
            localStorage.setItem(localStorageKeyImage, imageUrl);
            localStorage.setItem(localStorageKeyLink, link);

            setSideBannerImage(imageUrl);
            setSideBannerLink(link);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${side} side banner data: `, error);
      }
    };

    fetchSideBannerData();
  }, [side]);

  const handleBannerClick = () => {
    if (sideBannerLink) {
      window.open(sideBannerLink, "_blank");
    }
  };

  const bannerStyles = {
    width: side === "left" || side === "right" ? "200px" : "100%",
    height: side === "left" || side === "right" ? "100%" : "300px",
  };

  if (side === "left" || side === "right") {
    bannerStyles.top = 0;
    bannerStyles.bottom = 0;
    bannerStyles[side] = 0;
  } else if (side === "leftBottom") {
    bannerStyles.left = 0;
    bannerStyles.bottom = 0;
  } else if (side === "rightBottom") {
    bannerStyles.right = 0;
    bannerStyles.bottom = 0;
  }

  const imageStyles = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    cursor: "pointer", // Change cursor to indicate the link is clickable
  };

  return (
    <div style={bannerStyles}>
      {sideBannerImage && (
        <div
          style={{ borderRadius: "10px", width: "200px" }}
          onClick={handleBannerClick}
        >
          <img
            style={imageStyles}
            src={sideBannerImage}
            alt={`${side}SideBanner`}
          />
        </div>
      )}
    </div>
  );
}
