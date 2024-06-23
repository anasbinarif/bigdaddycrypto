import { useContext, useEffect, useRef, useState } from "react";
import { styled, Box, Tooltip } from "@mui/material";
import { ThemeContext } from "../../../theme/ThemeProvider";

import Fab from "@mui/material/Fab";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeSettingsButton = styled(Box)(
  ({ theme }) => `
          position: fixed;
          z-index: 9999;
          right: ${theme.spacing(4)};
          bottom: ${theme.spacing(4)};
          
          &::before {
              width: 30px;
              height: 30px;
              content: ' ';
              position: absolute;
              border-radius: 100px;
              left: 13px;
              top: 13px;
             
              background: ${
                theme === "DarkGreyTheme" ? "#fffff" : "rgb(255, 180, 0)"
              };
              animation: ripple 1s infinite;
              transition: ${theme.transitions.create(["all"])};
          }

          .MuiSvgIcon-root {
            animation: pulse 1s infinite;
            transition: ${theme.transitions.create(["all"])};
          }
  `
);

const ThemeSettings = () => {
  const ref = useRef(null);

  const setThemeName = useContext(ThemeContext);

  useEffect(() => {
    const curThemeName =
      window.localStorage.getItem("appTheme") || "DarkGreyTheme";
    setTheme(curThemeName);
  }, []);

  const [theme, setTheme] = useState("DarkGreyTheme");

  const changeTheme = (theme) => {
    setTheme(theme);
    setThemeName(theme);
  };

  return (
    <>
      <ThemeSettingsButton
        onClick={() => {
          theme === "DarkGreyTheme"
            ? changeTheme("PureLightTheme")
            : changeTheme("DarkGreyTheme");
        }}
      >
        <Tooltip
          arrow
          title={theme === "DarkGreyTheme" ? "Light Mode" : "Dark Mode"}
        >
          <Fab ref={ref} color="primary" aria-label="add">
            {theme === "DarkGreyTheme" ? <LightModeIcon /> : <DarkModeIcon />}
          </Fab>
        </Tooltip>
      </ThemeSettingsButton>
    </>
  );
};

export default ThemeSettings;
