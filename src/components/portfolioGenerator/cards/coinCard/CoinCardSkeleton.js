import React, {useEffect, useState} from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";

const CoinCardSkeleton = () => {
  const [width, setWidth] = useState(0);
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
  return (
    <Card sx={{
      // width: 250,
      m: 1,
      bgcolor: "#333",
      width:
        width >= 1500
          ? "calc(25% - 16px)"
          : width > 1200
            ? "calc(33.33% - 16px)"
            : width > 900
              ? "calc(50% - 16px)"
              : width > 700
                ? "calc(33.33% - 16px)"
                : width > 500
                  ? "calc(50% - 16px)"
                  : "calc(100% - 16px)",
    }}>
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
