import { alpha, createTheme, lighten, darken } from "@mui/material";
import "@mui/lab/themeAugmentation";

export const PureLightTheme = createTheme({
  colors: {
    textColor: "#232423",
    mainBackgroundColor: "white",
    lightBackgroundColor: "#f5f5f5",
  },
  typography: {
    greenText: {
      color: "green",
    },
    redText: {
      color: "red",
    },
  },
});
