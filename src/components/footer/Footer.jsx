import { Box, List, ListItem, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Footer = () => {
  const t = useTranslations("footer");

  return (
    <Box
      sx={{
        backgroundColor: "#111826", // Set background color
        color: "#777", // Set text color to ensure visibility on dark backgrounds
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        padding: "20px", // Add padding for spacing
      }}
    >
      <Box sx={{ mb: "1rem" }}>
        <List sx={{ display: "flex" }}>
          <ListItem>
            <Link href="/policy/datenschutz">Datenschutz</Link>
          </ListItem>
          <ListItem>
            <Link href="/policy/widerrufsbelehrung">Widerrufsbelehrung</Link>
          </ListItem>
          <ListItem>
            <Link href="/policy/agb">AGB</Link>
          </ListItem>
          <ListItem>
            <Link href="/policy/impressum">Impressum</Link>
          </ListItem>
        </List>
      </Box>
      <Typography variant="body1" textAlign="center" fontSize="12px">
        {/* Text aligned to center */}
        {t("footerText")}
      </Typography>
    </Box>
  );
};

export default Footer;
