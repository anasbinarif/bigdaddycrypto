import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme, Box } from "@mui/material";

const DarkThemeCard = ({ sx, title, children, FullScreenButton }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        width: "100%",
        minHeight: 405,
        position: "relative",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        textAlign: "center",
        backgroundColor: theme.colors.lightBackgroundColor, // Dark background color
        color: theme.colors.textColor, // Text color
        position: "relative",
        pt: 2,
        ...sx, // Merge custom styles
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Typography variant="h5" sx={{ textAlign: "center", mr: 4, ml: 4 }}>
          {title}
        </Typography>
        {FullScreenButton}
      </Box>
      <CardContent sx={{ width: "100%", height: "100%" }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DarkThemeCard;
