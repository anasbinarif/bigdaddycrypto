import { Box, Typography } from "@mui/material";

const Footer = () => {
  const footerText =
    "Copyright © 2024, All rights reserved. · Impressum · Datenschutz · Die bereitgestellten Informationen stellen keine finanzielle Beratung dar. Jegliche Handlungen erfolgen auf eigenes Risiko.";

  return (
    <Box
      sx={{
        backgroundColor: "#111826", // Set background color
        color: "#777", // Set text color to ensure visibility on dark backgrounds
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        padding: "20px", // Add padding for spacing
      }}
    >
      <Typography variant="body1" textAlign="center" fontSize="12px"> {/* Text aligned to center */}
        {footerText}
      </Typography>
    </Box>
  );
};

export default Footer;
