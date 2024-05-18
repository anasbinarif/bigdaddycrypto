import * as React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useAtom } from "jotai/index";
import { portfolioAtom } from "@/app/stores/portfolioStore";
import { Chart } from "react-google-charts";


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

export const data = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7], // CSS-style declaration
];
export default function Item1({ loadingPortfolio }) {
    const [portfolio] = useAtom(portfolioAtom);
    const [graphPercentage, setGraphPercentage] = useState([])
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        if (portfolio.assetsCalculations && portfolio.assets) {
            const totalInvestment = portfolio.assetsCalculations.assets.reduce((acc, curr) => acc + curr.totalInvest, 0);
            const mergedData = portfolio.assets.map(asset => {
                const calc = portfolio.assetsCalculations.assets.find(ac => ac.CoinGeckoID === asset.CoinGeckoID) || {};
                const percentage = totalInvestment ? ((calc.totalInvest / totalInvestment) * 100).toFixed(2) : 0;
                return {
                    percentage: percentage + '%',
                    ticker: asset.Ticker
                };
            });
            setGraphPercentage(mergedData);
        }
    }, [portfolio]);
    useEffect(() => {
        const data = [
            ["Ticker", "Percentage"],
            ...graphPercentage.map(item => [item.ticker, parseFloat(item.percentage.replace("%", ""))])
        ];
        setGraphData(data);
        console.log("graphData", graphData)

    }, [graphPercentage]);

    useEffect(() => {
        console.log("graphPercentage", graphPercentage, graphData)
    }, [graphPercentage, graphData])
    const assetsLength = portfolio?.assetsCalculations?.assets.length;
    const totalInvestment = portfolio.assetsCalculations.assets.reduce((acc, curr) => acc + curr.totalInvest, 0);
    const totalGesamtwert = portfolio.assetsCalculations.assets.reduce((acc, curr) => acc + curr.Holdings, 0).toFixed(2);
    const aktuellerProfit = (totalGesamtwert - totalInvestment).toFixed(2);

    return (
        <Box
            sx={{
                display: "flex",
                backgroundColor: "#202530",
                color: "white",
                height: "70%",
                borderRadius: "8px",
                padding: "25px",
            }}
        >
            <Box
                sx={{
                    backgroundColor: "#202530",
                    color: "white",
                    height: "100%",
                    width: "50%",
                    borderRadius: "8px",
                    //   padding: "25px",
                }}
            >
                <Box sx={{ fontSize: "120%", fontWeight: "bold" }}>
                    Portfolio-Überblick
                    <FontAwesomeIcon
                        icon={faCrown}
                        style={{ paddingLeft: "10px", opacity: "0.25", fontSize: "0.9rem" }}
                    />
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        //   alignItems: "center",
                        backgroundColor: "#00000033",
                        padding: "1rem",
                        marginTop: "1rem",
                    }}
                >
                    <Typography sx={{ fontSize: "0.9rem" }}>Gesamtwert</Typography>
                    <Typography sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                        0,00 €
                    </Typography>
                    <Typography
                        className="down"
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
                        -100.0%
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
                            Gesamt Invest
                        </Typography>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                            {totalInvestment} €
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: "0.8rem", opacity: "0.5" }}>
                            Aktueller Profit
                        </Typography>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                            {aktuellerProfit},00 €
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative"
                }}
            >
                <Chart
                    chartType="PieChart"
                    width="100%"
                    height="400px"
                    data={graphData}
                    options={options}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%", // Center vertically in the donut hole
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center", // Center text horizontally
                        zIndex: "100",
                    }}
                >
                    <Typography sx={{ fontSize: "2rem", fontWeight: "bold" }}>{assetsLength}</Typography>
                    <Typography sx={{ fontSize: "1rem" }}>assets</Typography>
                </Box>
            </Box>
        </Box>
    );
}