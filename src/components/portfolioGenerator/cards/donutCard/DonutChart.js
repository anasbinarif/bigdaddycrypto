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
  const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });
  const [financialSummary, setFinancialSummary] = useState([])
  const [portfolioScore, setPortfolioScore] = useState(0.0)

  const calculateFinancialSummaryForAllAssets = () => {
    return portfolio.assetsCalculations.assets.map(asset => {
      const price = portfolio.assets.find(a => a.CoinGeckoID === asset.CoinGeckoID).Price;
      const Potential = portfolio.assets.find(a => a.CoinGeckoID === asset.CoinGeckoID).Potential;
      const Sicherheit = portfolio.assets.find(a => a.CoinGeckoID === asset.CoinGeckoID).Sicherheit;
      const totalCoins = asset.buyAndSell.reduce((acc, row) => {
        const coinsValue = parseFloat(row.Coins);
        return row.Type === "Kauf" ? acc + coinsValue : acc - coinsValue;
      }, 0);
      const totalHoldingsValue = (totalCoins * parseFloat(price)).toFixed(2);
      const totalInvested = asset.buyAndSell.reduce((acc, row) => acc + parseFloat(row.Betrag), 0).toFixed(2);

      return {
        CoinGeckoID: asset.CoinGeckoID,
        totalCoins,
        totalHoldingsValue,
        totalInvested,
        Potential,
        Sicherheit
      };
    });
  }

  const calculatePortfolioSecurityScore = (financialSummaries) => {
    const filteredSummaries = financialSummaries.filter(asset => parseFloat(asset.totalCoins) > 0);

    const totalCoinsInPortfolio = filteredSummaries.reduce((acc, asset) => acc + parseFloat(asset.totalCoins), 0);
    if (totalCoinsInPortfolio === 0) return 0; 

    const weightedSecurityScore = filteredSummaries.reduce((acc, asset) => {
      const assetPercentage = parseFloat(asset.totalCoins) / totalCoinsInPortfolio;
      const assetSecurityScore = asset.Sicherheit || 0;
      return acc + (assetPercentage * assetSecurityScore);
    }, 0);

    return weightedSecurityScore.toFixed(1);
  };


  useEffect(() => {
    if (portfolio && portfolio.assetsCalculations && portfolio.assetsCalculations.assets.length > 0) {
      const financialSummaries = calculateFinancialSummaryForAllAssets();
      console.log("financialSummaries--", financialSummaries);
      setFinancialSummary(financialSummaries)
      const portfolioScore = calculatePortfolioSecurityScore(financialSummaries);
      setPortfolioScore(portfolioScore)
      console.log("Portfolio Score:", portfolioScore);
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
          {portfolioScore}
        </Typography>
        <Typography variant="caption" style={{ color: "#FFFFFF" }}>
          Sehr gut
        </Typography>
      </Box>
    </Box>
  );
};

export default DonutChart;
