"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Switch,
  SwitchProps,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import { fetchUserSubscriptionPlan } from "../../lib/data";
import { useAtom } from "jotai";
import { sessionAtom } from "../../app/stores/sessionStore";
import CurrentPlan from "./CurrentPlan";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import SubscribeDialog from "../../components/subscribeDialog/SubscribeDialog";
import { MySwitch } from "../../components/styledSwitch/styledSwitch";
import Link from "next/link";

const plans = [
  {
    title: "Free",
    price: "€0.00",
    features: ["max. 10 Coins in portfolio", "FAQ", "Mediathek"],
    nonFeatures: [
      "Favorite coins",
      "Blocklist",
      "Graph",
      "Import / Export CSV of Portfolio",
      "Access to all Dashboards (only in yearly subscription)",
      "Portfolio Generator Indicators",
      "Access to all Livestreams",
      "Add new coins to assets",
      "3 Sub Portfolios",
      "Access to VIP discord Channel and Telegram",
    ],
  },
  {
    title: "Pro",
    priceMonthly: "€29.95",
    priceYearly: "€24.95",
    yearlySavings: "€60.00",
    features: [
      "Unlimited Coins",
      "FAQ",
      "Mediathek (24 hours in advance)",
      "Favorite coins",
      "Blocklist",
      "Graph",
      "Import / Export CSV of Portfolio",
      "Access to small dashboards (only in yearly subscription)",
      "15% Discount on Portfolio commentary - Yearly subscription",
    ],
    nonFeatures: [
      "Portfolio Generator Indicators",
      "Access to all Livestreams",
      "Add new coins to assets",
      "3 Sub Portfolios",
      "Access to VIP discord Channel and Telegram",
    ],
  },
  {
    title: "Premium",
    priceMonthly: "€59.95",
    priceYearly: "€49.95",
    yearlySavings: "€120.00",
    features: [
      "Unlimited Coins",
      "FAQ",
      "Mediathek (24 hours in advance)",
      "Favorite coins",
      "Blocklist",
      "Graph",
      "Import / Export CSV of Portfolio",
      "Access to all Dashboards (only in yearly subscription)",
      "Portfolio Generator Indicators",
      "Access to all Livestreams",
      "Add new coins to assets",
      "3 Sub Portfolios",
      "Access to VIP discord Channel and Telegram",
      "20% Discount on Portfolio commentary - Yearly subscription",
    ],
    nonFeatures: [],
  },
];

const PricingPlans = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [sessionJotai] = useAtom(sessionAtom);
  const [userSubscription, setUserSubscription] = useState(null);
  const [open, setOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [acceptAgb, setAcceptAgb] = useState(false);
  const [acceptWider, setAcceptWider] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleBillingCycleChange = (event) => {
    setBillingCycle(event.target.checked ? "yearly" : "monthly");
  };

  useEffect(() => {
    const getUserSubscriptionPlan = async () => {
      const subscriptionData = await fetchUserSubscriptionPlan(
        sessionJotai?.user.id
      );
      setUserSubscription(subscriptionData);
    };
    getUserSubscriptionPlan();
  }, [sessionJotai]);

  useEffect(() => {
    console.log(
      "userSubscriptionuserSubscriptionuserSubscription",
      userSubscription
    );
  }, [userSubscription]);

  function handelSubModal() {
    // setOpen(true);
    setPromptOpen(true);
  }

  const handleClosePrompt = () => {
    setPromptOpen(false);
  };

  const handleAcceptPrompt = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <Box sx={{}}>
      <SubscribeDialog open={open} handleClose={handleClose} />
      <Container>
        {userSubscription && userSubscription?.plan !== "free" && (
          <CurrentPlan planDetails={userSubscription?.payment?.Subscription} />
        )}
        <Box textAlign="center" my={4}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              color: "white",
              fontSize: "5rem",
              fontWeight: "bold",
              "@media only screen and (max-width: 768px)": { fontSize: "3rem" },
            }}
          >
            Subscription Plans
          </Typography>
          <Box
            mb={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "@media only screen and (max-width: 600px)": {
                flexDirection: "column",
              },
              marginBottom: 8,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body1"
                style={{
                  color: billingCycle === "monthly" ? "#ffffff" : "#aaa",
                  marginRight: "8px",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                Monthly
              </Typography>
              <MySwitch
                checked={billingCycle === "yearly"}
                onChange={handleBillingCycleChange}
                color="primary"
                inputProps={{ "aria-label": "billing cycle switch" }}
                sx={{
                  ".MuiSwitch-switchBase.Mui-checked": {
                    color: "#ffffff",
                  },
                  ".MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#4caf50",
                  },
                }}
              />
              <Typography
                variant="body1"
                style={{
                  color: billingCycle === "yearly" ? "#ffffff" : "#aaa",
                  marginLeft: "8px",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                Annually
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              ml={2}
              p={1}
              bgcolor="var(--color-secondary-2)"
              borderRadius="5px"
              sx={{
                "@media only screen and (max-width:600px)": {
                  ml: 0,
                  mt: "1rem",
                },
              }}
            >
              <Typography variant="body2" style={{ color: "black" }}>
                16% off. Its like 60 days free
              </Typography>
              <IconButton size="small" sx={{ color: "white" }}>
                😍
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            "@media only screen and (max-width: 1100px)": {
              overflowX: "scroll",
              justifyContent: "flex-start",
            },
            "@media only screen and (max-width: 900px)": {
              flexDirection: "column",
              alignItems: "stretch",
            },
          }}
        >
          {plans.map((plan, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: "#202530",
                color: "white",
                borderRadius: "10px",
                position: "relative",
                flexBasis: 0,
                flexGrow: 1,
                flexShrink: 1,
                minWidth: "375px",
                "&:not(:last-child)": {
                  marginRight: "2rem",
                },
                "@media only screen and (max-width: 900px)": {
                  "&:not(:last-child)": {
                    marginRight: 0,
                    marginBottom: "2rem",
                  },
                  flexBasis: "auto",
                },
              }}
            >
              {userSubscription?.plan === plan.title && (
                <CheckCircleIcon
                  sx={{
                    color: "#4caf50",
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                />
              )}
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  align="center"
                  sx={{ m: "2rem 0", fontWeight: "bold" }}
                >
                  {plan.title}
                </Typography>
                <Typography
                  variant="h4"
                  component="p"
                  gutterBottom
                  align="center"
                  sx={{ fontSize: "3rem", fontWeight: "bold" }}
                >
                  {plan.title === "Free"
                    ? plan.price
                    : billingCycle === "monthly"
                    ? plan.priceMonthly
                    : plan.priceYearly}
                  {plan.title !== "Free" && (
                    <Typography variant="body1" component="span">
                      {/* /{billingCycle === "monthly" ? "month" : "year"} */}
                      /month
                    </Typography>
                  )}
                </Typography>
                {billingCycle === "yearly" && plan.title !== "Free" && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={2}
                    p={1}
                    bgcolor="#444"
                    borderRadius="5px"
                  >
                    <Typography variant="body2" style={{ color: "white" }}>
                      You save {plan.yearlySavings} a year
                    </Typography>
                    <IconButton size="small" sx={{ color: "white" }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
                {plan.title === "Pro" &&
                  !["Pro", "Premium"].includes(userSubscription?.plan) && (
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={handelSubModal}
                    >
                      Subscribe
                    </Button>
                  )}
                {plan.title === "Premium" &&
                  !["Pro", "Premium"].includes(userSubscription?.plan) && (
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={handelSubModal}
                    >
                      Subscribe
                    </Button>
                  )}
                <ul
                  style={{
                    paddingLeft: "0",
                    listStyleType: "none",
                    marginTop: "25px",
                  }}
                >
                  <Box sx={{ marginTop: "16px" }} />

                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CheckIcon sx={{ color: "white", marginRight: "8px" }} />
                      <Typography
                        variant="body1"
                        component="p"
                        style={{ color: "white" }}
                      >
                        {feature}
                      </Typography>
                    </li>
                  ))}

                  <Box sx={{ marginTop: "16px" }} />

                  {plan.nonFeatures.map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ClearIcon
                        sx={{ color: "#ffffff80", marginRight: "8px" }}
                      />
                      <Typography
                        variant="body1"
                        component="p"
                        style={{ color: "#ffffff80" }}
                      >
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
      <Dialog
        open={promptOpen}
        onClose={handleClosePrompt}
        // fullScreen={fullScreen}
        PaperProps={{
          onSubmit: handleAcceptPrompt,
          component: "form",
          sx: {
            width: { xs: "100%", sm: "90%", md: "70%" },
            maxWidth: "600px",
            backgroundColor: "#111826",
            color: "white",
            // padding: "1rem",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Please Verify</DialogTitle>
        <DialogContent
          sx={{
            "& .MuiTypography-root": { color: "white" },
            "& .MuiFormControl-root": {
              mb: 2,
              "& .MuiFormHelperText-root": {
                color: "#ffffff", // Helper text color
              },
              "& .MuiFilledInput-input": {
                color: "#fff",
                "&::placeholder": {
                  color: "#fff",
                },
              },
              "& .MuiInputBase-root": {
                "&.MuiFilledInput-root": {
                  "&::after": {
                    borderBottom: "2px solid var(--color-secondary)",
                  },
                },
              },
              "& .MuiInputBase-input": {
                height: "1.6em",
              },
              "& .MuiFormLabel-root": {
                color: "#ffffff80",
                "&.MuiInputLabel-root.Mui-focused": {
                  color: "var(--color-secondary)",
                },
              },
              "& .MuiFilledInput-root": {
                borderRadius: "8px",
                backgroundColor: "#202530",
                border: "1px solid #ffffff80",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                "&.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffffff",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffffff",
                },
              },
            },
          }}
        >
          {/* <DialogContentText>{t("changeText")}</DialogContentText> */}
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptAgb}
                onChange={(e) => setAcceptAgb(e.target.checked)}
                sx={{
                  "&.MuiCheckbox-root": {
                    color: "#ffffff80",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                    "&.Mui-checked": {
                      color: "var(--color-secondary)",
                    },
                  },
                }}
              />
            }
            label={
              <Typography>
                Ich habe die{" "}
                <Link
                  href="/policy/agb"
                  style={{ color: "var(--color-secondary)" }}
                >
                  Allgemeinen Geschäftsbedingungen (AGB)
                </Link>{" "}
                gelesen und akzeptiere sie."
              </Typography>
            }
            sx={{
              alignSelf: "flex-start",
              alignItems: "flex-start",
              mb: "1rem",
              "& .MuiButtonBase-root": {
                padding: "0 10px",
                // ml: "10px",
              },
              "& .MuiTypography-root": {
                color: "#ffffff80",
                fontSize: "14px", // Set desired font size here
                textAlign: "left",
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptWider}
                onChange={(e) => setAcceptWider(e.target.checked)}
                sx={{
                  "&.MuiCheckbox-root": {
                    color: "#ffffff80",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                    "&.Mui-checked": {
                      color: "var(--color-secondary)",
                    },
                  },
                }}
              />
            }
            label={
              <Typography>
                Ich bin damit einverstanden und nehme zur Kenntnis, dass für
                meine individuell angefertigte Bestellung kein{" "}
                <Link
                  href="/policy/agb"
                  style={{ color: "var(--color-secondary)" }}
                >
                  Widerrufsrecht
                </Link>{" "}
                besteht.
              </Typography>
            }
            sx={{
              alignSelf: "flex-start",
              alignItems: "flex-start",
              mb: "1rem",
              "& .MuiButtonBase-root": {
                padding: "0 10px",
                // ml: "10px",
              },
              "& .MuiTypography-root": {
                color: "#ffffff80",
                fontSize: "14px", // Set desired font size here
                textAlign: "left",
              },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            "& .MuiButtonBase-root": {
              backgroundColor: "var(--color-secondary-2)",
              color: "#111826",
              margin: "1rem",
            },
          }}
        >
          <Button
            type="submit"
            disabled={!acceptAgb || !acceptWider}
            sx={{
              "&:hover": {
                backgroundColor: "#02673e",
                borderBottom: "2px solid var(--color-secondary)",
              },
            }}
          >
            Zum Bezahlen fortfahren
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PricingPlans;
