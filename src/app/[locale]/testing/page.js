"use client";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Container, Typography, Slider, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Image from "next/image";
import Graph from "../../../../public/assets/svg/BDC-Graph.svg";
import { getAssetTest } from "../../../lib/data";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";

const Testing = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState({ visible: false, data: {} });
    const [symbolSize, setSymbolSize] = useState(15);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState("");

    useEffect(() => {
        getAssetTest()
            .then((data) => {
                console.log("datadatadata", data);
                setAssets(data);
            })
            .catch((error) => {
                console.log("error.message", error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    const calculatePosition = (value, offset) => {
        return `calc(${(100 / 12) * 1 + (100 / 12) * value}% - ${offset}px)`;
    };

    const handleCoinClick = (asset) => {
        setTooltip({ visible: !tooltip.visible, data: asset });
    };

    const filteredAssets = assets.filter(asset =>
        asset.Name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedItem === "" || asset.Category === selectedItem)
    );

    return (
        <>
            <Navbar />
            <Box sx={{
                backgroundColor: "#111826",
                color: "#fff",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginTop: "8%"
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
                    }}>Symbol Size:</Typography>
                    <Slider
                        defaultValue={15}
                        min={5}
                        max={37}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        onChange={(e, newValue) => setSymbolSize(newValue)}
                    />
                </Box>
                <Box sx={{
                    width: "20%",
                }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            backgroundColor: "#202530",
                            borderRadius: "5px",
                            border: "none",
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#ffffff', // Set border color to white
                                },
                                '&:hover fieldset': {
                                    borderColor: '#ffffff', // Set border color to white on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ffffff', // Set border color to white when focused
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#ffffff', // Set label color to white
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#ffffff', // Set label color to white when focused
                            },
                            '& .MuiInputBase-input': {
                                color: '#ffffff', // Set text color to white
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ffffff',
                            }
                        }}
                    />
                </Box>
                <FormControl sx={{
                    m: 1,
                    backgroundColor: "#202530",
                    width: "20%",
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#ffffff', // Set border color to white
                        },
                        '&:hover fieldset': {
                            borderColor: '#ffffff', // Set border color to white on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#ffffff', // Set border color to white when focused
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#ffffff', // Set label color to white
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#ffffff', // Set label color to white when focused
                    },
                    '& .MuiSelect-icon': {
                        color: '#ffffff', // Set dropdown icon color to white
                    },
                    '& .MuiSelect-select': {
                        color: '#ffffff', // Set text color to white
                    },
                }}>
                    <InputLabel id="demo-simple-select-label">All Categories</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedItem}
                        label="All Categories"
                        onChange={(e) => setSelectedItem(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {/* Replace this with your dynamic category list */}
                        {["Category1", "Category2", "Category3"].map((category) => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Container
                sx={{
                    position: "relative",
                    maxWidth: "100%",
                    height: "1200px", // Increase the height to make the image larger
                    marginTop: "1rem",
                    backgroundColor: "#111826",
                    overflow: "hidden", // Ensure any overflow is hidden
                    padding: "0px",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Image src={Graph} layout="fill" objectFit="cover" alt="Background" />
                    {filteredAssets.map((asset) => (
                        <Box
                            key={asset._id}
                            component="div"
                            sx={{
                                position: "absolute",
                                left: calculatePosition(asset.Potential, symbolSize / 2), // Adjust the offset (symbolSize / 2) based on icon size/2
                                top: `calc(100% - ${calculatePosition(asset.Sicherheit, symbolSize / 2)})`, // Adjust the offset (symbolSize / 2) based on icon size/2
                                transform: "translate(-50%, -50%)",
                                transition: "all 0.3s",
                                cursor: "pointer",
                                '&:hover': {
                                    transform: "scale(1.9) translate(-50%, -50%)",
                                },
                            }}
                            onClick={() => handleCoinClick(asset)}
                        >
                            <Image
                                src={asset.cgImageURL}
                                alt={asset.Name}
                                width={symbolSize}
                                height={symbolSize}
                                style={{
                                    borderRadius: "50%",
                                    boxShadow: "3px 3px 12px rgba(0,0,0,.1)",
                                }}
                            />
                        </Box>
                    ))}
                </Box>
                {tooltip.visible && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#fff",
                            padding: "1rem",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
                            zIndex: 1000,
                        }}
                    >
                        <Typography variant="h6">{tooltip.data.Name}</Typography>
                        <Typography>Potential: {tooltip.data.Potential}</Typography>
                        <Typography>Safety: {tooltip.data.Sicherheit}</Typography>
                        <Typography>Market Cap: {tooltip.data.MarketCap}</Typography>
                        <Typography>Price: {tooltip.data.Price}</Typography>
                    </Box>
                )}
            </Container>
            <Footer />
        </>
    );
};

export default Testing;
