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
import { calculatePotential } from "../../../lib/action";

function BewertungCard() {
  const [portfolio] = useAtom(portfolioAtom);
  const [sicherheitAverage, setSicherheitAverage] = useState(0);
  const [potentialAverage, setPotentialAverage] = useState(0);
  const [potentialXAverage, setPotentialXAverage] = useState(0);
  const t = useTranslations("bewertungCard");

  useEffect(() => {
    if (
      portfolio &&
      portfolio.assetsCalculations &&
      portfolio.assetsCalculations.assets.length > 0
    ) {
      // const financialSummaries = calculateFinancialSummaryForAllAssets();
      const sicherheitValues = portfolio?.assets
        .filter((asset) => asset.Sicherheit)
        .map((asset) => asset.Sicherheit || 0);
      const potentialValues = portfolio?.assets
        .filter((asset) => asset.Sicherheit)
        .map((asset) => asset.Potential || 0);
      const avgXFactorValue = portfolio?.assets.map(
        (asset) => (1 / asset?.Bottom) * asset?.Price
      );
      console.log(
        "testing avg Sicherheit ",
        portfolio?.assets,
        avgXFactorValue
      );
      const avgSicherheit =
        sicherheitValues.reduce((acc, val) => acc + val, 0) /
        sicherheitValues.length;
      const avgPotential =
        potentialValues.reduce((acc, val) => acc + val, 0) /
        potentialValues.length;
      const avgXfactor =
        avgXFactorValue.reduce((acc, val) => acc + val, 0) /
        avgXFactorValue.length;
      setPotentialAverage(avgPotential.toFixed(0));
      setSicherheitAverage(avgSicherheit.toFixed(1));
      setPotentialXAverage(avgXfactor.toFixed(0));
    }
  }, [portfolio]);

  const calculateFinancialSummaryForAllAssets = () => {
    return portfolio.assetsCalculations.assets.map((asset) => {
      const assetDetails =
        portfolio.assets?.find((a) => a.CoinGeckoID === asset.CoinGeckoID) ||
        {};
      const price = assetDetails.Price || 0;
      const Potential = assetDetails.Potential || 0;
      const Sicherheit = assetDetails.Sicherheit || 0;
      const totalCoins = asset.buyAndSell.reduce((acc, row) => {
        const coinsValue = parseFloat(row.Coins);
        return row.Type === "Kauf" ? acc + coinsValue : acc - coinsValue;
      }, 0);
      const totalHoldingsValue = (totalCoins * parseFloat(price)).toFixed(2);
      const totalInvested = asset.buyAndSell
        .reduce((acc, row) => acc + parseFloat(row.Betrag), 0)
        .toFixed(2);

      return {
        CoinGeckoID: asset.CoinGeckoID,
        totalCoins,
        totalHoldingsValue,
        totalInvested,
        Potential,
        Sicherheit,
      };
    });
  };

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
        const potentialPromise = await calculatePotential(portfolio1);
        console.log("calculatePotential", potentialPromise);
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
                  backgroundColor: "rgb(142, 206, 16)",
                  padding: "4px 8px 2px",
                  textShadow: "1px 1px 5px rgba(0,0,0,.4)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                {potentialAverage}-{potentialXAverage}x
              </span>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default BewertungCard;
