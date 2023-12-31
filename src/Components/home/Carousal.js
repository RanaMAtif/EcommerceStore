import React, { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../Config/Config";

import { autoPlay } from "react-swipeable-views-utils";
import SwipeableViews from "react-swipeable-views";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function Carousal() {
  const [images, setImages] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let sub = true;
    const localStorageKey = "carousel-images"; // Unique key for caching

    const fetchImages = async () => {
      if (sub) {
        try {
          // Check if images are cached in localStorage
          const cachedImages = localStorage.getItem(localStorageKey);

          if (cachedImages) {
            setImages(JSON.parse(cachedImages));
          } else {
            const storageRef = ref(storage, "carousel-images");
            const listResult = await listAll(storageRef);

            const imageUrls = await Promise.all(
              listResult.items.map(async (item) => {
                const url = await getDownloadURL(item);
                return { imgPath: url };
              })
            );

            // Cache images in localStorage
            localStorage.setItem(localStorageKey, JSON.stringify(imageUrls));
            setImages(imageUrls);
          }
        } catch (error) {
          console.error("Error fetching images from Firebase Storage:", error);
        }
      }
    };

    fetchImages();

    return () => {
      console.log("unmount");
      sub = false;
    };
  }, []);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        position: "relative",
        alignItems: "flex-start",
        marginTop: "18%",
      }}
    >
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "20px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "auto",
          }}
        >
          {images.length > 0 ? (
            <AutoPlaySwipeableViews
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
            >
              {images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image.imgPath}
                    alt=""
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              ))}
            </AutoPlaySwipeableViews>
          ) : (
            <p>Loading</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Carousal;
