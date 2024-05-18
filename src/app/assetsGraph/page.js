"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { Box, FormControl, InputLabel, MenuItem, Select, Slider, TextField, Typography } from '@mui/material';
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { getAssets, getCategoryColor } from "@/lib/data";

const backgroundAreaPlugin = {
    id: 'backgroundAreaPlugin',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        const xAxis = chart.scales.x;
        const yAxis = chart.scales.y;

        const shapes = [
            {
                color: 'red',
                points: [
                    { x: 0, y: 0 },
                    { x: 9, y: 0 },
                    { x: 8, y: 5.5 },
                    { x: 0, y: 5.5 },
                ]
            },
            {
                color: '#e76808',
                points: [
                    { x: 9, y: 0 },
                    { x: 10, y: 0 },
                    { x: 10, y: 3 },
                    { x: 8.45, y: 3 }
                ]
            },
            {
                color: '#dfe052',
                points: [
                    { x: 8.45, y: 3 },
                    { x: 10, y: 3 },
                    { x: 10, y: 5.5 },
                    { x: 8, y: 5.5 }
                ]
            },
            {
                color: '#f8bea0',
                points: [
                    { x: 0, y: 5.5 },
                    { x: 8, y: 5.5 },
                    { x: 7, y: 10 },
                    { x: 0, y: 10 }
                ]
            },
            {
                color: '#bfdcb1',
                points: [
                    { x: 8, y: 5.5 },
                    { x: 10, y: 5.5 },
                    { x: 10, y: 7 },
                    { x: 7.5, y: 7 }
                ]
            },
            {
                color: '#96c456',
                points: [
                    { x: 7.5, y: 7 },
                    { x: 10, y: 7 },
                    { x: 10, y: 10 },
                    { x: 7, y: 10 }
                ]
            }
        ];

        shapes.forEach(shape => {
            ctx.beginPath();
            ctx.fillStyle = shape.color;
            shape.points.forEach((point, index) => {
                const xPixel = xAxis.getPixelForValue(point.x);
                const yPixel = yAxis.getPixelForValue(point.y);
                if (index === 0) {
                    ctx.moveTo(xPixel, yPixel);
                } else {
                    ctx.lineTo(xPixel, yPixel);
                }
            });
            ctx.closePath();
            ctx.fill();
        });
    }
};



const backgroundColorPlugin = {
    id: 'backgroundColorPlugin',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        const canvas = ctx.canvas;
        ctx.save();
        ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
};

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, backgroundColorPlugin, backgroundAreaPlugin);

const reverseMapping = {
    ai: "AI",
    web3: "Web3/Anonymität",
    defi: "DeFi",
    green: "Grüne Coins",
    metaverse: "Gaming/Metaverse",
    btc: "BTC-Zusammenhang",
    cbdc: "CBDC-Netzwerke",
    ecommerce: "ECommerce",
    nft: "Tokenisierung/RWA",
    none: "Kein Hype-Thema",
};

const imagePlugin = {
    id: 'customImagePlugin',
    afterDraw: (chart) => {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
                meta.data.forEach((element, index) => {
                    const { x, y } = element.tooltipPosition();
                    const image = new Image();
                    image.src = dataset.data[index].cgImageURL;
                    const size = element.options.radius * 2;

                    // Start clipping in a circle
                    ctx.save(); // Save the current state
                    ctx.beginPath(); // Start a new path
                    ctx.arc(x, y, size / 2, 0, Math.PI * 2, true); // Create a circle path
                    ctx.clip(); // Clip to the circle

                    // Draw the image inside the clipped circle
                    ctx.drawImage(image, x - size / 2, y - size / 2, size, size);

                    ctx.restore(); // Restore the original state, removing the clipping
                });
            }
        });
    }
};


const BubbleChart = () => {
    const [radius, setRadius] = useState(15);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const [chartData, setChartData] = useState({ datasets: [] });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getAssets()
            .then(data => {
                const data1 = data.data;
                const categorySet = new Set(data1.map(item => item.Category));
                setCategories([...categorySet]);

                const filteredData = data1.filter(item => {
                    return item.Name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        (selectedItem ? item.Category === selectedItem : true);
                });

                const groupedData = filteredData.reduce((acc, item) => {
                    const category = item.Category || 'none';
                    acc[category] = acc[category] || [];
                    acc[category].push({
                        x: item.Potential,
                        y: item.Sicherheit,
                        r: radius,
                        Name: item.Name,
                        MarketCap: item.MarketCap,
                        Price: item.Price,
                        cgImageURL: item.cgImageURL
                    });
                    return acc;
                }, {});

                const datasets = Object.keys(groupedData).map((category) => ({
                    label: reverseMapping[category] || category,
                    data: groupedData[category],
                    backgroundColor: getCategoryColor(category)
                }));

                setChartData({ datasets });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [radius, searchTerm, selectedItem]);

    const options = useMemo(() => ({
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Sicherheit',
                    color: '#ccc', // Set the color of the axis label to red
                    font: {
                        size: 40, // Set font size for axis title
                        weight: 'bold' // Set font weight to bold for axis title
                    }
                },
                ticks: {
                    color: '#969696', // Set the color of ticks to red
                    font: {
                        size: 30, // Set font size
                        weight: 'bold' // Set font weight to bold
                    },
                    stepSize: 1,
                    max: 10
                }
            },
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Potential',
                    color: '#ccc', // Set the color of the axis label to red
                    font: {
                        size: 40, // Set font size for axis title
                        weight: 'bold' // Set font weight to bold for axis title
                    }
                },
                ticks: {
                    color: '#969696', // Set the color of ticks to red
                    font: {
                        size: 30, // Set font size
                        weight: 'bold' // Set font weight to bold
                    },
                    stepSize: 1,
                    max: 10
                }
            }
        },
        plugins: {
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (context) {
                        const item = context.raw;
                        return [
                            `Name: ${item.Name}`,
                            `Potential: ${item.x}`,
                            `Sicherheit: ${item.y}`,
                            `Market Cap: ${item.MarketCap ? item.MarketCap.toLocaleString() : 'N/A'}`,
                            `Price: ${item.Price ? item.Price.toFixed(2) : 'N/A'}`
                        ];
                    }
                }
            }
        },
        chartArea: {
            backgroundColor: '#111826'
        }
    }), []);


    return <>
        <Navbar />
        <Box sx={{ marginTop: "9rem", backgroundColor: "#111826", marginLeft: "6rem", marginRight: "6rem", }}>
            <Box sx={{
                backgroundColor: "#111826",
                color: "#fff",
                display: "flex",
                justifyContent: "space-evenly",
                marginBottom: "3rem",
                alignItems: "center"
            }}>
                <Box sx={{
                    mx: 1, width: "20%", display: "flex",
                    alignItems: "center", gap: "5px", backgroundColor: "#202530",
                    border: "none", borderRadius: "5px",
                    padding: "10px 10px"
                }}>
                    <Typography sx={{
                        fontSize: "13px",
                        color: "#aaa",
                        whiteSpace: "nowrap"
                    }}>Symbol-Größe:</Typography>
                    <Slider
                        defaultValue={15}
                        min={10}
                        max={37}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        onChange={(e, newValue) => setRadius(newValue)}
                    />
                </Box>
                <Box sx={{
                    width: "20%",
                }}>
                    <TextField
                        label="Suche..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ backgroundColor: "#202530", borderRadius: "5px", border: "none" }}
                    />
                </Box>
                <FormControl sx={{ m: 1, backgroundColor: "#202530", width: "20%" }}>
                    <InputLabel id="demo-simple-select-label">Alle Hypethemen</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedItem}
                        label="Alle Hypethemen"
                        onChange={(e) => setSelectedItem(e.target.value)}
                    >
                        <MenuItem value="">All Categories</MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>{reverseMapping[category]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Bubble options={options} plugins={[imagePlugin]} data={chartData} height={300} />
        </Box>
        <Footer />
    </>;
};

export default BubbleChart;
