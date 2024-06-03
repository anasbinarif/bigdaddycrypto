import { Grid, Box, CircularProgress } from "@mui/material";
import BitpandaCard from "./cards/Bitpanda";
import BewertungCard from "./cards/Bewertung";
import KryptoAssets from "./cards/kryptoAssets/KryptoAssets";
import PortfolioComponent from "./cards/PortfolioComponent";
import { DonutCard } from "./cards/donutCard/DonutCard";
import { useState, useEffect } from "react";
import { useAtom } from "jotai/index";
import { portfolioAtom } from "../../app/stores/portfolioStore";

const PortfolioDisplay = ({
  loadingPortfolio,
  assetsLeangth,
  setSelectedCoin,
  setTabSelector,
}) => {
  const [width, setWidth] = useState(1800);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });

  useEffect(() => {
    // setLoading(true);
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    setLoading(false);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // console.log(width);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
          width: "100%",
          padding: 0,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
      style={{ position: "relative" }}
      // sx={{ padding: 0 }}
    >
      <Grid
        item
        xs={4}
        sm={width > 768 ? 4 : 8}
        md={width > 992 ? 2 : 6}
        lg={4}
      >
        <BitpandaCard />
      </Grid>
      <Grid
        item
        xs={4}
        sm={width > 768 ? 4 : 8}
        md={width > 992 ? 5 : 6}
        lg={4}
      >
        <BewertungCard />
      </Grid>
      <Grid item xs={4} sm={8} md={width > 992 ? 5 : 12} lg={4}>
        <DonutCard />
      </Grid>
      <Grid item xs={4} sm={8} md={width < 1350 ? (width < 1000 ? 12 : 7) : 8}>
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: width >= 900 ? "row" : "column",
          }}
        >
        </Box> */}
        <KryptoAssets
          loadingPortfolio={loadingPortfolio}
          userID={portfolio?.userId}
          assetsLeangth={assetsLeangth}
        />
      </Grid>
      <Grid
        item
        xs={4}
        sm={8}
        md={width > 1350 ? 4 : width > 1000 ? 5 : 12}
        style={{ position: "relative" }}
      >
        <PortfolioComponent
          loadingPortfolio={loadingPortfolio}
          assetsLeangth={assetsLeangth}
          setSelectedCoin={setSelectedCoin}
          setTabSelector={setTabSelector}
        />
      </Grid>
    </Grid>
  );
};

export default PortfolioDisplay;
