import { alpha, createTheme, lighten, darken } from "@mui/material";
import "@mui/lab/themeAugmentation";

export const DarkGreyTheme = createTheme({
  colors: {
    textColor: "#fff",
    mainBackgroundColor: "#111826",
    lightBackgroundColor: "#202530",
  },
typography: {
    greenText: {
      color: 'green',
    },
    redText: {
      color: 'red',
    },
  },
});
