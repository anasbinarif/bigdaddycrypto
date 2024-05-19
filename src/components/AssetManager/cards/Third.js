"use client";
import { Box, Divider, Typography } from "@mui/material";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai/index";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import {portfolioAtom} from '../../../../src/app/stores/portfolioStore';

const Third = () => {
    const t = useTranslations("third");
    const [portfolio] = useAtom(portfolioAtom, { assets: [] });
    const totalInvestment = portfolio.assetsCalculations.assets.reduce((acc, curr) => acc + curr.totalInvest, 0).toFixed(2);
    const totalGesamtwert = portfolio.assetsCalculations.assets.reduce((acc, curr) => acc + curr.Holdings, 0).toFixed(2);
    const aktuellerProfit = (totalGesamtwert - totalInvestment).toFixed(2);
    const gesamtwertPercentage = ((aktuellerProfit / totalInvestment) * 100).toFixed(2);

    useEffect(() => {
        console.log("portfolioportfolio", portfolio);
    }, [portfolio]);

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
            <Box sx={{ fontSize: "120%", fontWeight: "bold" }}>
                {t("portfolioOverview")}
                <FontAwesomeIcon
                    icon={faCrown}
                    style={{ paddingLeft: "10px", opacity: "0.25", fontSize: "0.9rem" }}
                />
            </Box>
            <Divider />
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
                <Typography sx={{ fontSize: "0.9rem" }}>{t("totalValue")}</Typography>
                <Typography sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                    {totalGesamtwert},00 €
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
                    <Typography sx={{ fontSize: "0.9rem", opacity: "0.5" }}>
                        {t("totalInvestment")}
                    </Typography>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                        {totalInvestment},00 €
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.9rem", opacity: "0.5" }}>
                        {t("currentProfit")}
                    </Typography>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                        {aktuellerProfit},00 €
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.9rem", opacity: "0.5" }}>
                        {t("realizedSoFar")}
                    </Typography>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                        0,00 €
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.9rem", opacity: "0.5" }}>
                        {t("totalPotential")}
                        <FontAwesomeIcon
                            icon={faQuestionCircle}
                            style={{ opacity: "0.5", marginLeft: "0.5rem" }}
                        />
                    </Typography>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                        0,00 €
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Third;
