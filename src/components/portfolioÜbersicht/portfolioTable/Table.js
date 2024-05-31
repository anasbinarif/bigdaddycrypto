import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { portfolioAtom } from "../../../app/stores/portfolioStore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Avatar,
  Box,
  Typography,
  createTheme,
  ThemeProvider,
  styled,
} from "@mui/material";
import { categoryColors, categoryColorsNew } from "../../../lib/data"; // Import categoryColors directly

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

function descendingComparator(a, b, orderBy) {
  let aValue = a[orderBy];
  let bValue = b[orderBy];

  // Convert percentage strings to numbers for comparison
  if (typeof aValue === 'string' && aValue.includes('%')) {
    aValue = parseFloat(aValue.replace('%', ''));
    bValue = parseFloat(bValue.replace('%', ''));
  }

  // Handle NaN and Infinity cases
  if (isNaN(aValue) || aValue === 'NaN' || aValue === 'Infinity' || aValue === 'n/a') aValue = -Infinity;
  if (isNaN(bValue) || bValue === 'NaN' || bValue === 'Infinity' || bValue === 'n/a') bValue = -Infinity;

  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTable = () => {
  const [portfolio] = useAtom(portfolioAtom);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("asset");
  const [sortedData, setSortedData] = useState([]);

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
          relevanz: calc.Relevanz || "n/a",
          dca: calc?.DCA_0 || "n/a",
          gewichtung: calc.Gewichtung || "n/a",
          category: asset.Category,
          percentage: `${percentage}%`,
          X: xValue,
          pricePercentage,
        };
      });
      setSortedData(mergedData);
    }
  }, [portfolio]);
  const assetsLeangth = portfolio?.assets?.length;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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
  const colorMap = {
    "Scam?": "#B21C3C",
    "💀": "#B21C3C",
    "Bad": "#CE3F24",
    "Naja": "#CE8A2C",
    "Ok": "#CFD138",
    "Gut": "#8FD141",
    "Honey": "#31A93A"
  };
  const getDropdownBackgroundColor = (value) => {
    return colorMap[valueMap[value]] || "transparent";
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
      <Typography variant="h4" gutterBottom>
        Portfolio ({assetsLeangth})
      </Typography>
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
                    sortDirection={orderBy === headCell.toLowerCase() ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.toLowerCase()}
                      direction={orderBy === headCell.toLowerCase() ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, headCell.toLowerCase())}
                      sx={{
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {headCell}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(sortedData, getComparator(order, orderBy)).map(
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
                    <TableCell sx={{ padding: "5px", backgroundColor: getDropdownBackgroundColor(row.relevanz) }}>
                      <StyledTypography>{row.relevanz}</StyledTypography>
                    </TableCell>
                    <TableCell sx={{ padding: "5px", backgroundColor: getDropdownBackgroundColor(row.dca) }}>
                      <StyledTypography>{row.dca === 1 ? "💀" : row.dca}</StyledTypography>
                    </TableCell>
                    <TableCell sx={{ padding: "5px", backgroundColor: getDropdownBackgroundColor(row.gewichtung) }}>
                      <StyledTypography sx={{ alignItems: "center" }}>
                        {row.gewichtung === 1 ? "💀" : row.gewichtung}
                      </StyledTypography>
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

export default EnhancedTable;
