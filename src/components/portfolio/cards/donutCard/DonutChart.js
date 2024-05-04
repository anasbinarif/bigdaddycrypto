import React from 'react';
import { Chart } from "react-google-charts";
import {Box} from "@mui/material";

// React Chart Component
const DonutChart = () => {
    const data = [
        ["Category", "Percentage"],
        [`AI`, 5.1],
        ["Web3", 18.2],
        ["DeFi", 6.1],
        ["Grüne Coins", 11.5],
        ["Gaming", 4.6],
        ["BTC", 17.2],
        ["CBDC", 18.3],
        ["ECommerce", 4.5],
        ["Tokenisierung", 14.5],
    ];

    // Define custom colors for each category
    const colors = ['#FFD700', '#DC143C', '#1155bb', '#00aa66', '#00BFFF', '#FF9900', '#667788', '#8833bb', '#ff5aac'];

    const options = {
        // title: "Score und Allocation",
        pieHole: 0.8,
        // pieSliceText: 'none',
        is3D: false,
        pieSliceText: 'none',
        titleTextStyle: {
            color: 'white',
            fontSize: 17,
        },
        legend: {
            position: 'none',
            textStyle: {
                color: 'white',
                fontSize: 12,
            }
        },
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
