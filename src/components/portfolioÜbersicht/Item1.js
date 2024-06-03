import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useAtom } from "jotai/index";
import { portfolioAtom } from "../../app/stores/portfolioStore";
import { Chart } from "react-google-charts";
import { useTranslations } from "next-intl";

const options = {
  pieHole: 0.8,
  pieSliceText: "none",
  is3D: false,
  legend: { position: "none" },
  tooltip: {
    textStyle: { color: "black" },
    showColorCode: true,
  },
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

export default function Item1({ loadingPortfolio }) {
  const [width, setWidth] = useState(0);
  const [portfolio] = useAtom(portfolioAtom);
  const [graphPercentage, setGraphPercentage] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const t = useTranslations("item1");

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

  useEffect(() => {
    if (portfolio.assetsCalculations && portfolio.assets) {
      const totalInvestment = portfolio?.assetsCalculations.assets.reduce(
        (acc, curr) => acc + curr.totalInvest,
        0
      );
      const mergedData = portfolio.assets.map((asset) => {
        const calc =
          portfolio?.assetsCalculations.assets.find(
            (ac) => ac.CoinGeckoID === asset.CoinGeckoID
          ) || {};
        const percentage = totalInvestment
          ? ((calc.totalInvest / totalInvestment) * 100).toFixed(2)
          : 0;
        return {
          percentage: percentage + "%",
          ticker: asset.Ticker,
        };
      });
      setGraphPercentage(mergedData);
    }
  }, [portfolio]);

  useEffect(() => {
    const data = [
      ["Ticker", "Percentage"],
      ...graphPercentage.map((item) => [
        item.ticker,
        parseFloat(item.percentage.replace("%", "")),
      ]),
    ];
    setGraphData(data);
  }, [graphPercentage]);

  const assetsLength = portfolio?.assetsCalculations?.assets.length;
  const totalInvestment = portfolio.assetsCalculations.assets.reduce(
    (acc, curr) => acc + curr.totalInvest,
    0
  );
  const totalGesamtwert = portfolio.assetsCalculations.assets
    .reduce((acc, curr) => acc + curr.Holdings, 0)
    .toFixed(2);
  const aktuellerProfit = (totalGesamtwert - totalInvestment).toFixed(2);
  const gesamtwertPercentage = (
    (aktuellerProfit / totalInvestment) *
    100
  ).toFixed(2);

  return (
    <Box
      sx={{
        backgroundColor: "#202530",
        color: "white",
        height: "100%",
        borderRadius: "8px",
        padding: "25px",
      }}
    >
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid
          item
          xs={12}
          md={width > 1800 ? 6 : width > 1100 ? 12 : 6}
          sx={{ minWidth: "250px", width: "100%" }}
        >
          <Box
            sx={{
              // backgroundColor: "white",
              fontSize: "120%",
              fontWeight: "bold",
            }}
          >
            {t("portfolioOverview")}
            <FontAwesomeIcon
              icon={faCrown}
              style={{
                paddingLeft: "10px",
                opacity: "0.25",
                fontSize: "0.9rem",
              }}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#00000033",
              padding: "1rem",
              marginTop: "1rem",
            }}
          >
            <Typography sx={{ fontSize: "0.9rem" }}>
              {t("totalValue")}
            </Typography>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              {totalGesamtwert} €
            </Typography>
            <Typography
              className={gesamtwertPercentage < 0 ? "down" : "up"}
              sx={{
                "&.down": {
                  color: "red",
                },
                "&.up": {
                  color: "green",
                },
                "&.down:before": {
                  content: '"▼ "',
                  fontSize: "80%",
                  marginRight: "3px",
                },
                "&.up:before": {
                  content: '"▲ "',
                  fontSize: "80%",
                  marginRight: "3px",
                },
              }}
            >
              {gesamtwertPercentage}%
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#00000033",
              padding: "1rem",
              marginTop: "1rem",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "0.8rem", opacity: "0.5" }}>
                {t("totalInvestment")}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                {totalInvestment} €
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "0.8rem", opacity: "0.5" }}>
                {t("currentProfit")}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                {aktuellerProfit},00 €
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={width > 1800 ? 6 : width > 1100 ? 12 : 6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              height: "100%",
            }}
          >
            <Chart
              chartType="PieChart"
              width="100%"
              height="300px"
              data={graphData}
              options={options}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                zIndex: "100",
              }}
            >
              <Typography sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                {assetsLength}
              </Typography>
              <Typography sx={{ fontSize: "1rem" }}>{t("assets")}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
