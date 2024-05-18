import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Box, Typography } from "@mui/material";
import { categoriesDisplay } from "@/lib/data";
import { useAtom } from "jotai/index";
import { portfolioAtom } from "@/app/stores/portfolioStore";

const categoryColors = {
  AI: "#FFD700",
  "Gaming/ Metaverse": "#00BFFF",
  DeFi: "#1155bb",
  "Web3/ Anonymität": "#DC143C",
  "Grüne Coins": "#00aa66",
  "BTC- Zusammenhang": "#FF9900",
  "CBDC- Netzwerke": "#667788",
  eCommerce: "#8833bb",
  "Tokenisierung/ RWA": "#ff5aac",
};

const DonutChart = ({ portfolioCalculations, loadingPortfolio }) => {
  const [portfolio] = useAtom(portfolioAtom, { assets: [] });
  const [securityScore, setSecurityScore] = useState(0);


  useEffect(() => {
    const calculateSecurityScore = () => {
      let totalInvestment = 0;
      let weightedScore = 0;

      // Calculate the total investment across all assets
      portfolio.assetsCalculations.assets.forEach(asset => {
        totalInvestment += asset.totalInvest;
      });

      // Calculate the weighted security score
      portfolio.assetsCalculations.assets.forEach(asset => {
        const assetDetails = portfolio.assets.find(a => a.CoinGeckoID === asset.CoinGeckoID);
        if (assetDetails && assetDetails.Sicherheit) {
          const weight = asset.totalInvest / totalInvestment;
          weightedScore += weight * assetDetails.Sicherheit;
        }
      });

      setSecurityScore(weightedScore.toFixed(2));
    };

    if (portfolio.assetsCalculations && portfolio.assets) {
      calculateSecurityScore();
    }
  }, [portfolio]);


  const data = loadingPortfolio
    ? [
      ["Category", "Percentage"],
      ...Object.entries(portfolioCalculations.percentages || {}).map(
        ([key, value]) => {
          return [
            categoriesDisplay[key] || key,
            parseFloat(value.replace("%", "")),
          ];
        }
      ),
    ]
    : [
      ["Category", "Percentage"],
      ["AI", 100.0],
    ];

  const colors = data
    .slice(1)
    .map((item) => categoryColors[item[0]] || "#CCCCCC");

  const options = {
    pieHole: 0.8,
    pieSliceText: "none",
    is3D: false,
    legend: { position: "none" },
    tooltip: {
      textStyle: { color: "black" },
      showColorCode: true,
    },
    colors: colors,
    chartArea: { width: "80%", height: "80%" },
    backgroundColor: "none",
    animation: {
      startup: true,
      easing: "linear",
      duration: 1500,
    },
    pieSliceBorderColor: "none",
    textStyle: {
      color: "white",
    },
  };

  return (
    <Box sx={{ position: "relative", width: "56%", height: "250px" }}>
      <Chart
        chartType="PieChart"
        height="300px"
        width="100%"
        data={data}
        options={options}
      />
      <Box
        sx={{
          position: "absolute",
          top: "60%", // Center vertically in the donut hole
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center", // Center text horizontally
          zIndex: "100",
        }}
      >
        <Typography variant="caption" style={{ color: "#FFFFFF" }}>
          Score
        </Typography>
        <Typography variant="h4" component="div" style={{ color: "#FFFFFF" }}>
          {securityScore}
        </Typography>
        <Typography variant="caption" style={{ color: "#FFFFFF" }}>
          Sehr gut
        </Typography>
      </Box>
    </Box>
  );
};

export default DonutChart;
