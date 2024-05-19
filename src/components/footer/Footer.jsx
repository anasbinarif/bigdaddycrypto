import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const Footer = () => {
    const t = useTranslations("footer");

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
            <Typography variant="body1" textAlign="center" fontSize="12px">
                {/* Text aligned to center */}
                {t("footerText")}
            </Typography>
        </Box>
    );
};

export default Footer;
