import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { categoriesDisplay } from "../../../../lib/data";
import { useAtom } from "jotai/index";
import { portfolioAtom } from "../../../../app/stores/portfolioStore";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("donutChart");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const calculateSecurityScore = () => {
      let totalInvestment = 0;
      let weightedScore = 0;

      portfolio.assetsCalculations.assets.forEach((asset) => {
        totalInvestment += asset.totalInvest;
      });

      portfolio.assetsCalculations.assets.forEach((asset) => {
        const assetDetails = portfolio.assets.find(
          (a) => a.CoinGeckoID === asset.CoinGeckoID
        );
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
    chartArea: { width: "100%", height: "100%" },
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
    <Box
      sx={{
        position: "relative",
        width: "60%",
        height: "auto",
        display: "flex",
        mr: "-25px",
        "@media (max-width:1600px)": {
          width: "40%",
          mr: 0,
        },
      }}
    >
      <Box
        sx={{
          height: "auto",
          width: "100%",
          alignSelf: "flex-end",
          "@media (max-width:1500px)": {
            scale: 0.9,
          },
        }}
      >
        <Chart
          chartType="PieChart"
          height="100%"
          width="100%"
          data={data}
          options={options}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "50%", // Center vertically in the donut hole
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center", // Center text horizontally
          zIndex: "100",

          "@media (max-width:600px)": {
            backgroundColor: "secondary.main",
          },
        }}
      >
        <Typography
          variant="caption"
          style={{
            color: "#FFFFFF",
          }}
        >
          {t("score")}
        </Typography>
        <Typography
          variant="h4"
          component="div"
          style={{ color: "#FFFFFF" }}
          sx={{
            "@media (max-width:1500px)": {
              fontSize: "clamp(1.75rem, 0.25rem + 2vw, 2.125rem)",
            },
          }}
        >
          {securityScore}
        </Typography>
        <Typography variant="caption" style={{ color: "#FFFFFF" }}>
          {t("veryGood")}
        </Typography>
      </Box>
    </Box>
  );
};

export default DonutChart;
