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
} from "@mui/material";
import { useAtom } from "jotai";
import { sessionAtom } from "../../app/stores/sessionStore";
import { portfolioAtom } from "../../app/stores/portfolioStore";
import { useTranslations } from "next-intl";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { saveSubscriptionDetails } from "../../lib/action";
import {fetchUserSubscriptionPlan} from "../../lib/data";

const plans = [
  { name: "Pro", description: "Pro plan description" },
  { name: "Premium", description: "Premium plan description" },
];

const initialOptions = {
  clientId: "AcDXowtS9OWXniZaHnlZ9Hu3_ZrT1oZfPT2TjrhRv08Rg6_s3F4IQwH-81s6OXaVFVtf0kTuVmxI81EM",
  currency: "USD",
  intent: "subscription",
  vault: "true"
};

// Define plan IDs for different billing cycles and plans
const planIds = {
  Pro: {
    monthly: "P-3KM72035UG134911JMZJH7SY",
    yearly: "P-0KB55690D61389417MZJIALI",
  },
  Premium: {
    monthly: "P-6Y6093855G604654RMZJIAZY",
    yearly: "P-04708021AF779952XMZJIBDQ",
  },
};

const SubscribeDialog = () => {
  const t = useTranslations("SubscribeDialog");
  const [open, setOpen] = useState(false);
  const [, setPortfolio] = useAtom(portfolioAtom);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [sessionJotai, setSession] = useAtom(sessionAtom);
  const [openLogin, setOpenLogin] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
      if (sessionJotai) {
        if (sessionJotai?.user?.subscriptionPlan === "free") {
          handleClickOpen();
        }
    }

  }, [sessionJotai]);

  const createSubscription = (data, actions) => {
    const planId = planIds[selectedPlan][billingCycle];
    return actions.subscription.create({
      plan_id: planId,
    });
  };

  const onApprove = async (data, actions) => {
    console.log("Subscription approved!", data);

    const userId = sessionJotai?.user.id; // Replace this with your user ID fetching logic
    const plan = selectedPlan;
    const planId = planIds[selectedPlan][billingCycle];
    try {
      await saveSubscriptionDetails(data, userId, plan, planId, billingCycle);
      setSnackbarMessage("Subscription approved!");
      setSnackbarSeverity("success");
      const subscriptionData = await fetchUserSubscriptionPlan(userId);
      console.log("subscriptionData", subscriptionData);
      setSession({
        ...sessionJotai,
        user: {
          ...sessionJotai.user,
          subscriptionPlan: subscriptionData.plan,
          paymentDetails: subscriptionData.payment,
          subscribed: true
        },
      });
      setOpenLogin(true);
      setSnackbarOpen(true);
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
      <Button variant="outlined" onClick={handleClickOpen}>
        Subscribe
      </Button>
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
                    border: selectedPlan === plan.name ? "2px solid blue" : "none",
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
              <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
              <FormControlLabel value="yearly" control={<Radio />} label="Yearly" />
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
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openLogin}
          onClose={()=>setOpenLogin(false)}
          message="You have to login again to access graphs"
          key={vertical + horizontal}
          autoHideDuration={6000}
      />
    </Box>
  );
};

export default SubscribeDialog;
