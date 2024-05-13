import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { green, yellow } from '@mui/material/colors';
import { Box } from '@mui/material';
import CustomizedTooltips from "@/components/toolTip/CustomizedTooltip";
import { useAtom } from 'jotai';
import { portfolioAtom } from '@/app/stores/portfolioStore';
import {useEffect, useState} from "react";

function BewertungCard() {
    const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });
    const [sicherheitAverage, setSicherheitAverage] = useState(0);

    useEffect(() => {
        if (portfolio && portfolio.assetsCalculations && portfolio.assetsCalculations.assets.length > 0) {
            const financialSummaries = calculateFinancialSummaryForAllAssets();
            // console.log("financialSummaries--", financialSummaries);
            const sicherheitValues = financialSummaries.map(asset => asset.Sicherheit || 0);
            const avgSicherheit = sicherheitValues.reduce((acc, val) => acc + val, 0) / sicherheitValues.length;
            setSicherheitAverage(avgSicherheit.toFixed(1));
        }
    }, [portfolio]);

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


    return (
        <Card sx={{ bgcolor: "#202530", color: 'white', height: "100%", borderRadius: 2, }}>
            <CardContent>
                <Typography sx={{ fontSize: 14, fontWeight: 'bold' }} gutterBottom>
                    Bewertung
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <List sx={{ bgcolor: "#00000033", borderRadius: "8px" }} >
                        {[
                            { text: 'Abdeckung von Hype-Themen', color: green[500] },
                            { text: 'Doppelte Abdeckung von Hype-Themen', color: green[500] },
                            { text: 'Fehlendes Hype-Thema', color: green[500] },
                            { text: 'Verteilung der gewählten Hype-Themen', color: yellow[800] },
                            { text: 'Anzahl an Coins', color: green[500] }
                        ].map(item => (
                            <ListItem key={item.text} sx={{ py: 0 }}>
                                <ListItemIcon sx={{ minWidth: "30px" }}>
                                    <FiberManualRecordIcon sx={{ color: item.color }} />
                                </ListItemIcon>
                                <ListItemText primary={item.text} sx={{ fontSize: '13px' }} />
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography component="div"
                            sx={{
                                alignItems: "center", gap: "25px",
                                backgroundColor: "#00000033", padding: "10px 16px",
                                borderRadius: "8px", display: "flex", fontSize: "14px"
                            }}>
                            <span style={{ whiteSpace: "nowrap", display: "flex", gap: "4px" }}> Sicherheit Ø
                                <CustomizedTooltips text1="Dieser Wert ergibt sich aus dem Durchschnitt der
                                Sicherheit aller Assets im Portfolio. Die Angaben basieren auf der
                                Position im Graphen." text2="Assets die nicht im Graphen eingeordnet
                                sind werden nicht berücksichtigt." />
                            </span> <span style={{
                                color: "white",
                                backgroundColor: "rgb(65, 180, 49)",
                                padding: "4px 8px 2px",
                                textShadow: "1px 1px 5px rgba(0,0,0,.4)",
                                borderRadius: "6px", fontSize: "14px"
                            }}>{sicherheitAverage}</span>
                        </Typography>
                        <Typography component="div" sx={{
                            alignItems: "center",
                            gap: "25px", backgroundColor: "#00000033", padding: "10px 16px",
                            borderRadius: "8px", display: "flex", fontSize: "14px"
                        }}>
                            <span style={{ whiteSpace: "nowrap", display: "flex", gap: "4px" }}> Potential Ø
                                <CustomizedTooltips text1="Dieser Wert ergibt sich aus dem Durchschnitt
                                des Potentials aller Assets im Portfolio. Die Angaben basieren auf der
                                Position im Graphen. Bei der Berechnung wird der Einkaufspreis berücksichtigt,
                                da das Potential auf dem jeweiligen Low der letzten 12 Monate beruht."
                                    text2="Assets die nicht im Graphen eingeordnet sind werden nicht
                                                    berücksichtigt." />
                            </span> <span style={{
                                color: "white",
                                backgroundColor: "rgb(142, 206, 16)",
                                padding: "4px 8px 2px",
                                textShadow: "1px 1px 5px rgba(0,0,0,.4)",
                                borderRadius: "6px", fontSize: "14px"
                            }}>23-36x</span>
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default BewertungCard;
