import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

function BackDrop({ open, title }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1, display:"flex", gap:3}}
      open={open}
    >
      <h1>{title}</h1>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default BackDrop;
