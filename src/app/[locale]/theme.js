"use client";
import { alpha, createTheme, lighten, darken } from "@mui/material";
// import { createTheme } from "@mui/material/styles";

const theme1 = createTheme({
  typography: {
    fontFamily: "sans-serif",
    greenText: {
      color: "green",
    },
    redText: {
      color: "red",
    },
    color: "white",
  },
  colors: {
    textColor: "#626ac7",
    mainBackgroundColor: "#111826",
    lightBackgroundColor: "#202530",
  },
});

export const theme2 = createTheme({
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
    textColor: "#626ac7",
    mainBackgroundColor: "#111826",
    lightBackgroundColor: "#202530",
  },
});

export default theme1;
