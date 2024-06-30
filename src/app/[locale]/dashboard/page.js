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
  Snackbar,
  Alert,
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
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import Dash1 from "./dash1/components/MainPage";
import dash1 from "../../../../public/assets/images/dash1.png";
import Dash2 from "./dash2/components/MainPageSecondDashboard";
import dash2 from "../../../../public/assets/images/dash2.png";
import img_7_mogliche_Katastrophen_2023_2024 from "../../../../public/assets/images/7_mogliche_Katastrophen_2023_2024.png";
import img_1000x_Anstiege_und_was_sie_ausgemacht_hat from "../../../../public/assets/images/1000x_Anstiege_und_was_sie_ausgemacht_hat.png";
import img_Abfalle_nach_Altcoin_Season_New_Anita_AbuLuffy_BD1 from "../../../../public/assets/images/Abfalle_nach_Altcoin_Season_New_Anita_AbuLuffy_BD1.png";
import img_Abfalle_nach_Altcoin_Season__ft_Anita_Mario_Ben from "../../../../public/assets/images/Abfalle_nach_Altcoin_Season__ft_Anita_Mario_Ben.png";
import img_Aktien_vs_Cryptos_kryptos from "../../../../public/assets/images/Aktien_vs_Cryptos_kryptos.png";
import img_alt_season from "../../../../public/assets/images/alt_season.png";
import img_ATH_nicht_wieder_erreicht_5_grunde from "../../../../public/assets/images/ATH_nicht_wieder_erreicht_5_grunde.png";
import img_BTC_vs_altcoins_fertig from "../../../../public/assets/images/BTC_vs_altcoins_fertig.png";
import img_BTC_vs_Altcoin_Spateinsteiger from "../../../../public/assets/images/BTC_vs_Altcoin_Spateinsteiger.png";
import img_DEX_vs_Smart_Contract_Anita_Abu_Luffy_Low_to_High_1 from "../../../../public/assets/images/DEX_vs_Smart_Contract_Anita_Abu_Luffy_Low_to_High_1.png";
import img_Diversifizierung_big_daddy_niveau_2 from "../../../../public/assets/images/Diversifizierung_big_daddy_niveau_2.png";
import img_Diversifizierung_big_daddy_niveau_2_wie_spat_ist_zu_spat from "../../../../public/assets/images/Diversifizierung_big_daddy_niveau_2_wie_spat_ist_zu_spat.png";
import img_Diversifizierung_Ungleichgewichtung_Studie from "../../../../public/assets/images/Diversifizierung_Ungleichgewichtung_Studie.png";
import img_Marketcap_Gruppen_Risk_Reward_richtig from "../../../../public/assets/images/Marketcap_Gruppen_Risk_Reward_richtig.png";
import img_Smart_Contract_Plattformen from "../../../../public/assets/images/Smart_Contract_Plattformen.png";
import img_spekulant_oder_investor from "../../../../public/assets/images/spekulant_oder_investor.png";
import img_studie_ath from "../../../../public/assets/images/studie_ath.png";
import img_studie_ATH_zeiten from "../../../../public/assets/images/studie_ATH_zeiten.png";

import ThemeProviderWrapper from "./theme/ThemeProvider";
import { useAtom } from "jotai";
import { sessionAtom } from "../../stores/sessionStore";
import { useRouter } from "next/navigation";
import LoadingCircle from "../../../components/loading/Loading";

const imageMap = {
  "7_mogliche_Katastrophen_2023_2024.png":
    img_7_mogliche_Katastrophen_2023_2024,
  "1000x_Anstiege_und_was_sie_ausgemacht_hat.png":
    img_1000x_Anstiege_und_was_sie_ausgemacht_hat,
  "Abfalle_nach_Altcoin_Season_New_Anita_AbuLuffy_BD1.png":
    img_Abfalle_nach_Altcoin_Season_New_Anita_AbuLuffy_BD1,
  "Abfalle_nach_Altcoin_Season__ft_Anita_Mario_Ben.png":
    img_Abfalle_nach_Altcoin_Season__ft_Anita_Mario_Ben,
  "Aktien_vs_Cryptos_kryptos.png": img_Aktien_vs_Cryptos_kryptos,
  "alt_season.png": img_alt_season,
  "ATH_nicht_wieder_erreicht_5_grunde.png":
    img_ATH_nicht_wieder_erreicht_5_grunde,
  "BTC_vs_altcoins_fertig.png": img_BTC_vs_altcoins_fertig,
  "BTC_vs_Altcoin_Spateinsteiger.png": img_BTC_vs_Altcoin_Spateinsteiger,
  "DEX_vs_Smart_Contract_Anita_Abu_Luffy_Low_to_High_1.png":
    img_DEX_vs_Smart_Contract_Anita_Abu_Luffy_Low_to_High_1,
  "Diversifizierung_big_daddy_niveau_2.png":
    img_Diversifizierung_big_daddy_niveau_2,
  "Diversifizierung_big_daddy_niveau_2_wie_spat_ist_zu_spat.png":
    img_Diversifizierung_big_daddy_niveau_2_wie_spat_ist_zu_spat,
  "Diversifizierung_Ungleichgewichtung_Studie.png":
    img_Diversifizierung_Ungleichgewichtung_Studie,
  "Marketcap_Gruppen_Risk_Reward_richtig.png":
    img_Marketcap_Gruppen_Risk_Reward_richtig,
  "Smart_Contract_Plattformen.png": img_Smart_Contract_Plattformen,
  "spekulant_oder_investor.png": img_spekulant_oder_investor,
  "studie_ath.png": img_studie_ath,
  "studie_ATH_zeiten.png": img_studie_ATH_zeiten,
};

const Dashboard = () => {
  const [width, setWidth] = useState(0);
  const router = useRouter();
  const [sessionJotai, setSession] = useAtom(sessionAtom);
  const [expandDashboard, setExpandDashboard] = useState({
    1: false,
    2: false,
  });
  const [pdfFiles, setPdfFiles] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();

  useEffect(() => {
<<<<<<< HEAD
    // if (
    //   sessionJotai?.user?.billingCycle !== "yearly" ||
    //   sessionJotai?.user?.subscriptionPlan === "free"
    // )
    //   router.push("/");
=======
>>>>>>> origin/master

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
    if (
      sessionJotai?.user?.subscriptionPlan !== "Premium" ||
      sessionJotai?.user?.billingCycle !== "yearly"
    ) {
      setError(
        "To access the dashboards, please subscribe to the premium yearly plan"
      );
      setAlertOpen(true);
      setTimeout(() => {
        setError("");
        setAlertOpen(false);
      }, 1500);
      return;
    }
    setExpandDashboard({
      ...expandDashboard,
      [dashboardNum]: !expandDashboard[dashboardNum],
    });
  };

  const handleDownload = (filename) => {
    if (
      sessionJotai?.user?.subscriptionPlan === "free" ||
      sessionJotai?.user?.billingCycle !== "yearly"
    ) {
      setError(
        "To download a pdf, please subscribe to the pro/premium yearly plan"
      );
      setAlertOpen(true);
      setTimeout(() => {
        setError("");
        setAlertOpen(false);
      }, 1500);
      return;
    }
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
              <Box
                sx={{
                  padding: "8rem 3rem 3rem",
                  "& .MuiTypography-root": {
                    fontSize: "4rem",
                    fontWeight: "bold",
                    color: "var(--color-secondary)",
                    textTransform: "uppercase",
                  },
                }}
              >
                <Typography component="h1">Bullrun 2021</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  padding: "0 3rem 4rem",
                  position: "relative",
                  gap: "3rem",
                  "@media only screen and (max-width: 900px)": {
                    flexDirection: "column",
                    columnGap: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    // position: "relative",
                    width: "calc(50% - 1.5rem)",
                    "@media only screen and (max-width: 900px)": {
                      width: "100%",
                    },
                  }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: "2.5rem",
                      mb: "1.5rem",
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
                    <FontAwesomeIcon
                      icon={faCrown}
                      style={{
                        paddingLeft: "1rem",
                        opacity: "0.5",
                        fontSize: "1.25rem",
                      }}
                      color={
                        sessionJotai?.user?.subscriptionPlan === "Premium" &&
                        sessionJotai?.user?.billingCycle === "yearly"
                          ? "gold"
                          : "grey"
                      }
                    />
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
                      width: "100%",
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
                    width: "calc(50% - 1.5rem)",
                    "@media only screen and (max-width: 900px)": {
                      width: "100%",
                    },
                  }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: "2.5rem",
                      mb: "1.5rem",
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
                    <FontAwesomeIcon
                      icon={faCrown}
                      style={{
                        paddingLeft: "1rem",
                        opacity: "0.5",
                        fontSize: "1.25rem",
                      }}
                      color={
                        sessionJotai?.user?.subscriptionPlan === "Premium" &&
                        sessionJotai?.user?.billingCycle === "yearly"
                          ? "gold"
                          : "grey"
                      }
                    />
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
                      width: "100%",
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

              <Box
                sx={{
                  padding: "0 3rem",
                }}
              >
                <Typography
                  component="h3"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "2.5rem",
                    mb: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  General
                  <FontAwesomeIcon
                    icon={faCrown}
                    style={{
                      paddingLeft: "1rem",
                      opacity: "0.5",
                      fontSize: "1.25rem",
                    }}
                    color={
                      sessionJotai?.user?.subscriptionPlan !== "free" &&
                      sessionJotai?.user?.billingCycle === "yearly"
                        ? "gold"
                        : "grey"
                    }
                  />
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: "2rem",
                    flexWrap: "wrap",
                    mb: "2rem",
                  }}
                >
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
                            backgroundColor: "#00000033",
                            color: "var(--color-secondary)",
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
                          src={imageMap[`${el.replace(/\.pdf$/, "")}.png`]}
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
                              background:
                                "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9))",

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
          <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={() => setAlertOpen(false)}
          >
            <Alert
              onClose={() => setAlertOpen(false)}
              severity="info"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>
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
