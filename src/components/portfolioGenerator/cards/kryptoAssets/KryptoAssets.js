import { Box, Divider, useTheme, useMediaQuery } from "@mui/material";
import KryptoFilter from "./kryptoFilter";
import ScrollableKryptoTabs from "./kryptoCoinsTabs";
import { useState, useEffect } from "react";

const KryptoAssets = ({ portfolio, loadingPortfolio, assetsLeangth }) => {
  const theme = useTheme();
  const [width, setWidth] = useState(1920);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [priceIndicator, setPriceIndicator] = useState("pi");

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#202530",
        color: "white",
        // height: "100%",
        borderRadius: "8px",
        padding: isSmallScreen ? "10px" : "20px",
        // width:
        //   width >= 1700
        //     ? "86%"
        //     : width >= 1400
        //     ? "66.2%"
        //     : width > 900
        //     ? "66%"
        //     : "100%",
      }}
    >
      <KryptoFilter
        portfolio={portfolio}
        userID={portfolio.userID}
        priceIndicator={priceIndicator}
        setPriceIndicator={setPriceIndicator}
      />
      <Divider sx={{ my: isSmallScreen ? 1 : 2 }} />
      <ScrollableKryptoTabs
        portfolio={portfolio}
        loadingPortfolio={loadingPortfolio}
        userID={portfolio.userId}
        priceIndicator={priceIndicator}
        assetsLeangth={assetsLeangth}
      />
    </Box>
  );
};

export default KryptoAssets;
