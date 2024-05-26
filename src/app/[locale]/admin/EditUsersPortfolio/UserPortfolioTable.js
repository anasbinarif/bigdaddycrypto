import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Box,
    Typography,
    createTheme,
    ThemeProvider,
    styled,
    Button,
    MenuItem,
    Select
} from "@mui/material";
import { categoryColors, categoryColorsNew } from "../../../../lib/data"; // Import categoryColors directly

const CategoryColorBar = styled(Box)(({ colors }) => {
    const gradient = colors.length > 1 ? `linear-gradient(${colors.join(", ")})` : colors[0];
    return {
        width: "5px",
        height: "100%",
        backgroundColor: gradient,
        position: "absolute",
        left: 0,
        top: 0,
        background: gradient,
    };
});

const StyledTypography = styled(Typography)({
    whiteSpace: "nowrap",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0px",
});

// Create a dark theme
const darkTheme = createTheme({
    palette: {
        mode: "dark", // Enables dark mode
    },
});

const options = [
    "n/a",
    "Scam?",
    "Bad",
    "Naja",
    "Ok",
    "Gut",
    "Honey"
];

const colorMap = {
    "Scam?": "#B21C3C",
    "💀": "#B21C3C",
    "Bad": "#CE3F24",
    "Naja": "#CE8A2C",
    "Ok": "#CFD138",
    "Gut": "#8FD141",
    "Honey": "#31A93A"
};

const valueMap = {
    1: "Scam?",
    2: "Bad",
    3: "Naja",
    4: "Ok",
    5: "Gut",
    6: "Honey",
    "Scam?": 1,
    "💀": 1,
    "Bad": 2,
    "Naja": 3,
    "Ok": 4,
    "Gut": 5,
    "Honey": 6
};

const UserPortfolioTable = ({ portfolio, setSelectedUserPortfolio }) => {
    const [sortedData, setSortedData] = useState([]);
    const [dropdownValues, setDropdownValues] = useState({});

    useEffect(() => {
        if (portfolio.assetsCalculations && portfolio.assets) {
            const totalInvestment = portfolio.assetsCalculations.assets.reduce(
                (acc, curr) => acc + curr.totalInvest,
                0
            );

            const mergedData = portfolio.assets.map((asset) => {
                const calc =
                    portfolio.assetsCalculations.assets.find(
                        (ac) => ac.CoinGeckoID === asset.CoinGeckoID
                    ) || {};
                const percentage = totalInvestment
                    ? ((calc.totalInvest / totalInvestment) * 100).toFixed(2)
                    : 0;
                const xValue = calc.totalInvest ? (calc.Holdings / calc.totalInvest).toFixed(2) : "NaN";
                const pricePercentage = calc.DCA ? (
                    ((asset.Price - calc.DCA) / calc.DCA) *
                    100
                ).toFixed(2) : "Infinity";
                return {
                    asset: asset.Name,
                    ticker: asset.Ticker,
                    imageUrl: asset.cgImageURL,
                    bestand: calc.Holdings || 0,
                    totalCoins: calc.totalCoins || 0,
                    preisChange: asset.Price.toFixed(2),
                    dcaPrice: calc.DCA || "n/a",
                    investition: calc.totalInvest || 0,
                    relevanz: valueMap[calc.Relevanz] || "n/a",
                    dca: valueMap[calc.DCA_0] || "n/a",
                    gewichtung: valueMap[calc.Gewichtung] || "n/a",
                    category: asset.Category,
                    percentage: `${percentage}%`,
                    X: xValue,
                    pricePercentage,
                };
            });
            setSortedData(mergedData);
        }
        console.log("portfolioportfolio", portfolio)
    }, [portfolio]);
    const assetsLeangth = portfolio?.assets?.length;

    const getCategoryColors = (categories) => {
        return categories.map((category) => categoryColorsNew[category] || "#ffffff");
    };

    const getRandomColor = (index) => {
        let color = '#';
        const letters = '0123456789ABCDEF';
        for (let i = 0; i < 6; i++) {
            // Use the index and bitwise operations to determine the color
            color += letters[(index * (i + 1) * 7) % 16];
        }
        return color;
    };

    const handleDropdownChange = (event, rowIndex, column) => {
        const newValue = event.target.value;
        setDropdownValues(prevState => ({
            ...prevState,
            [rowIndex]: {
                ...prevState[rowIndex],
                [column]: newValue
            }
        }));
    };

    const getDropdownBackgroundColor = (value) => {
        return colorMap[value] || "transparent";
    };

    const handleUpdate = async () => {
        const updatedAssets = portfolio.assetsCalculations?.assets.map((asset, index) => {
            const newRelevanz = valueMap[dropdownValues[index]?.relevanz || asset.Relevanz];
            const newDca = valueMap[dropdownValues[index]?.dca || asset?.DCA_0];
            const newGewichtung = valueMap[dropdownValues[index]?.gewichtung || asset.Gewichtung];
            return {
                ...asset,
                Relevanz: newRelevanz || 0,
                DCA_0: newDca || 0,
                Gewichtung: newGewichtung || 0,
            };
        });
        const userId = portfolio?.assetsCalculations.userId;
        console.log("updatedValuesupdatedValues", updatedAssets);

        const response = await fetch('/api/updateUserPortfolio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                updatedAssets
            })
        });

        if (response.ok) {
            const updatedPortfolio = await response.json();
            setSelectedUserPortfolio(updatedPortfolio);
        } else {
            console.error("Failed to update portfolio");
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: "#202530",
                color: "white",
                height: "100%",
                borderRadius: "8px",
                padding: "35px 20px",
                overflowX: "auto",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Portfolio ({assetsLeangth})
                </Typography>
                <Button
                    sx={{
                        backgroundColor: "#1188ff",
                        color: "white",
                        fontSize: "0.8rem",
                        "&:hover": { backgroundColor: "#0a549f" },
                    }}
                    onClick={handleUpdate}
                >
                    Update
                </Button>
            </Box>
            <ThemeProvider theme={darkTheme}>
                <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead
                            sx={{
                                "& .MuiTableCell-root": {
                                    padding: "2px",
                                    "&:first-child": {
                                        padding: "16px",
                                    },
                                },
                            }}
                        >
                            <TableRow>
                                {[
                                    "Asset",
                                    "Bestand",
                                    "X",
                                    "Preis /+-%",
                                    "DCA Preis",
                                    "Investition",
                                    "Relevanz",
                                    "DCA",
                                    "Gewichtung",
                                ].map((headCell) => (
                                    <TableCell
                                        key={headCell}
                                        sx={{
                                            fontSize: "12px",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {headCell}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedData.map(
                                (row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                            },
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            sx={{ padding: "0px", width: "24%" }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    p: 2,
                                                    borderRadius: 0,
                                                    position: "relative",
                                                }}
                                            >
                                                <CategoryColorBar colors={getCategoryColors(row.category)} />
                                                <Box display="flex" alignItems="center">
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar
                                                            alt={row.asset}
                                                            src={row.imageUrl}
                                                            sx={{ width: 20, height: 20, marginRight: 1 }}
                                                        />
                                                        <Typography sx={{ fontSize: "14px" }}>
                                                            {row.asset} ({row.ticker})
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        component={Typography}
                                                        sx={{
                                                            ml: 1,
                                                            bgcolor: `${getRandomColor(index)}`,
                                                            padding: "1px 4px 0",
                                                            borderRadius: "12px",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {row.percentage}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            sx={{ padding: "5px" }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "end",
                                                }}
                                            >
                                                <StyledTypography sx={{ fontSize: "14px" }}>
                                                    {row.bestand}
                                                </StyledTypography>
                                                <StyledTypography sx={{ color: "#999", fontSize: "12px" }}>
                                                    {row.totalCoins} {row.ticker}
                                                </StyledTypography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ padding: "5px 0 5px 5px" }}>
                                            <StyledTypography>
                                                {row.X ? row.X : "0,00"}x
                                            </StyledTypography>
                                        </TableCell>
                                        <TableCell sx={{ padding: "5px" }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "end",
                                                }}
                                            >
                                                <StyledTypography>{row.preisChange} €</StyledTypography>
                                                {row.pricePercentage !== "Infinity" && (
                                                    <Typography
                                                        className={row.pricePercentage < 0 ? "down" : "up"}
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
                                                        {row.pricePercentage}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ padding: "5px" }}>
                                            <StyledTypography>{row.dcaPrice}</StyledTypography>
                                        </TableCell>
                                        <TableCell sx={{ padding: "5px" }}>
                                            <StyledTypography>{row.investition}</StyledTypography>
                                        </TableCell>
                                        <TableCell sx={{ padding: "5px" }}>
                                            <Select
                                                value={dropdownValues[index]?.relevanz || row.relevanz}
                                                onChange={(event) => handleDropdownChange(event, index, "relevanz")}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Relevanz" }}
                                                sx={{ width: "100%", height: "100%", backgroundColor: getDropdownBackgroundColor(dropdownValues[index]?.relevanz || row.relevanz) }}
                                            >
                                                {options.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell sx={{ padding: "5px" }}>
                                            <Select
                                                value={dropdownValues[index]?.dca || row.dca}
                                                onChange={(event) => handleDropdownChange(event, index, "dca")}
                                                displayEmpty
                                                inputProps={{ "aria-label": "DCA" }}
                                                sx={{ width: "100%", height: "100%", backgroundColor: getDropdownBackgroundColor(dropdownValues[index]?.dca || row.dca) }}
                                            >
                                                {options.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option === "Scam?" ? "💀" : option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell sx={{ padding: "5px", }}>
                                            <Select
                                                value={dropdownValues[index]?.gewichtung || row.gewichtung}
                                                onChange={(event) => handleDropdownChange(event, index, "gewichtung")}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Gewichtung" }}
                                                sx={{ width: "100%", height: "100%", backgroundColor: getDropdownBackgroundColor(dropdownValues[index]?.gewichtung || row.gewichtung) }}
                                            >
                                                {options.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option === "Scam?" ? "💀" : option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ThemeProvider>
        </Box>
    );
};

export default UserPortfolioTable;
