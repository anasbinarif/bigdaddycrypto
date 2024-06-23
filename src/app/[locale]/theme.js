"use client";
import { alpha, createTheme, lighten, darken } from "@mui/material";
// import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "sans-serif",
    greenText: {
      color: "green",
    },
    redText: {
      color: "red",
    },
  },
  colors: {
    textColor: "#fff",
    mainBackgroundColor: "#111826",
    lightBackgroundColor: "#202530",
  },
});

export default theme;
