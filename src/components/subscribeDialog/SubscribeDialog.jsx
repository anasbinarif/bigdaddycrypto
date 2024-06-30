import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
  Slide,
} from "@mui/material";
import { useAtom } from "jotai";
import { sessionAtom } from "../../app/stores/sessionStore";
import { portfolioAtom } from "../../app/stores/portfolioStore";
import { useTranslations } from "next-intl";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { saveSubscriptionDetails } from "../../lib/action";
import { fetchUserSubscriptionPlan } from "../../lib/data";
import { signOut } from "next-auth/react";

const plans = [
  { name: "Pro", description: "Pro plan description" },
  { name: "Premium", description: "Premium plan description" },
];

const client_id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const initialOptions = {
  clientId: client_id,
  currency: "USD",
  intent: "subscription",
  vault: "true",
};

// Define plan IDs for different billing cycles and plans
const planIds = {
  Pro: {
    monthly: process.env.NEXT_PUBLIC_PAYPAL_PRO_MONTHLY_PLAN_ID || "",
    yearly: process.env.NEXT_PUBLIC_PAYPAL_PRO_YEARLY_PLAN_ID || "",
  },
  Premium: {
    monthly: process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_MONTHLY_PLAN_ID || "",
    yearly: process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_YEARLY_PLAN_ID || "",
  },
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SubscribeDialog = ({ open, handleClose }) => {
  const t = useTranslations("SubscribeDialog");
  const [, setPortfolio] = useAtom(portfolioAtom);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [sessionJotai, setSession] = useAtom(sessionAtom);
  const [openLogin, setOpenLogin] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer;
    if (openLogin) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            handleLogoutFun();
            clearInterval(timer);
            return prevCountdown;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [openLogin]);

  const handleLogoutFun = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
    console.log("Logged out successfully");
    handleClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const createSubscription = (data, actions) => {
    const planId = planIds[selectedPlan][billingCycle];
    return actions.subscription.create({
      plan_id: planId,
    });
  };

  const onApprove = async (data, actions) => {
    console.log("Subscription approved!", data);
    handleClose();

    const userId = sessionJotai?.user.id; // Replace this with your user ID fetching logic
    const plan = selectedPlan;
    const planId = planIds[selectedPlan][billingCycle];
    try {
      await saveSubscriptionDetails(data, userId, plan, planId, billingCycle);
      setSnackbarMessage("Subscription approved!");
      setSnackbarSeverity("success");
      const subscriptionData = await fetchUserSubscriptionPlan(userId);
      // console.log("subscriptionData", subscriptionData);
      setSession({
        ...sessionJotai,
        user: {
          ...sessionJotai.user,
          pastUser: sessionJotai?.user?.pastUser || "temp",
          subscriptionPlan: subscriptionData.plan,
          paymentDetails: subscriptionData.payment,
          subscribed: true,
        },
      });
      setOpenLogin(true);
    } catch (error) {
      setSnackbarMessage("Error saving subscription details.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const onCancel = (data) => {
    console.log("Subscription cancelled!", data);
    setSnackbarMessage("Subscription cancelled.");
    setSnackbarSeverity("warning");
    setSnackbarOpen(true);
  };

  const catchError = (err) => {
    console.error("Error occurred during subscription!", err);
    setSnackbarMessage("An error occurred during subscription.");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  };

  const onError = (err) => {
    console.error("Error in PayPal buttons!", err);
    setSnackbarMessage("An error occurred in PayPal buttons.");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "90%", md: "70%" },
            maxWidth: "600px",
          },
        }}
      >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>Select a Plan and Billing Cycle</DialogContentText>
          <Grid container spacing={2}>
            {plans.map((plan) => (
              <Grid item xs={12} sm={6} key={plan.name}>
                <Card
                  sx={{
                    cursor: "pointer",
                    border:
                      selectedPlan === plan.name ? "2px solid blue" : "none",
                  }}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box mt={2}>
            <RadioGroup
              aria-label="billingCycle"
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
            >
              <FormControlLabel
                value="monthly"
                control={<Radio />}
                label="Monthly"
              />
              <FormControlLabel
                value="yearly"
                control={<Radio />}
                label="Yearly"
              />
            </RadioGroup>
          </Box>
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              key={`${selectedPlan}-${billingCycle}`} // Force re-render by changing the key
              createSubscription={createSubscription}
              onApprove={onApprove}
              onCancel={onCancel}
              catchError={catchError}
              onError={onError}
            />
          </PayPalScriptProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={openLogin}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenLogin(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Session Expired"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You will be logged out in {countdown} seconds. Please log in again
            to access locked features.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutFun} color="primary">
            Logout Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscribeDialog;
