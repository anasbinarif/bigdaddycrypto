import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import Datenschutz from "../../components/PolicyEl/policies/datenschutz";
import Widerrufsbelehrung from "../../components/PolicyEl/policies/widerrufsbelehrung";
import Agb from "../../components/PolicyEl/policies/agb";
import Impressum from "../../components/PolicyEl/policies/impressum";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Policy = ({ component }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#111826", // Set background color
        display: "flex",
        // flexDirection: "column",
        justifyContent: "center", // Center horizontally
        m: "0 5rem",
      }}
    >
      <Box sx={{ maxWidth: "1440px" }}>
        {component === "datenschutz" ? (
          <Datenschutz />
        ) : component === "widerrufsbelehrung" ? (
          <Widerrufsbelehrung />
        ) : component === "agb" ? (
          <Agb />
        ) : component === "impressum" ? (
          <Impressum />
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
};

export default Policy;
