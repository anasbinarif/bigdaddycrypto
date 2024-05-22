import { Box, Divider, useTheme, useMediaQuery } from "@mui/material";
import KryptoFilter from "./kryptoFilter";
import ScrollableKryptoTabs from "./kryptoCoinsTabs";

const KryptoAssets = ({ portfolio, loadingPortfolio }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                backgroundColor: "#202530",
                color: "white",
                height: "100%",
                borderRadius: "8px",
                padding: isSmallScreen ? "10px" : "20px",
            }}
        >
            <KryptoFilter portfolio={portfolio} userID={portfolio.userID} />
            <Divider sx={{ my: isSmallScreen ? 1 : 2 }} />
            <ScrollableKryptoTabs
                portfolio={portfolio}
                loadingPortfolio={loadingPortfolio}
                userID={portfolio.userId}
            />
        </Box>
    );
};

export default KryptoAssets;
