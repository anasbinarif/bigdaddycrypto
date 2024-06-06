import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { green, yellow } from "@mui/material/colors";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import CustomizedTooltips from "../../toolTip/CustomizedTooltip";
import { useAtom } from "jotai";
import { portfolioAtom } from "../../../app/stores/portfolioStore";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const calculatePotential = (portfolio) => {
  let totalPotential = 0;
  let totalAssets = 0;
  let totalSecurity = 0;
  let pMinX = 0;
  let pMaxX = 0;
  let pMinXClean = 0;
  let pMaxXClean = 0;
  let totalAssetsAmount = 0;

  portfolio.forEach(asset => {
    const { Potential, Sicherheit, Bottom, Price } = asset;
    const dataPotential = parseFloat(Potential);
    const dataSecurity = parseFloat(Sicherheit);
    const dataBottom = parseFloat(Bottom);
    const dataEK = parseFloat(Price) || dataBottom;
    const assetAmount = 1;

    if (dataPotential) {
      totalPotential += dataPotential;
      totalSecurity += (dataSecurity * assetAmount);
      totalAssets += 1;
      totalAssetsAmount += parseFloat(assetAmount);

      if (isNaN(dataSecurity) || isNaN(dataPotential)) {
        pMinX += (1 * assetAmount);
        pMaxX += (10 * assetAmount);
        pMinXClean += (1 * assetAmount) / dataEK * dataBottom;
        pMaxXClean += (10 * assetAmount) / dataEK * dataBottom;
      } else if (dataPotential >= 9) {
        pMinX += (100 * assetAmount);
        pMaxX += (200 * assetAmount);
        pMinXClean += (100 * assetAmount) / dataEK * dataBottom;
        pMaxXClean += (200 * assetAmount) / dataEK * dataBottom;
      } else if (dataPotential > 8.5) {
        pMinX += (75 * assetAmount);
        pMaxX += (100 * assetAmount);
        pMinXClean += (75 * assetAmount) / dataEK * dataBottom;
        pMaxXClean += (100 * assetAmount) / dataEK * dataBottom;
      } else if (dataPotential > 8) {
        pMinX += (50 * assetAmount);
        pMaxX += (75 * assetAmount);
        pMinXClean += (50 * assetAmount) / dataEK * dataBottom;
        pMaxXClean += (75 * assetAmount) / dataEK * dataBottom;
      } else if (dataPotential > 7.5) {
        pMinX += (30 * assetAmount);
        pMaxX += (50 * assetAmount);
        pMinXClean += (30 * assetAmount) / dataEK * dataBottom;
        pMaxXClean += (50 * assetAmount) / dataEK * dataBottom;
      } else if (dataPotential > 7) {
        pMinX += (15 * assetAmount);
        pMaxX += (30 * assetAmount);
        pMinXClean += (15 * assetAmount) / dataEK * dataBottom;
        pMaxXClean += (30 * assetAmount) / dataEK * dataBottom;
      } else if (dataPotential > 6.7) {
        pMinX += (10 * assetAmount);
        pMaxX += (15 * assetAmount);
        pMinXClean += (10 * assetAmount) / dataEK * dataBottom;
        pMaxXClean += (15 * assetAmount) / dataEK * dataBottom;
      } else {
        pMinX += (1 * assetAmount);
        pMaxX += (10 * assetAmount);
        pMinXClean += (1 * assetAmount) / dataEK * dataBottom;
        pMaxXClean += (10 * assetAmount) / dataEK * dataBottom;
      }
    }
  });

  // const avgMin = (pMinXClean / totalAssetsAmount).toFixed(0);
  // const avgMax = (pMaxXClean / totalAssetsAmount).toFixed(0);


  const avgMin = (pMinX / totalAssetsAmount).toFixed(0);
  const avgMax = (pMaxX / totalAssetsAmount).toFixed(0);

  return { avgMin, avgMax };
};

const setColorPot = (dataPotential) => {
  let backgroundColor;

  if (isNaN(dataPotential)) {
    // Invalid or non-numeric data-security or data-potential, use a default color
    backgroundColor = 'rgba(220,220,220,.1)';
  } else if (dataPotential >= 30) {
    backgroundColor = '#41b431';
  } else if (dataPotential >= 20) {
    backgroundColor = '#8ece10';
  } else if (dataPotential >= 15) {
    backgroundColor = '#E0c000';
  } else if (dataPotential >= 8) {
    backgroundColor = '#ff9600';
  } else if (dataPotential > 0) {
    backgroundColor = '#E31612';
  } else {
    backgroundColor = 'rgba(220,220,220,.1)';
  }

  return backgroundColor;
}

function BewertungCard() {
  const [portfolio] = useAtom(portfolioAtom);
  const [sicherheitAverage, setSicherheitAverage] = useState(0);
  const [potential, setPotential] = useState({
    avgMin: 0,
    avgMax: 0
  })
  const t = useTranslations("bewertungCard");

  useEffect(() => {
    if (
      portfolio &&
      portfolio.assetsCalculations
    ) {
      const sicherheitValues = portfolio?.assets
        .filter((asset) => asset.Sicherheit)
        .map((asset) => asset.Sicherheit || 0);
      const avgXFactorValue = portfolio?.assets.map(
        (asset) => (1 / asset?.Bottom) * asset?.Price
      );
      console.log(
        "testing avg Sicherheit ",
        portfolio?.assets,
        avgXFactorValue
      );
      const avgSicherheit =
        sicherheitValues.length > 0
          ? sicherheitValues.reduce((acc, val) => acc + val, 0) /
          sicherheitValues.length
          : 0;
      setSicherheitAverage(avgSicherheit.toFixed(1));
    }
  }, [portfolio]);

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

  useEffect(() => {
    const testFunctionAnything = async () => {
      if (portfolio?.assets) {
        const portfolio1 = portfolio?.assets;
        console.log("portfolio1portfolio1", portfolio1);
        const potentialPromise = await calculatePotential(portfolio1);
        console.log("calculatePotential", potentialPromise);
        setPotential({
          avgMax: potentialPromise.avgMax,
          avgMin: potentialPromise.avgMin
        })
      }
    };
    testFunctionAnything();
    // console.log("portfolio from bewertung", portfolio?.assets)
  }, [portfolio]);

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
              { text: t("hypeCoverage"), color: green[500] },
              { text: t("doubleHypeCoverage"), color: green[500] },
              { text: t("missingHypeTheme"), color: green[500] },
              { text: t("hypeDistribution"), color: yellow[800] },
              { text: t("numberOfCoins"), color: green[500] },
            ].map((item) => (
              <ListItem key={item.text} sx={{ py: 0 }}>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <FiberManualRecordIcon sx={{ color: item.color }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "14px",
                      // "@media only screen and (max-width: 400px)": {
                      // },
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              "@media (max-width:1400px)": {
                flexDirection: "column",
                alignItems: "flex-start",
              },
              "@media (max-width:768px)": {
                flexDirection: "row",
                // alignItems: "flex-start",
              },
              "@media (max-width:500px)": {
                flexDirection: "column",
                // alignItems: "flex-start",
              },
            }}
          >
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
                "@media (max-width:1400px)": {
                  mb: "20px",
                },
              }}
            >
              <span
                style={{ whiteSpace: "nowrap", display: "flex", gap: "4px" }}
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
                style={{ whiteSpace: "nowrap", display: "flex", gap: "4px" }}
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
                {potential.avgMin}-{potential.avgMax}x
              </span>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default BewertungCard;
