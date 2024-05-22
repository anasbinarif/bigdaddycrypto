import { Box, Divider, useMediaQuery, useTheme } from "@mui/material";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

const Second = ({ portfolio, loadingPortfolio }) => {
    const t = useTranslations("second");
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                backgroundColor: "#202530",
                color: "white",
                height: "100%",
                borderRadius: "8px",
                padding: isSmallScreen ? "15px" : "25px",
            }}
        >
            <Box sx={{ fontSize: isSmallScreen ? "100%" : "120%", fontWeight: "bold" }}>
                {t("nextGoals")}
                <FontAwesomeIcon
                    icon={faCrown}
                    style={{ paddingLeft: "10px", opacity: "0.25", fontSize: "0.9rem" }}
                />
            </Box>
            <Divider sx={{ marginY: isSmallScreen ? "10px" : "15px" }} />
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "#00000033",
                    padding: isSmallScreen ? "1rem 0" : "2rem 0",
                    marginTop: "1rem",
                    fontSize: isSmallScreen ? "12px" : "14px",
                    color: "#ffffff88",
                }}
            >
                {t("noGoalsDefined")}
            </Box>
        </Box>
    );
};

export default Second;
