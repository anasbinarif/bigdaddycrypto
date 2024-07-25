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
import addCommas from "../../lib/currencyFormatter";
import maxLenCrop from "../../lib/checkString";
import { categoryColors, categoryColorsNew } from "../../lib/data";

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const getRandomColor = (ticker) => {
  let color = "#";
  const letters = "0123456789ABCDEF";
  const hash = hashString(ticker);
  for (let i = 0; i < 6; i++) {
    color += letters[(hash >> (i * 4)) & 0x0f];
  }
  return color;
};

const getSlices = (data, assets) => {
  // console.log(assets);
  return data.slice(1).reduce((acc, item, index) => {
    // console.log(item);
    const categories = assets?.find(
      (asset) => asset.Ticker === item[0]
    )?.Category;
    // console.log(categories);
    const category = categories ? categories[categories.length - 1] : "ai";
    acc[index] = { color: categoryColorsNew[category] };
    return acc;
  }, {});
};

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

export default function Item1({ preCalcPort = null }) {
  const [width, setWidth] = useState(0);
  const [portfolio] = useAtom(portfolioAtom);
  const [graphPercentage, setGraphPercentage] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const t = useTranslations("item1");
  // console.log(portfolio);
  // console.log(graphData);

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
    const portData = preCalcPort || portfolio;
    console.log(portData);
    if (portData?.assetsCalculations && portData.assets) {
      const totalInvestment = portData?.assetsCalculations.assets.reduce(
        (acc, curr) => acc + curr.totalInvest,
        0
      );
      const mergedData = portData?.assets.map((asset) => {
        const calc =
          portData?.assetsCalculations.assets.find(
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
  }, [portfolio, preCalcPort]);

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

  const portData = preCalcPort || portfolio;

  const assetsLength = portData?.assetsCalculations?.assets.length;
  const totalInvestment = portData?.assetsCalculations?.assets.reduce(
    (acc, curr) => acc + (curr.totalInvest - curr.totalSold),
    0
  );
  const totalGesamtwert = portData?.assetsCalculations?.assets
    .reduce((acc, curr) => acc + curr.Holdings, 0)
    .toFixed(2);
  // const aktuellerProfit = (totalGesamtwert - totalInvestment).toFixed(2);
  let aktuellerProfit = portData?.assetsCalculations?.assets.reduce(
    (acc, curr) => {
      const winLoss = curr.Holdings - (curr.totalInvest - curr.totalSold);
      return acc + winLoss;
    },
    0
  );
  aktuellerProfit = parseFloat(
    aktuellerProfit > 0.09
      ? aktuellerProfit.toFixed(2)
      : aktuellerProfit.toPrecision(2)
  );
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
            <Box
              sx={{
                position: "relative",
                fontSize: "2rem",
                fontWeight: "bold",
                whiteSpace: "nowrap",

                "& > div": {
                  display: "none",
                },

                "&:hover > div": {
                  display: "block",
                },
              }}
            >
              {maxLenCrop(addCommas(totalGesamtwert))} €
              {addCommas(totalGesamtwert).length > 12 && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    backgroundColor: "#818181ef",
                    borderRadius: "4px",
                    padding: "2px",
                    fontSize: "14px",
                  }}
                >
                  {addCommas(totalGesamtwert)}
                </div>
              )}
            </Box>
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
                {addCommas(totalInvestment)} €
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "0.8rem", opacity: "0.5" }}>
                {t("currentProfit")}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                {addCommas(aktuellerProfit)} €
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
              options={{
                ...options,
                slices: getSlices(
                  graphData,
                  preCalcPort ? preCalcPort?.assets : portfolio?.assets
                ),
              }}
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
