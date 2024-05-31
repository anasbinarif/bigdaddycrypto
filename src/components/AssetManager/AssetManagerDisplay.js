import { Grid, Paper, styled, useMediaQuery, useTheme } from "@mui/material";
import BitpandaCard from "../../components/portfolioGenerator/cards/Bitpanda";
import PortfolioComponent from "../../components/portfolioGenerator/cards/PortfolioComponent";
import Second from "./cards/Second";
import Third from "./cards/Third";
import CoinDetails from "./cards/coinDetails/CoinDetails";
import { useState, useEffect } from "react";
import { getUserPortfolio } from "../../lib/data";
import { useAtom } from "jotai/index";
import { sessionAtom } from "../../app/stores/sessionStore";
import { portfolioAtom } from "../../app/stores/portfolioStore";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const AssetManagerDisplay = ({
  selectedCoin,
  setSelectedCoin,
  portfolio,
  setPortfolio,
  loadingPortfolio,
  assetsLeangth,
}) => {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      <Grid item xs={4} sm={4} md={width > 1350 ? 4 : 3}>
        <BitpandaCard />
      </Grid>
      <Grid item xs={4} sm={4} md={4}>
        <Second />
      </Grid>
      <Grid item xs={4} sm={4} md={width > 1350 ? 4 : 5}>
        <Third />
      </Grid>
      <Grid item xs={4} sm={4} md={width > 1350 ? 4 : 5}>
        <PortfolioComponent
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          loadingPortfolio={loadingPortfolio}
          assetsLeangth={assetsLeangth}
          setSelectedCoin={setSelectedCoin}
        />
      </Grid>
      {isSmallScreen ? (
        <Grid item xs={4}>
          <CoinDetails
            coin={portfolio?.assets[selectedCoin]}
            index={selectedCoin}
          />
        </Grid>
      ) : (
        <Grid item xs={8} sm={8} md={width > 1350 ? 8 : 7}>
          <CoinDetails
            coin={portfolio?.assets[selectedCoin]}
            index={selectedCoin}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default AssetManagerDisplay;
