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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import { fetchUserSubscriptionPlan } from "../../lib/data";
import { useAtom } from "jotai";
import { sessionAtom } from "../../app/stores/sessionStore";
import CurrentPlan from "./CurrentPlan";
import SubscribeDialog from "../../components/subscribeDialog/SubscribeDialog";

const MySwitch = styled(Switch)(({ theme }) => ({
  padding: 6,
  "& .MuiSwitch-switchBase": {
    "&.Mui-checked": {
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "red",
      },
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 50,
    backgroundColor: "var(--color-secondary-2)",
    opacity: 1,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      //   backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
      //     theme.palette.getContrastText(theme.palette.primary.main)
      //   )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      //   backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
      //     theme.palette.getContrastText(theme.palette.primary.main)
      //   )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const plans = [
  {
    title: "Free",
    price: "€0.00",
    features: [
      "max. 10 Coins in portfolio",
      "FAQ",
      "Mediathek 1 day after the others – Info Prompt (which signals the user to go for paid plans)",
      "Google Ads",
    ],
  },
  {
    title: "Pro",
    priceMonthly: "€29.95",
    priceYearly: "€24.95",
    yearlySavings: "€60.00",
    features: [
      "Unlimited Coins",
      "Mediathek 1 day access / updates before free users",
      "Add to Favorites",
      "Access to Graph",
      "Import / Export CSV",
      "All small Dashboards / (PDFs) - only in yearly subscription",
      "Blocklist",
      "all Livestreams (Integrated later)",
    ],
  },
  {
    title: "Premium",
    priceMonthly: "€59.95",
    priceYearly: "€49.95",
    yearlySavings: "€120.00",
    features: [
      "Unlimited Coins",
      "Mediathek 1 day access/updates before free users",
      "Add to Favorites",
      "Access to Graph",
      "Import / Export CSV - Later separately for each Sub Portfolio",
      "Indicators on Portfolio Generator",
      "Add New Coins to Portfolio that were not added by us on their own (asset manager)",
      "3 Sub Portfolios",
      "All Dashboards (small + Large) / PDFs - only in yearly subscription",
      "Blocklist",
      "all Livestreams (Integrated later)",
      "VIP discord Channel and Telegram (max. 1 Account per User) (Integrated later)",
    ],
  },
];

const PricingPlans = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [sessionJotai] = useAtom(sessionAtom);
  const [userSubscription, setUserSubscription] = useState(null);
  const [open, setOpen] = useState(false);

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
    setOpen(true);
  }

  return (
    <>
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
                      /{billingCycle === "monthly" ? "month" : "year"}
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
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CheckCircleIcon
                        sx={{ color: "white", marginRight: "8px" }}
                      />
                      <Typography
                        variant="body1"
                        component="p"
                        style={{ color: "white" }}
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
    </>
  );
};

export default PricingPlans;
