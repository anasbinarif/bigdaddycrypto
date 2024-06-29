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
import { theme1, theme2 } from "../theme";
import { useTranslations } from "next-intl";
import { symbol } from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faD,
  faDownload,
  faEnvelope,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Dash1 from "./dash1/components/MainPage";
import dash1 from "../../../../public/assets/images/dash1.png";
import Dash2 from "./dash2/components/MainPageSecondDashboard";
import dash2 from "../../../../public/assets/images/dash2.png";
// import img_7_mogliche_Katastrophen_2023-2024 from "../../../../public/images/7_mogliche_Katastrophen_2023-2024.png"
import ThemeProviderWrapper from "./theme/ThemeProvider";
import { useAtom } from "jotai";
import { sessionAtom } from "../../stores/sessionStore";
import { useRouter } from "next/navigation";
import LoadingCircle from "../../../components/loading/Loading";

const Dashboard = () => {
  const [width, setWidth] = useState(0);
  const router = useRouter();
  const [sessionJotai, setSession] = useAtom(sessionAtom);
  const [expandDashboard, setExpandDashboard] = useState({
    1: false,
    2: false,
  });
  const [pdfFiles, setPdfFiles] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    if (
      sessionJotai?.user?.billingCycle !== "yearly" ||
      sessionJotai?.user?.subscriptionPlan === "free"
    )
      router.push("/");

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    const fetchPDFFiles = async () => {
      try {
        const res = await fetch("/api/getPdfFiles");
        // console.log(res);
        if (!res.ok) throw new Error("Failed to fetch PDF files");

        const resData = await res.json();
        setPdfFiles(resData.data);
      } catch (error) {
        console.error("Error fetching PDF files:", error);
      }
    };

    fetchPDFFiles();
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // console.log(pdfFiles);

  const handleExpandDashboard = (dashboardNum) => {
    // console.log(DashboardNum, !expandDashboard[DashboardNum]);
    setExpandDashboard({
      ...expandDashboard,
      [dashboardNum]: !expandDashboard[dashboardNum],
    });
  };

  const handleDownload = (filename) => {
    const downloadUrl = "/PDFs" + "/" + filename;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  console.log(sessionJotai);

  return (
    <>
      <LayoutWrapper>
        <SessionProvider>
          {!sessionJotai?.user ? (
            <Box sx={{ height: "calc(100vh - 8rem)" }}>
              <LoadingCircle />
            </Box>
          ) : (
            <>
              {sessionJotai?.user?.subscriptionPlan === "Premium" && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    padding: "8rem 3rem 4rem",
                    position: "relative",
                    gap: "1rem",
                    "@media only screen and (max-width: 900px)": {
                      flexDirection: "column",
                      columnGap: 0,
                    },
                  }}
                >
                  <Box
                    sx={{
                      // position: "relative",
                      width: "calc(50% - 0.5rem)",
                      "@media only screen and (max-width: 900px)": {
                        width: "100%",
                      },
                    }}
                  >
                    <Typography
                      component="h3"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "2.5rem",
                        mb: "1rem",
                        "@media only screen and (max-width: 1200px)": {
                          fontSize: "2rem",
                        },
                        "@media only screen and (max-width: 1000px)": {
                          fontSize: "1.5rem",
                        },
                        "@media only screen and (max-width: 900px)": {
                          fontSize: "2rem",
                        },
                        "@media only screen and (max-width: 600px)": {
                          fontSize: "1.5rem",
                        },
                      }}
                    >
                      Rise and Fall dashboard
                    </Typography>
                    <Box
                      sx={{
                        padding: "1rem",
                        border: expandDashboard[1]
                          ? "none"
                          : "3px solid var(--color-secondary)",
                        borderRadius: "15px",
                        transition: "all 500ms ease-in-out",
                        transformOrigin: "top left",
                        // transform: expandDashboard[1] ? "scale(1)" : "scale(0.3)",
                        height: expandDashboard[1] ? "auto" : "20rem",
                        width: expandDashboard[1] ? "100%" : "90%",
                        overflow: "hidden",
                        marginTop: expandDashboard[1] ? "5rem" : 0,
                        position: expandDashboard[1] ? "absolute" : "relative",
                        zIndex: expandDashboard[1] ? 100 : 10,
                        top: 0,
                        left: 0,

                        "& .MuiTypography-root": {
                          transformOrigin: "top left",
                          transform: expandDashboard[1]
                            ? "scale(1)"
                            : "scale(0.3)",
                        },
                      }}
                    >
                      <Button
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 15,
                          display: expandDashboard[1] ? "block" : "none",
                          color: "white",

                          "&:hover": {
                            color: "var(--color-secondary)",
                          },
                        }}
                        onClick={() => handleExpandDashboard(1)}
                      >
                        <FontAwesomeIcon
                          icon={faTimes}
                          style={{ fontSize: "1.5rem" }}
                        />
                      </Button>
                      <Box
                        onClick={() => handleExpandDashboard(1)}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "transparent",
                          zIndex: 10000,
                          cursor: "pointer",
                          display: expandDashboard[1] ? "none" : "block",

                          "& img": {},

                          "&:hover": {
                            backgroundColor: "red",
                          },
                        }}
                      >
                        <Image
                          src={dash1}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                      <Dash1 expanded={expandDashboard[1]} />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      // position: "relative",
                      width: "calc(50% - 0.5rem)",
                      "@media only screen and (max-width: 900px)": {
                        width: "100%",
                      },
                    }}
                  >
                    <Typography
                      component="h3"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "2.5rem",
                        mb: "1rem",
                        "@media only screen and (max-width: 1200px)": {
                          fontSize: "2rem",
                        },
                        "@media only screen and (max-width: 1000px)": {
                          fontSize: "1.5rem",
                        },
                        "@media only screen and (max-width: 900px)": {
                          fontSize: "2rem",
                        },
                        "@media only screen and (max-width: 600px)": {
                          fontSize: "1.5rem",
                        },
                      }}
                    >
                      Dashboard 2
                    </Typography>
                    <Box
                      sx={{
                        padding: "1rem",
                        border: expandDashboard[2]
                          ? "none"
                          : "3px solid var(--color-secondary)",
                        borderRadius: "15px",
                        transition: "all 500ms ease-in-out",
                        transformOrigin: "top right",
                        // transform: expandDashboard[1] ? "scale(1)" : "scale(0.3)",
                        height: expandDashboard[2] ? "auto" : "20rem",
                        width: expandDashboard[2] ? "100%" : "90%",
                        overflow: "hidden",
                        marginTop: expandDashboard[2] ? "5rem" : 0,
                        position: expandDashboard[2] ? "absolute" : "relative",
                        zIndex: expandDashboard[2] ? 100 : 10,
                        top: 0,
                        left: 0,

                        "& .MuiTypography-root": {
                          transformOrigin: "top left",
                          transform: expandDashboard[2]
                            ? "scale(1)"
                            : "scale(0.3)",
                        },
                      }}
                    >
                      <Button
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 15,
                          display: expandDashboard[2] ? "block" : "none",
                          color: "white",

                          "&:hover": {
                            color: "var(--color-secondary)",
                          },
                        }}
                        onClick={() => handleExpandDashboard(2)}
                      >
                        <FontAwesomeIcon
                          icon={faTimes}
                          style={{ fontSize: "1.5rem" }}
                        />
                      </Button>
                      <Box
                        onClick={() => handleExpandDashboard(2)}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          zIndex: 10000,
                          cursor: "pointer",
                          display: expandDashboard[2] ? "none" : "block",

                          "&:after": {
                            content: "",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                          },
                        }}
                      >
                        <Image
                          src={dash2}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                      <Dash2 expanded={expandDashboard[2]} />
                    </Box>
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  padding: "0 3rem",
                }}
              >
                <Typography
                  component="h3"
                  sx={{ fontWeight: "bold", fontSize: "2.5rem", mb: "1rem" }}
                >
                  General
                </Typography>
                <Box sx={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  {pdfFiles.map((el, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: "#00000080",
                          width: "calc(25% - 1.5rem)",
                          height: "15rem",
                          borderRadius: "15px",
                          transition: "all 300ms ease-in-out",
                          // cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          // padding: "2rem",
                          position: "relative",
                          overflow: "hidden",

                          "@media only screen and (max-width: 1000px)": {
                            width: "calc(33% - 1.3rem)",
                          },

                          "@media only screen and (max-width: 700px)": {
                            width: "calc(50% - 1rem)",
                          },

                          "@media only screen and (max-width: 500px)": {
                            width: "calc(100%)",
                          },

                          "& .MuiTypography-root": {
                            // textAlign: "center",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            // opacity: "0",
                            transition: "all 300ms ease-in-out",
                            // position: "absolute",
                            // top: "90%",
                            left: 20,
                            bottom: 20,

                            "@media only screen and (max-width: 1200px)": {
                              fontSize: "1rem",
                            },
                          },

                          "& > .MuiButton-root": {
                            opacity: 0,
                            pointerEvents: "none",
                          },

                          "&:hover": {
                            backgroundColor: "#000000ee",

                            "& > .MuiButton-root": {
                              opacity: 1,
                              pointerEvents: "auto",
                            },

                            "& .MuiTypography-root": {
                              // position: "relative",
                              // top: "50%",
                              // left: "50%",
                              // transform: "translate(-50%, -50%)",
                              textAlign: "center",
                              fontSize: "1.5rem",
                              opacity: 1,
                            },
                          },
                        }}
                      >
                        <Button
                          onClick={() => handleDownload(el)}
                          sx={{
                            backgroundColor: "#000000",
                            color: "#fff",
                            height: "3rem",
                            width: "3rem",
                            borderRadius: "10px",
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 1000,
                            transition: "all 300ms ease-in-out",
                          }}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </Button>
                        <Image
                          src={dash2}
                          width={100}
                          height={100}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            borderRadius: "15px",
                            background:
                              "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))",

                            "&:hover": {
                              backgroundColor: "#000000ee",

                              // "& > .MuiTypography-root": {
                              //   // position: "relative",
                              //   // top: "50%",
                              //   // left: "50%",
                              //   // transform: "translate(-50%, -50%)",
                              //   textAlign: "center",
                              //   fontSize: "1.5rem",
                              //   opacity: 1,
                              //   left: "50%",
                              //   transform: "translateX(-50%)",
                              // },
                            },
                          }}
                        >
                          <Typography
                            sx={{ position: "absolute", bottom: 10, left: 10 }}
                          >
                            {el.replace(/_/g, " ")}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                  {/* <Box
                sx={{
                  backgroundColor: "#00000080",
                  width: "calc(25% - 2rem)",
                  height: "15rem",
                  borderRadius: "15px",
                  transition: "all 300ms ease-in-out",
                  cursor: "pointer",

                  "&:hover": {
                    backgroundColor: "#000000ee",
                  },
                }}
              ></Box>
              <Box
                sx={{
                  backgroundColor: "#00000080",
                  width: "calc(25% - 2rem)",
                  height: "15rem",
                  borderRadius: "15px",
                  transition: "all 300ms ease-in-out",
                  cursor: "pointer",

                  "&:hover": {
                    backgroundColor: "#000000ee",
                  },
                }}
              ></Box> */}
                </Box>
              </Box>
            </>
          )}
        </SessionProvider>
      </LayoutWrapper>
    </>
  );
};

const DashBoardsPage = () => {
  return (
    <ThemeProviderWrapper>
      <Dashboard />
    </ThemeProviderWrapper>
  );
};

export default DashBoardsPage;
