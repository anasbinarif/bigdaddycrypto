import { Box, Divider, useTheme, useMediaQuery } from "@mui/material";
import KryptoFilter from "./kryptoFilter";
import ScrollableKryptoTabs from "./kryptoCoinsTabs";
import { useState, useEffect } from "react";
import { useAtom } from "jotai/index";
import { portfolioAtom } from "../../../../app/stores/portfolioStore";
import "./stylesPopper.css";

const KryptoAssets = ({ loadingPortfolio, assetsLeangth }) => {
  const theme = useTheme();
  const [width, setWidth] = useState(1920);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [priceIndicator, setPriceIndicator] = useState("pi");
  const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });

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
        userID={portfolio.userID}
        priceIndicator={priceIndicator}
        setPriceIndicator={setPriceIndicator}
      />
      <ScrollableKryptoTabs
        loadingPortfolio={loadingPortfolio}
        userID={portfolio.userId}
        priceIndicator={priceIndicator}
        assetsLeangth={assetsLeangth}
      />
      {/* <div className="divider"></div> */}
    </Box>
  );
};

export default KryptoAssets;
