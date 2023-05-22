import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function SplashScreen() {
  return (
    <Box className="splash-main">
      <CircularProgress className="splash-main-progress"/>
    </Box>
  );
}
