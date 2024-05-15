import { Box, Divider } from "@mui/material";
import KryptoFilter from "./kryptoFilter";
import ScrollableKryptoTabs from "@/components/portfolioGenerator/cards/kryptoAssets/kryptoCoinsTabs";

const KryptoAssets = ({ portfolio, loadingPortfolio }) => {
  console.log(portfolio);
  return (
    <Box
      sx={{
        backgroundColor: "#202530",
        color: "white",
        height: "100%",
        borderRadius: "8px",
      }}
    >
      <KryptoFilter portfolio={portfolio} userID={portfolio.userID} />
      <Divider />
      <ScrollableKryptoTabs
        portfolio={portfolio}
        loadingPortfolio={loadingPortfolio}
        userID={portfolio.userId}
      />
    </Box>
  );
};

export default KryptoAssets;
