import { Grid } from "@mui/material";
import BitpandaCard from "./cards/Bitpanda";
import BewertungCard from "./cards/Bewertung";
import KryptoAssets from "./cards/kryptoAssets/KryptoAssets";
import PortfolioComponent from "./cards/PortfolioComponent";
import { DonutCard } from "./cards/donutCard/DonutCard";

const PortfolioDisplay = ({
  portfolio,
  setPortfolio,
  loadingPortfolio,
  assetsLeangth,
  setSelectedCoin,
  setTabSelector,
}) => {
  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
      style={{ position: "relative" }}
    >
      <Grid item xs={4} sm={4} md={2} lg={4}>
        <BitpandaCard />
      </Grid>
      <Grid item xs={4} sm={4} md={5} lg={4}>
        <BewertungCard />
      </Grid>
      <Grid item xs={4} sm={8} md={5} lg={4}>
        <DonutCard />
      </Grid>
      <Grid item xs={4} sm={8} md={8}>
        <KryptoAssets
          portfolio={portfolio}
          loadingPortfolio={loadingPortfolio}
          userID={portfolio.userId}
          assetsLeangth={assetsLeangth}
        />
      </Grid>
      <Grid item xs={4} sm={4} md={4} style={{ position: "relative" }}>
        <PortfolioComponent
          portfolio={portfolio}
          setPortfolio={setPortfolio}
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
