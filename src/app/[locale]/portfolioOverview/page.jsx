"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Allocation from "../../../../public/assets/images/Allocation.webp";
import Image from "next/image";
import Checkout from "../../../components/oneTimePayment/OneTimePaymentCheckout";
import CustomizedSteppers from "./CustomizedSteppers";
import { usePathname, useRouter } from "next/navigation";
import styles from "./page.module.css";
// import { transform } from "next/dist/build/swc";

const steps = [
  "Wieviele Assets hast du in deinem Portfolio?",
  "Wie viel Euro hast du bereits in Kryptos investiert?",
  "Wieviele X willst du mit deinem Portfolio von hier aus erreichen?",
  "Ihr Angebot wird in Kürze erstellt",
];

const transitionStyles = (activeNum) => {
  const centerNum = 100 * activeNum;
  const rightNum = centerNum * -1 + 100;
  const leftNum = centerNum * -1 - 100;

  const styles = {
    left: { opacity: 0, transform: `translateX(${leftNum}%)` },
    center: {
      opacity: 1,
      transform: `translateX(${centerNum !== 0 && "-"}${centerNum}%)`,
    },
    right: { opacity: 0, transform: `translateX(${rightNum}%)` },
  };

  return styles;
};

const PortfolioForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeHeight, setActiveHeight] = useState("auto");
  const sliderRef = useRef(null);
  const [visitorString, setVisitorString] = useState("dummyVisitorString");
  const [userComment, setUserComment] = useState(
    "This is a sample user comment."
  );
  const [missingCoins, setMissingCoins] = useState(
    "Sample missing coins data."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    assets: "",
    investment: "",
    target: "",
  });
  const [showNext, setShowNext] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      const children = sliderRef.current.childNodes;
      let height = "auto";
      children.forEach((el) => {
        const list = Array.from(el.classList);
        if (list.includes("active")) {
          console.log;
          setActiveHeight(el.childNodes[0].clientHeight + 20);
        }
      });
    }
  }, [activeStep]);
  //   console.log(activeElRef.current.clientHeight);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    updateUrl(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setShowNext(true);
    updateUrl(activeStep - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
  };

  const handleSelection = (step, value) => {
    setPortfolioData({
      ...portfolioData,
      [step]: value,
    });
    setTimeout(handleNext, 200);
  };

  const updateUrl = (step) => {
    const currentPathname = pathname || "";
    router.push(`${currentPathname}?step=${step}`, undefined, {
      shallow: true,
    });
  };

  const transStyles = transitionStyles(activeStep);
  //   console.log(transStyles);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // console.log(steps);

  return (
    <Container>
      <Box
        my={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Box
          elevation={3}
          style={{
            padding: 16,
            backgroundColor: "transparent",
            color: "white",
            borderRadius: 12,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "none",
          }}
        >
          <Box
            sx={{
              overflow: "hidden",
              height: activeHeight,
              transition: `all 300ms ease-in-out`,
            }}
          >
            <form
              onSubmit={handleSubmit}
              ref={sliderRef}
              style={{
                display: "flex",
                width: "400%",
                height: activeHeight,
                transition: "all 300ms ease-in-out",
              }}
            >
              {/* {activeStep === 0 && ( */}
              <Box
                mt={2}
                textAlign="center"
                className={activeStep === 0 ? "active" : ""}
                sx={{
                  width: "25%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  transition: `all 300ms ease-in-out`,
                  ...transStyles[
                    activeStep > 0
                      ? "left"
                      : activeStep === 0
                      ? "center"
                      : "right"
                  ],
                  // transition: "all 0.4s ease-in-out",
                  // opacity: activeStep === 0 ? 1 : 0,
                  // height: activeStep === 0 ? "auto" : 0,
                }}
                // className={activeStep === 0 && styles.animate}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      whiteSpace: "nowrap",
                      fontSize: "1.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    Wieviele Assets hast du in deinem Portfolio?
                  </Typography>

                  <Grid container spacing={5} mt={2} mb={6}>
                    {["1-15", "16-25", "26-35", "36+"].map((label) => (
                      <Grid item key={label} sx={{ width: "25%" }}>
                        <Paper
                          onClick={() => handleSelection("assets", label)}
                          sx={{
                            width: "100%",
                            p: 2,
                            cursor: "pointer",
                            textAlign: "center",
                            backgroundColor: "#202530",
                            //   portfolioData.assets === label
                            //     ? "#333333"
                            //     : "#202530",
                            color: "#ffffff",
                            //   portfolioData.assets === label
                            //     ? "#ffbf00"
                            //     : "#ffffff",
                            border:
                              portfolioData.assets === label
                                ? "2px solid #ffbf00"
                                : "2px solid transparent",
                            borderRadius: 2,
                            // width: 180,
                            height: 200,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            "&:hover": {
                              boxShadow: !(portfolioData.assets === label)
                                ? "0 8px 48px -16px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(232, 176, 27, 0.35);"
                                : "",
                            },
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              color: "#E8B01B",
                              fontSize: "1.8rem",
                              fontWeight: "bold",
                              mb: "1.5rem",
                              color:
                                portfolioData.assets === label
                                  ? "#ffbf00"
                                  : "#ffffff",
                            }}
                          >
                            {label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
                          >
                            Assets
                          </Typography>
                          {portfolioData.assets === label && (
                            <CheckCircleIcon
                              style={{
                                color: "#43B97F",
                                marginTop: 8,
                                position: "absolute",
                                top: "8px",
                                right: "10px",
                              }}
                            />
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
              {/* )} */}
              {/* {activeStep === 1 && ( */}
              <Box
                mt={2}
                // sx={{ opacity: 0 }}
                className={activeStep === 1 ? "active" : ""}
                sx={{
                  width: "25%",
                  transition: `all 300ms ease-in-out`,
                  opacity: 0,
                  ...transStyles[
                    activeStep > 1
                      ? "left"
                      : activeStep === 1
                      ? "center"
                      : "right"
                  ],
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontSize: "1.8rem", fontWeight: "bold" }}
                  >
                    Wie viel Euro hast du bereits in Kryptos investiert?
                  </Typography>

                  <Grid container spacing={2} justifyContent="center" mt={2}>
                    {[
                      "Unter 10.000 €",
                      "10.000 - 25.000 €",
                      "25.000 - 50.000 €",
                      "50.000 - 100.000 €",
                      "100.000 - 200.000 €",
                      "200.000 - 400.000 €",
                      "400.000 - 750.000 €",
                      "750.000+",
                    ].map((label) => (
                      <Grid item key={label} xs={6} sm={3}>
                        <Paper
                          onClick={() => handleSelection("investment", label)}
                          sx={{
                            p: 2,
                            cursor: "pointer",
                            textAlign: "center",
                            backgroundColor:
                              portfolioData.investment === label
                                ? "#333333"
                                : "#202530",
                            color:
                              portfolioData.investment === label
                                ? "#ffffff"
                                : "#ffffff",
                            border:
                              portfolioData.investment === label
                                ? "2px solid #ffbf00"
                                : "2px solid transparent",
                            borderRadius: 2,
                            height: 60,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            "&:hover": {
                              boxShadow: !(portfolioData.investment === label)
                                ? "0 8px 48px -16px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(232, 176, 27, 0.35);"
                                : "",
                            },
                          }}
                        >
                          {portfolioData.investment === label && (
                            <CheckCircleIcon
                              style={{
                                color: "#43B97F",
                                position: "absolute",
                                left: "1rem",
                              }}
                            />
                          )}
                          <Typography variant="body1" whiteSpace="nowrap">
                            {label}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
              {/* )} */}
              {/* {activeStep === 2 && ( */}
              <Box
                mt={2}
                className={activeStep === 2 ? "active" : ""}
                sx={{
                  width: "25%",
                  transition: `all 300ms ease-in-out`,
                  opacity: 0,
                  ...transStyles[
                    activeStep > 2
                      ? "left"
                      : activeStep === 2
                      ? "center"
                      : "right"
                  ],
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontSize: "1.8rem", fontWeight: "bold" }}
                  >
                    Wieviele X willst du mit deinem Portfolio von hier aus
                    erreichen?
                  </Typography>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    mt={2}
                    sx={{ width: "100%" }}
                  >
                    {["10x", "20x", "30x", "50x", "100x"].map((label) => (
                      <Grid item key={label} sx={{ width: "20%" }}>
                        <Paper
                          onClick={() => handleSelection("target", label)}
                          sx={{
                            p: 2,
                            cursor: "pointer",
                            textAlign: "center",
                            backgroundColor:
                              portfolioData.target === label
                                ? "#333333"
                                : "#202530",
                            color:
                              portfolioData.target === label
                                ? "#ffbf00"
                                : "#ffffff",
                            border:
                              portfolioData.target === label
                                ? "2px solid #ffbf00"
                                : "2px solid transparent",
                            borderRadius: 2,
                            width: 180,
                            height: 150,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            "&:hover": {
                              boxShadow: !(portfolioData.target === label)
                                ? "0 8px 48px -16px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(232, 176, 27, 0.35);"
                                : "",
                            },
                          }}
                        >
                          <Typography variant="h4" sx={{ color: "#E8B01B" }}>
                            {label}
                          </Typography>
                          {portfolioData.target === label && (
                            <CheckCircleIcon
                              style={{
                                color: "#43B97F",
                                marginTop: 8,
                                position: "absolute",
                                top: "8px",
                                right: "10px",
                              }}
                            />
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
              {/* )} */}
              {/* {activeStep === 3 && ( */}
              <Box
                mt={2}
                className={activeStep === 3 ? "active" : ""}
                sx={{
                  width: "25%",
                  transition: `all 300ms ease-in-out`,
                  opacity: 0,
                  ...transStyles[
                    activeStep > 3
                      ? "left"
                      : activeStep === 3
                      ? "center"
                      : "right"
                  ],
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Image
                      src={Allocation}
                      alt="Allocation"
                      placeholder="blur"
                      style={{
                        borderRadius: 10,
                        width: "300px",
                        height: "300px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                      Lass dein Portfolio von Big Daddy Crypto bewerten.
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Beachte bitte, dass immer nur eine begrenzte Anzahl an
                      Portfolios bearbeitet werden können.
                    </Typography>
                    <TextField
                      fullWidth
                      id="portfolioID"
                      label="Portfolio-ID"
                      variant="outlined"
                      value={visitorString}
                      // disabled
                      margin="normal"
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        style: { color: "white" },
                      }}
                      sx={{
                        color: "white",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "white",
                          },
                          "&:hover fieldset": {
                            borderColor: "white",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      id="userComment"
                      label="Kommentare/Anmerkungen"
                      variant="outlined"
                      multiline
                      rows={4}
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      margin="normal"
                      required
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        style: { color: "white" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "white",
                          },
                          "&:hover fieldset": {
                            borderColor: "white",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      id="missingCoins"
                      label="Notiere Postitionen, die es nicht im Generator gab"
                      variant="outlined"
                      multiline
                      rows={4}
                      value={missingCoins}
                      onChange={(e) => setMissingCoins(e.target.value)}
                      margin="normal"
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        style: { color: "white" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "white",
                          },
                          "&:hover fieldset": {
                            borderColor: "white",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        color: "white",
                        mt: 2,
                        backgroundColor: "#ffbf00",
                        "&:hover": {
                          backgroundColor: "#403002",
                        },
                      }}
                      onClick={() => setOpen(true)}
                    >
                      Kommentar anfordern
                    </Button>
                  </Grid>
                </Grid>
                <Checkout open={open} handleClose={() => setOpen(false)} />
              </Box>
              {/* )} */}
            </form>
          </Box>
          {/* {activeStep > 0 && ( */}
          {/* <Box
            mt={2}
            display="flex"
            justifyContent="center"
            sx={{
              mt: "2rem",
              opacity: activeStep > 0 ? 1 : 0,
              transition: "all 300ms ease-in-out",
            }}
          >
            <CustomizedSteppers activeStep={activeStep} steps={steps} />
          </Box> */}
          {/* )} */}
          <Box
            mt={5}
            display="flex"
            justifyContent={activeStep === 0 ? "flex-end" : "space-between"}
          >
            {/* {activeStep !== 0 && ( */}
            <Button
              color="inherit"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                color: "#E8B01B",
                background: "#3C3623",
                padding: "1em 1.5em",
                borderRadius: "12px",
                transition: "all 300ms ease-in-out",
                opacity: activeStep > 0 ? 1 : 0,
                "&:hover": {
                  color: "#0F2242",
                  background: "#e8b01b",
                },
              }}
            >
              Zurück
            </Button>
            {/* )} */}
            {/* {activeStep > 0 && ( */}
            <Box
              mt={2}
              display="flex"
              justifyContent="center"
              sx={{
                width: "100%",
                mt: "2rem",
                opacity: activeStep > 0 ? 1 : 0,
                transition: "all 300ms ease-in-out",
              }}
            >
              <div
                className="progress-bar"
                style={{
                  backgroundColor: "rgba(229, 229, 229, 0.5)",
                  width: "85%",
                  height: "10px",
                  borderRadius: "20px",
                }}
              >
                {/* Progress text */}
                <div
                  className="progress-bar"
                  style={{
                    backgroundColor: "#43B97F",
                    width: `${(activeStep / steps.length) * 100}%`,
                    height: "10px",
                    borderRadius: "20px",
                    transition: "all 300ms ease-in-out",
                  }}
                >
                  {/* Progress text */}
                </div>
              </div>
              {/* <CustomizedSteppers activeStep={activeStep} steps={steps} /> */}
            </Box>
            {/* )} */}
            {/* {showNext && activeStep < steps.length - 1 && ( */}
            <Button
              color="inherit"
              onClick={handleNext}
              sx={{
                color: "#E8B01B",
                textTransform: "none",
                fontWeight: "bold",
                background: "#3C3623",
                padding: "1em 2.5em",
                borderRadius: "12px",
                transition: "all 300ms ease-in-out",
                opacity: showNext && activeStep < steps.length - 1 ? 1 : 0,
                "&:hover": {
                  color: "#0F2242",
                  background: "#e8b01b",
                },
              }}
            >
              Nächster Schritt
            </Button>
            {/* )} */}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default PortfolioForm;