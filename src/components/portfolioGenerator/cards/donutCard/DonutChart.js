import React from 'react';
import { Chart } from "react-google-charts";
import { Box, Typography } from "@mui/material";
import { categoriesDisplay } from "@/lib/data";

const categoryColors = {
    'AI': '#FFD700',
    'Gaming/ Metaverse': '#00BFFF',
    'DeFi': '#1155bb',
    'Web3/ Anonymität': '#DC143C',
    'Grüne Coins': '#00aa66',
    'BTC- Zusammenhang': '#FF9900',
    'CBDC- Netzwerke': '#667788',
    'eCommerce': '#8833bb',
    'Tokenisierung/ RWA': '#ff5aac',
};

const DonutChart = ({ portfolioCalculations, loadingPortfolio }) => {
    const data = loadingPortfolio ? [
        ["Category", "Percentage"],
        ...Object.entries(portfolioCalculations.percentages || {}).map(([key, value]) => {
            return [categoriesDisplay[key] || key, parseFloat(value.replace('%', ''))]
        })
    ] : [["Category", "Percentage"], ["AI", 100.0],];

    const colors = data.slice(1).map(item => categoryColors[item[0]] || '#CCCCCC');

    const options = {
        pieHole: 0.8,
        pieSliceText: 'none',
        is3D: false,
        legend: { position: 'none' },
        tooltip: {
            textStyle: { color: 'black' }, showColorCode: true
        },
        colors: colors,
        chartArea: { width: '80%', height: '80%' },
        backgroundColor: 'none',
        animation: {
            startup: true,
            easing: 'linear',
            duration: 1500,
        },
        pieSliceBorderColor: 'none',
        textStyle: {
            color: 'white',
        }
    };

    return (
        <Box sx={{ position: "relative", width: "56%", height: "250px" }}>
            <Chart
                chartType="PieChart"
                height="300px"
                width="100%"
                data={data}
                options={options}
            />
            <Box sx={{
                position: "absolute",
                top: "60%",  // Center vertically in the donut hole
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",  // Center text horizontally
                zIndex: "tooltip"
            }}>
                <Typography variant="caption" style={{ color: '#FFFFFF' }}>
                    Score  {/* Rating Description */}
                </Typography>
                <Typography variant="h4" component="div" style={{ color: '#FFFFFF' }}>
                    98.5  {/* Score */}
                </Typography>
                <Typography variant="caption" style={{ color: '#FFFFFF' }}>
                    Sehr gut  {/* Rating Description */}
                </Typography>
            </Box>
        </Box>
    );
}

export default DonutChart;
