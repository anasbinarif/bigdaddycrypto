import { Box, Divider } from "@mui/material";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

const Second = ({ portfolio, loadingPortfolio }) => {
    const t = useTranslations("second");

    return (
        <Box
            sx={{
                backgroundColor: "#202530",
                color: "white",
                height: "100%",
                borderRadius: "8px",
                padding: "25px",
            }}
        >
            <Box sx={{ fontSize: "120%", fontWeight: "bold" }}>
                {t("nextGoals")}
                <FontAwesomeIcon
                    icon={faCrown}
                    style={{ paddingLeft: "10px", opacity: "0.25", fontSize: "0.9rem" }}
                />
            </Box>
            {/* <KryptoFilter portfolio={portfolio} userID={portfolio.userID} /> */}
            <Divider />
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "#00000033",
                    padding: "2rem 0",
                    marginTop: "1rem",
                    fontSize: "14px",
                    color: "#ffffff88",
                }}
            >
                {t("noGoalsDefined")}
            </Box>
        </Box>
    );
};

export default Second;
