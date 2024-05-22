<<<<<<< HEAD
import { Box, Typography } from "@mui/material";
=======
import { Box, useTheme, useMediaQuery } from "@mui/material";
>>>>>>> origin/master
import DonutLegend from "./DonutLegend";
import DonutChart from "./DonutChart";
import { useEffect, useState } from "react";
import { portfolioAtom } from "../../../../app/stores/portfolioStore";
import { useAtom } from "jotai";
import { getUserPortfolio } from "../../../../lib/data";
import { sessionAtom } from "../../../../app/stores/sessionStore";
import DonutLegendSkeleton from "../../../portfolioGenerator/cards/donutCard/DonutLegendSkeleton";

export const DonutCard = () => {
    const [portfolio] = useAtom(portfolioAtom);
    const [loadingPortfolio, setLoadingPortfolio] = useState(false);
    const [portfolioCalculations, setPortfolioCalculations] = useState({});
    const [sessionJotai] = useAtom(sessionAtom);

  useEffect(() => {
    const fetchData = async () => {
      if (sessionJotai?.user) {
        const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
        setPortfolioCalculations(userPortfolio.calculation);
        setLoadingPortfolio(true);
      }
    };
    fetchData();
  }, [sessionJotai?.user.id, portfolio]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "#202530",
        color: "white",
        height: "100%",
        borderRadius: 2,
        // alignItems: "center",
        position: "relative",
        // padding: "25px",
      }}
    >
      <Box sx={{ margin: "25px" }}>
        <Typography
          sx={{ fontWeight: "bold", fontSize: "1.2rem", mb: "1.25rem" }}
          variant="h6"
          gutterBottom
        >
          Score und Allocation
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {loadingPortfolio ? (
            <DonutLegend portfolioCalculations={portfolioCalculations} />
          ) : (
            <DonutLegendSkeleton />
          )}
          <DonutChart
            portfolioCalculations={portfolioCalculations}
            loadingPortfolio={loadingPortfolio}
          />
        </Box>
      </Box>
    </Box>
  );
};
