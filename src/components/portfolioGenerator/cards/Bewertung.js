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

function BewertungCard() {
    const [portfolio] = useAtom(portfolioAtom);
    const [sicherheitAverage, setSicherheitAverage] = useState(0);
    const t = useTranslations("bewertungCard");

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        if (
            portfolio &&
            portfolio.assetsCalculations &&
            portfolio.assetsCalculations.assets.length > 0
        ) {
            const financialSummaries = calculateFinancialSummaryForAllAssets();
            const sicherheitValues = financialSummaries.map(
                (asset) => asset.Sicherheit || 0
            );
            const avgSicherheit =
                sicherheitValues.reduce((acc, val) => acc + val, 0) /
                sicherheitValues.length;
            setSicherheitAverage(avgSicherheit.toFixed(1));
        }
    }, [portfolio]);

    const calculateFinancialSummaryForAllAssets = () => {
        return portfolio.assetsCalculations.assets.map((asset) => {
            const assetDetails = portfolio.assets?.find(
                (a) => a.CoinGeckoID === asset.CoinGeckoID
            ) || {};
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

    return (
        <Card
            sx={{
                bgcolor: "#202530",
                color: "white",
                height: "100%",
                borderRadius: 2,
            }}
        >
            <CardContent>
                <Typography sx={{ fontSize: 14, fontWeight: "bold" }} gutterBottom>
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
                                <ListItemText primary={item.text} sx={{ fontSize: "13px" }} />
                            </ListItem>
                        ))}
                    </List>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: isSmallScreen ? "column" : "row",
                            justifyContent: "space-between",
                            gap: "10px",
                        }}
                    >
                        <Typography
                            component="div"
                            sx={{
                                alignItems: "center",
                                gap: "25px",
                                backgroundColor: "#00000033",
                                padding: "10px 16px",
                                borderRadius: "8px",
                                display: "flex",
                                fontSize: "14px",
                                flexDirection: isSmallScreen ? "column" : "row",
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
                                    backgroundColor: "rgb(65, 180, 49)",
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
                                gap: "25px",
                                backgroundColor: "#00000033",
                                padding: "10px 16px",
                                borderRadius: "8px",
                                display: "flex",
                                fontSize: "14px",
                                flexDirection: isSmallScreen ? "column" : "row",
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
                                23-36x
                            </span>
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default BewertungCard;
