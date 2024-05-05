import React from 'react';
import { Chart } from "react-google-charts";
import { Box } from "@mui/material";

const categoriesDisplay = {
    "ai": 'AI',
    "web3": 'Web3/ Anonymität',
    "defi": 'DeFi',
    "green": 'Grüne Coins',
    "metaverse": 'Gaming/ Metaverse',
    "btc": 'BTC- Zusammenhang',
    "cbdc": 'CBDC- Netzwerke',
    "ecommerce": 'eCommerce',
    "nft": 'Tokenisierung/ RWA',
};

const categoryColors = {
    'AI': '#FFD700',
    'metaverse': '#00BFFF',
    'DEFI': '#1155bb',
    'WEB3': '#DC143C',
    'GREEN': '#00aa66',
    'BTC': '#FF9900',
    'CBDC': '#667788',
    'ECOMMERCE': '#8833bb',
    'NFT': '#ff5aac',
};

const DonutChart = ({ portfolioCalculations }) => {
    // Prepare the data for the chart using portfolioCalculations
    const data = [
        ["Category", "Percentage"],
        ...Object.entries(portfolioCalculations.percentages || {}).map(([key, value]) => {
            return [categoriesDisplay[key] || key, parseFloat(value.replace('%', ''))]
        })
    ];

    // Define custom colors for each category
    const colors = data.slice(1).map(item => categoryColors[item[0].toUpperCase()] || '#CCCCCC');

    const options = {
        pieHole: 0.8,
        pieSliceText: 'none',
        is3D: false,
        legend: { position: 'none' },
        tooltip: {
            textStyle: { color: 'black' }, showColorCode: true
        },
        colors: colors,
        chartArea: { width: '40%', height: '40%' },
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
        <Box sx={{ position: "absolute", left: "135px" }}>
            <Chart
                chartType="PieChart"
                height="400px"
                width="100%"
                data={data}
                options={options}
            />
        </Box>
    );
}

export default DonutChart;
