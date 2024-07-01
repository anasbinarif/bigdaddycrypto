import { Box, Typography, Skeleton, Card, CardContent } from "@mui/material";
import React from "react";
import dayjs from "dayjs";

const CurrentPlan = ({ planDetails, plan }) => {
  const formatNextBilledAt = () => {
    if (planDetails && planDetails.nextBilledAt) {
      return dayjs(planDetails.nextBilledAt).format("MMMM D, YYYY h:mm A");
    }
    return "Billing period ended";
  };

  return (
    <Card
      sx={{
        backgroundColor: "#444",
        color: "white",
        mb: 4,
        borderRadius: "10px",
        textAlign: "center",
        width: "max-content",
        padding: "24px 48px",
        margin: "0 auto",
      }}
    >
      <CardContent>
        {planDetails || plan === "free+" ? (
          <>
            <Typography variant="h4" gutterBottom>
              Your Current Plan:{" "}
              <span style={{ color: "#4caf50" }}>
                {planDetails?.plan || plan}
              </span>
            </Typography>
            <Typography variant="h6" gutterBottom>
              Billing Cycle:{" "}
              <span style={{ color: "#fbc02d" }}>
                {planDetails?.billingCycle || "none"}
              </span>
            </Typography>
            <Typography variant="body1" gutterBottom>
              Status:{" "}
              <span
                style={{
                  color:
                    planDetails?.status === "active" || plan === "free+"
                      ? "#4caf50"
                      : "#f44336",
                }}
              >
                {planDetails?.status || "active"}
              </span>
            </Typography>
            <Typography variant="body2" gutterBottom>
              Next Billed At:{" "}
              <span style={{ fontWeight: "bold" }}>{formatNextBilledAt()}</span>
            </Typography>
          </>
        ) : (
          <>
            <Skeleton variant="text" width={300} height={50} />
            <Skeleton variant="text" width={200} height={30} />
            <Skeleton variant="text" width={200} height={30} />
            <Skeleton variant="text" width={250} height={30} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentPlan;
