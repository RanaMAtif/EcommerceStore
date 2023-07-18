import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  {
    imgPath: require("../Images/Grocery.png").default,
  },
  {
    imgPath: require("../Images/Jewelry.png").default,
  },
  {
    imgPath: require("../Images/shoes.png").default,
  },
  {
    imgPath: require("../Images/tools.png").default,
  },
];

function Carousal() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ maxWidth: 1000, flexGrow: 1, mx: "auto" }}>
        <Paper 
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            width: "fit-content",
            pl: 6,
            bgcolor: "background.default",
          }}
        >
          <Typography>{images[activeStep].label}</Typography>
        </Paper>
        <AutoPlaySwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {images.map((step, index) => (
            <div key={step.label}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  component="img"
                  sx={{
                    height: "100%",
                    display: "block",
                    maxWidth: "100%",
                    overflow: "hidden",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  src={step.imgPath}
                  alt={step.label}
                />
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
      </Box>
    </Box>
  );
}

export default Carousal;
