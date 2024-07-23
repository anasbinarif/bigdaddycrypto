import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { green, yellow } from "@mui/material/colors";
import { Box } from "@mui/material";
import CustomizedTooltips from "../../toolTip/CustomizedTooltip";
import { useAtom } from "jotai";
import { portfolioAtom } from "../../../app/stores/portfolioStore";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { calculateScore, getUserPortfolio } from "../../../lib/data";
import { sessionAtom } from "../../../app/stores/sessionStore";

const hypeCoinColor = {
  0: "#DC143C",
  1: "#E32612",
  2: "#E84612",
  3: "#ef6600",
  4: "#ff9600",
  5: "#ffa600",
  6: "#ffc400",
  7: "#ffe400",
  8: "#dfe800",
  9: "#9fdf20",
  10: "#41b431",
};

// const calculatePotential = (portfolio) => {
//   let totalPotential = 0;
//   let totalAssets = 0;
//   let totalSecurity = 0;
//   let pMinX = 0;
//   let pMaxX = 0;
//   let pMinXClean = 0;
//   let pMaxXClean = 0;
//   let totalAssetsAmount = 0;
//   console.log("calculatePotential: ", portfolio);
//   portfolio.forEach((asset) => {
//     const { Potential, Sicherheit, Bottom, Price } = asset;
//     const dataPotential = parseFloat(Potential);
//     const dataSecurity = parseFloat(Sicherheit);
//     const dataBottom = parseFloat(Bottom);
//     const dataEK = parseFloat(Price) || dataBottom;
//     const assetAmount = 1;
//     if (dataPotential) {
//       totalPotential += dataPotential;
//       totalSecurity += dataSecurity * assetAmount;
//       totalAssets += 1;
//       totalAssetsAmount += parseFloat(assetAmount);
//       if (isNaN(dataSecurity) || isNaN(dataPotential)) {
//         pMinX += 1 * assetAmount;
//         pMaxX += 10 * assetAmount;
//         pMinXClean += ((1 * assetAmount) / dataEK) * dataBottom;
//         pMaxXClean += ((10 * assetAmount) / dataEK) * dataBottom;
//       } else if (dataPotential >= 9) {
//         pMinX += 100 * assetAmount;
//         pMaxX += 200 * assetAmount;
//         pMinXClean += ((100 * assetAmount) / dataEK) * dataBottom;
//         pMaxXClean += ((200 * assetAmount) / dataEK) * dataBottom;
//       } else if (dataPotential > 8.5) {
//         pMinX += 75 * assetAmount;
//         pMaxX += 100 * assetAmount;
//         pMinXClean += ((75 * assetAmount) / dataEK) * dataBottom;
//         pMaxXClean += ((100 * assetAmount) / dataEK) * dataBottom;
//       } else if (dataPotential > 8) {
//         pMinX += 50 * assetAmount;
//         pMaxX += 75 * assetAmount;
//         pMinXClean += ((50 * assetAmount) / dataEK) * dataBottom;
//         pMaxXClean += ((75 * assetAmount) / dataEK) * dataBottom;
//       } else if (dataPotential > 7.5) {
//         pMinX += 30 * assetAmount;
//         pMaxX += 50 * assetAmount;
//         pMinXClean += ((30 * assetAmount) / dataEK) * dataBottom;
//         pMaxXClean += ((50 * assetAmount) / dataEK) * dataBottom;
//       } else if (dataPotential > 7) {
//         pMinX += 15 * assetAmount;
//         pMaxX += 30 * assetAmount;
//         pMinXClean += ((15 * assetAmount) / dataEK) * dataBottom;
//         pMaxXClean += ((30 * assetAmount) / dataEK) * dataBottom;
//       } else if (dataPotential > 6.7) {
//         pMinX += 10 * assetAmount;
//         pMaxX += 15 * assetAmount;
//         pMinXClean += ((10 * assetAmount) / dataEK) * dataBottom;
//         pMaxXClean += ((15 * assetAmount) / dataEK) * dataBottom;
//       } else {
//         pMinX += 1 * assetAmount;
//         pMaxX += 10 * assetAmount;
//         pMinXClean += ((1 * assetAmount) / dataEK) * dataBottom;
//         pMaxXClean += ((10 * assetAmount) / dataEK) * dataBottom;
//       }
//     }
//   });
//   const avgMin = (pMinX / totalAssetsAmount).toFixed(0);
//   const avgMax = (pMaxX / totalAssetsAmount).toFixed(0);
//   return { avgMin, avgMax };
// };

const calculatePotential = (portfolio, buyAndSell) => {
  let totalPotentialMin = 0;
  let totalPotentialMax = 0;
  let totalAssetsAmount = 0;

  portfolio.forEach((asset, index) => {
    console.log("bewerrrrPotenn", asset, buyAndSell[index]);
    const { Potential, Bottom, Price, CoinGeckoID } = asset;
    const dataPotential = parseFloat(Potential) || 0;
    const dataBottom = parseFloat(Bottom);
    const dataPrice = parseFloat(Price);

    const userEntryData = buyAndSell.find(
      (item) => item.CoinGeckoID === CoinGeckoID
    );
    const userEntryPrice =
      userEntryData.DCA == 0 ? dataPotential : userEntryData.DCA;

    const assetAmount = 1;

    if (
      dataPotential &&
      dataBottom &&
      dataPrice &&
      buyAndSell[index].buyAndSell.length > 0
    ) {
      let potentialMin = 0;
      let potentialMax = 0;

      if (dataPotential > 9.5) {
        potentialMin = 130;
        potentialMax = 160;
      } else if (dataPotential > 9) {
        potentialMin = 100;
        potentialMax = 130;
      } else if (dataPotential > 8.5) {
        potentialMin = 75;
        potentialMax = 100;
      } else if (dataPotential > 8) {
        potentialMin = 50;
        potentialMax = 75;
      } else if (dataPotential > 7.5) {
        potentialMin = 30;
        potentialMax = 50;
      } else if (dataPotential > 7) {
        potentialMin = 15;
        potentialMax = 30;
      } else if (dataPotential <= 7) {
        potentialMin = 10;
        potentialMax = 15;
      }
      let adjustedMin = 0;
      let adjustedMax = 0;

      if (userEntryData.DCA === 0) {
        adjustedMin = potentialMin;
        adjustedMax = potentialMax;
      } else {
        adjustedMin = (dataBottom / userEntryPrice) * potentialMin;
        adjustedMax = (dataBottom / userEntryPrice) * potentialMax;
      }
      totalPotentialMin += adjustedMin * assetAmount;
      totalPotentialMax += adjustedMax * assetAmount;
      totalAssetsAmount += assetAmount;
    }
  });

  let avgMin = (totalPotentialMin / totalAssetsAmount).toFixed(1);
  let avgMax = (totalPotentialMax / totalAssetsAmount).toFixed(1);

  return { avgMin, avgMax };
};

const setColorPot = (dataPotential) => {
  if (isNaN(dataPotential)) {
    return "rgba(220,220,220,.1)";
  } else if (dataPotential >= 30) {
    return "#41b431";
  } else if (dataPotential >= 20) {
    return "#8ece10";
  } else if (dataPotential >= 15) {
    return "#E0c000";
  } else if (dataPotential >= 8) {
    return "#ff9600";
  } else if (dataPotential > 0) {
    return "#E31612";
  } else {
    return "rgba(220,220,220,.1)";
  }
};

const calculateDotColor = (name, score, portfolio) => {
  switch (name) {
    case "scoreFactor_Category":
      if (score === 1) return green[500];
      if (score === 2) return "orange";
      if (score === 3) return "#ff0000";
      return "#800000";
    case "scoreFactor_CategoryTwice":
      if (score === 1) return green[500];
      if (score === 2) return "orange";
      return "#800000";
    case "scoreFactor_CategoryMissing":
      if (score === 1) return green[500];
      if (score === 2) return "orange";
      return "#800000";
    case "scoreFactor_Allocation":
      if (score === 3) return green[500];
      if (score === 2) return "orange";
      return "#800000";
    case "scoreFactor_CoinCount":
      if (score === 1) return green[500];
      if (score === 2) return yellow[800];
      if (score === 3) return "orange";
      return "#800000";
    default:
      return "grey";
  }
};

function BewertungCard({ preCalcPort }) {
  const [portfolio] = useAtom(portfolioAtom);
  const [sicherheitAverage, setSicherheitAverage] = useState(0);
  const [potential, setPotential] = useState({ avgMin: 0, avgMax: 0 });
  const [sessionJotai] = useAtom(sessionAtom);
  const [hypeColorScore, setHypeColorScore] = useState({
    scoreFactor_Category: 0,
    scoreFactor_CategoryTwice: 0,
    scoreFactor_CategoryMissing: 0,
    scoreFactor_Allocation: 0,
    scoreFactor_CoinCount: 0,
  });
  const t = useTranslations("bewertungCard");

  useEffect(() => {
    const calculateMetrics = async () => {
      const portData = portfolio?.assets ? portfolio : preCalcPort;
      // console.log("portData=", portData);
      if (portData?.assets) {
        // console.log(portData);
        const assets = portData.assets;
        const buyAndSell = portData.assetsCalculations.assets;
        const userPortfolio = await getUserPortfolio(
          sessionJotai?.user.id || id
        );

        // Calculate Sicherheit Average
        const sicherheitValues = assets
          .filter((asset) => asset.Sicherheit)
          .map((asset) => asset.Sicherheit || 0);
        const avgSicherheit =
          sicherheitValues.length > 0
            ? sicherheitValues.reduce((acc, val) => acc + val, 0) /
              sicherheitValues.length
            : 0;
        setSicherheitAverage(avgSicherheit.toFixed(1));

        // Calculate Potential
        const potentialResult = calculatePotential(assets, buyAndSell);
        setPotential(potentialResult);

        // Calculate Hype Color Score
        try {
          const calculatedScore = await calculateScore(
            assets,
            userPortfolio?.calculation
          );
          setHypeColorScore({
            scoreFactor_Category: Math.min(
              Number(calculatedScore.scoreFactor_Category),
              10
            ),
            scoreFactor_CategoryTwice: Math.min(
              Number(calculatedScore.scoreFactor_CategoryTwice),
              10
            ),
            scoreFactor_CategoryMissing: Math.min(
              Number(calculatedScore.scoreFactor_CategoryMissing),
              10
            ),
            scoreFactor_Allocation: Math.min(
              Number(calculatedScore.scoreFactor_Allocation),
              10
            ),
            scoreFactor_CoinCount: Math.min(
              Number(calculatedScore.scoreFactor_CoinCount),
              10
            ),
          });
        } catch (error) {
          console.error("Error calculating score:", error);
        }
      }
    };

    calculateMetrics();
  }, [portfolio, preCalcPort]);

  const getBackgroundColor = (sicherheitAverage) => {
    if (sicherheitAverage >= 0 && sicherheitAverage < 5.5) {
      return "red";
    } else if (sicherheitAverage >= 5.5 && sicherheitAverage < 7) {
      return "lightgreen"; // or another shade for "light faded green"
    } else if (sicherheitAverage >= 7 && sicherheitAverage <= 10) {
      return "green";
    } else {
      return "gray"; // default color if the value is out of expected range
    }
  };

  return (
    <Card
      sx={{
        bgcolor: "#202530",
        color: "white",
        height: "100%",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ padding: "25px" }}>
        <Typography
          sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: "1.25rem" }}
          gutterBottom
        >
          {t("title")}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <List sx={{ bgcolor: "#00000033", borderRadius: "8px" }}>
            {[
              {
                text: t("hypeCoverage"),
                name: "scoreFactor_Category",
              },
              {
                text: t("doubleHypeCoverage"),
                name: "scoreFactor_CategoryTwice",
              },
              {
                text: t("missingHypeTheme"),
                name: "scoreFactor_CategoryMissing",
              },
              {
                text: t("hypeDistribution"),
                name: "scoreFactor_Allocation",
              },
              {
                text: t("numberOfCoins"),
                name: "scoreFactor_CoinCount",
              },
            ].map((item) => (
              <ListItem key={item.text} sx={{ py: 0 }}>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <FiberManualRecordIcon
                    sx={{
                      color: calculateDotColor(
                        item.name,
                        hypeColorScore[item.name],
                        portfolio
                      ),
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ "& .MuiTypography-root": { fontSize: "14px" } }}
                />
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              "@media (max-width:1400px)": {
                flexDirection: "column",
                alignItems: "flex-start",
              },
              "@media (max-width:768px)": {
                flexDirection: "row",
              },
              "@media (max-width:500px)": {
                flexDirection: "column",
              },
            }}
          >
            <Typography
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#00000033",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                "@media (max-width:1400px)": {
                  mb: "20px",
                },
              }}
            >
              <span
                style={{
                  whiteSpace: "nowrap",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                {t("sicherheit")}
                <CustomizedTooltips
                  text1={t("sicherheitTooltipText1")}
                  text2={t("sicherheitTooltipText2")}
                />
              </span>{" "}
              <span
                style={{
                  color: "white",
                  backgroundColor: getBackgroundColor(sicherheitAverage),
                  padding: "4px 8px 2px",
                  textShadow: "1px 1px 5px rgba(0,0,0,.4)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                {sicherheitAverage}
              </span>
            </Typography>
            <Typography
              component="div"
              sx={{
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#00000033",
                padding: "10px 16px",
                borderRadius: "8px",
                display: "flex",
                fontSize: "14px",
              }}
            >
              <span
                style={{
                  whiteSpace: "nowrap",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                {t("potential")}
                <CustomizedTooltips
                  text1={t("potentialTooltipText1")}
                  text2={t("potentialTooltipText2")}
                />
              </span>{" "}
              <span
                style={{
                  color: "white",
                  backgroundColor: setColorPot(potential.avgMin),
                  padding: "4px 8px 2px",
                  textShadow: "1px 1px 5px rgba(0,0,0,.4)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                {isNaN(potential.avgMin) ? 0 : potential.avgMin}x -{" "}
                {isNaN(potential.avgMax) ? 0 : potential.avgMax}x
              </span>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default BewertungCard;
