import { Box, Divider, useTheme, useMediaQuery } from "@mui/material";
import KryptoFilter from "./kryptoFilter";
import ScrollableKryptoTabs from "./kryptoCoinsTabs";
import {useState} from "react";

const KryptoAssets = ({ portfolio, loadingPortfolio }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [priceIndicator, setPriceIndicator] = useState("pi");

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
            <KryptoFilter portfolio={portfolio} userID={portfolio.userID} priceIndicator={priceIndicator} setPriceIndicator={setPriceIndicator} />
            <Divider sx={{ my: isSmallScreen ? 1 : 2 }} />
            <ScrollableKryptoTabs
                portfolio={portfolio}
                loadingPortfolio={loadingPortfolio}
                userID={portfolio.userId}
                priceIndicator={priceIndicator}
            />
        </Box>
    );
};

export default KryptoAssets;
