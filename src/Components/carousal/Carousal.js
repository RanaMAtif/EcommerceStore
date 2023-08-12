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
    console.log("mount");
    const fetchImages = async () => {
      if (sub) {
        try {
          const storageRef = ref(storage, "carousel-images");
          const listResult = await listAll(storageRef);

          const imageUrls = await Promise.all(
            listResult.items.map(async (item) => {
              const url = await getDownloadURL(item);
              return { imgPath: url };
            })
          );

          setImages(imageUrls);
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
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        marginBottom: "300px",
      }}
    >
      <div style={{ maxWidth: "1000px", width: "100%", height: "300px" }}>
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
  );
}

export default Carousal;