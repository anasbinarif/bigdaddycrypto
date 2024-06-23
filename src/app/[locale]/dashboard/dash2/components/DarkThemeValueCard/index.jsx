import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

const DarkThemeValueCard = ({ sx, title, value }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: "100%",
        minHeight: 100,
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        textAlign: "center",
        backgroundColor: theme.colors.lightBackgroundColor, // Dark background color
        color: theme.colors.textColor, // Text color
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...sx, // Merge custom styles
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <CardContent sx={{ width: "100%", height: "100%" }}>
        <Typography variant="h5">{value}</Typography>
      </CardContent>
    </Card>
  );
};

export default DarkThemeValueCard;
