"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Slider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Button,
} from "@mui/material";
import Image from "next/image";
import Graph from "../../../../public/assets/svg/BDC-Graph.svg";
import { getAssetTest } from "../../../lib/data";
import LayoutWrapper from "../../../components/LayoutWrapper";
import { SessionProvider } from "next-auth/react";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import { symbol } from "prop-types";
import Dash1 from "./dash1/components/MainPage";
import Dash2 from "./dash2/components/MainPageSecondDashboard";
import DropdownWithSearch from "./dash1/components/DropdownWithSearch";

const Dashboard = () => {
  const [width, setWidth] = useState(0);
  const [expandDropdown, setExpandDropdown] = useState({ 1: false, 2: false });
  const theme = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleExpandDropdown = (dropDownNum) => {
    console.log(dropDownNum, !expandDropdown[dropDownNum]);
    setExpandDropdown({
      ...expandDropdown,
      [dropDownNum]: !expandDropdown[dropDownNum],
    });
  };

  console.log(expandDropdown);

  return (
    <>
      <LayoutWrapper>
        <SessionProvider>
          <Box
            sx={{ display: "flex", padding: "8rem 3rem", position: "relative" }}
          >
            <Box
              sx={{
                // position: "relative",
                width: "100%",
              }}
            >
              <Typography
                component="h3"
                sx={{ fontWeight: "bold", fontSize: "2.5rem", mb: "1rem" }}
              >
                Dashboard 1
              </Typography>
              <Box
                sx={{
                  padding: "1rem",
                  border: "3px solid var(--color-secondary)",
                  borderRadius: "15px",
                  transition: "all 500ms ease-in-out",
                  transformOrigin: "top left",
                  // transform: expandDropdown[1] ? "scale(1)" : "scale(0.3)",
                  height: expandDropdown[1] ? "auto" : "20rem",
                  width: expandDropdown[1] ? "100%" : "90%",
                  overflow: "hidden",
                  marginTop: expandDropdown[1] ? "5rem" : 0,
                  position: expandDropdown[1] ? "absolute" : "relative",
                  zIndex: expandDropdown[1] ? 100 : 10,
                  top: 0,
                  left: 0,

                  "& .MuiTypography-root": {
                    transformOrigin: "top left",
                    transform: expandDropdown[1] ? "scale(1)" : "scale(0.3)",
                  },
                }}
              >
                <Button
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 15,
                    display: expandDropdown[1] ? "block" : "none",
                  }}
                  onClick={() => handleExpandDropdown(1)}
                >
                  Close
                </Button>
                <Box
                  onClick={() => handleExpandDropdown(1)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                    zIndex: 10000,
                    cursor: "pointer",
                    display: expandDropdown[1] ? "none" : "block",

                    "&:hover": {
                      backgroundColor: "red",
                    },
                  }}
                ></Box>
                <Dash1 />
              </Box>
            </Box>
            <Box
              sx={{
                // position: "relative",
                width: "100%",
              }}
            >
              <Typography
                component="h3"
                sx={{ fontWeight: "bold", fontSize: "2.5rem", mb: "1rem" }}
              >
                Dashboard 2
              </Typography>
              <Box
                sx={{
                  padding: "1rem",
                  border: "3px solid var(--color-secondary)",
                  borderRadius: "15px",
                  transition: "all 500ms ease-in-out",
                  transformOrigin: "top right",
                  // transform: expandDropdown[1] ? "scale(1)" : "scale(0.3)",
                  height: expandDropdown[2] ? "auto" : "20rem",
                  width: expandDropdown[2] ? "100%" : "90%",
                  overflow: "hidden",
                  marginTop: expandDropdown[2] ? "5rem" : 0,
                  position: expandDropdown[2] ? "absolute" : "relative",
                  zIndex: expandDropdown[2] ? 100 : 10,
                  top: 0,
                  left: 0,

                  "& .MuiTypography-root": {
                    transformOrigin: "top left",
                    transform: expandDropdown[2] ? "scale(1)" : "scale(0.3)",
                  },
                }}
              >
                <Button
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 15,
                    display: expandDropdown[2] ? "block" : "none",
                  }}
                  onClick={() => handleExpandDropdown(2)}
                >
                  Close
                </Button>
                <Box
                  onClick={() => handleExpandDropdown(2)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                    zIndex: 10000,
                    cursor: "pointer",
                    display: expandDropdown[2] ? "none" : "block",

                    "&:hover": {
                      backgroundColor: "red",
                    },
                  }}
                ></Box>
                <Dash2 />
              </Box>
            </Box>
          </Box>
        </SessionProvider>
      </LayoutWrapper>
    </>
  );
};

export default Dashboard;
