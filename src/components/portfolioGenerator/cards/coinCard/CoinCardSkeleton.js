import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";

const CoinCardSkeleton = () => {
  return (
    <Card sx={{ width: 250, m: 1, bgcolor: "#333" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={4}
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};

export default CoinCardSkeleton;
