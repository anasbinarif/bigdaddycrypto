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
import { categoryColors, categoryColorsNew } from "../../../lib/data";
import {
  convertPrice,
  currencySign,
  getCurrencyAndRates,
  getUserPortfolio,
} from "../../../lib/data";
import { useSearchParams } from "next/navigation";
import addCommas from "../../../lib/currencyFormatter";

const valueMap = {
  1: "Scam?",
  2: "Bad",
  3: "Naja",
  4: "Ok",
  5: "Gut",
  6: "Honey",
  "Scam?": 1,
  "💀": 1,
  Bad: 2,
  Naja: 3,
  Ok: 4,
  Gut: 5,
  Honey: 6,
};

function getLightToneColor(hexColor) {
  // Convert hex color to RGB
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  // Convert RGB to HSL
  let hsl = rgbToHsl(r, g, b);

  // Increase lightness to get a light tone (pastel-like)
  hsl[2] = Math.min(hsl[2] + 0.2, 1); // Increase lightness by 0.2 (adjust as needed)

  // Convert HSL back to RGB
  let rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

  // Convert RGB to hex
  const lightToneHex = `#${rgbToHex(rgb[0])}${rgbToHex(rgb[1])}${rgbToHex(
    rgb[2]
  )}`;

  return {
    lightTone: lightToneHex,
    textColor: getContrastColor(rgb), // Get contrasting text color
  };
}

// Function to convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
}

// Function to convert HSL to RGB
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Function to convert RGB to hex
function rgbToHex(rgb) {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
}

// Function to get contrasting text color (black or white)
function getContrastColor(rgb) {
  // Calculate luminance (Y) from RGB components
  const Y = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;

  // Return black for light backgrounds, white for dark backgrounds
  return Y >= 0.5 ? "#000000" : "#ffffff";
}

const CategoryColorBar = styled(Box)(({ colors }) => {
  const gradient =
    colors.length > 1 ? `linear-gradient(${colors.join(", ")})` : colors[0];
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
  const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let aValue = a[orderBy];
  let bValue = b[orderBy];

  if (nums.includes(aValue[0]) && nums.includes(bValue[0])) {
    aValue = parseFloat(aValue);
    bValue = parseFloat(bValue);
  }

  if (typeof aValue === "string" && typeof bValue === "string") {
    aValue = aValue.toUpperCase();
    bValue = bValue.toUpperCase();
    // console.log(aValue, bValue);
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  }

  // console.log(aValue, bValue);
  // Convert percentage strings to numbers for comparison
  if (typeof aValue === "string" && aValue.includes("%")) {
    aValue = parseFloat(aValue.replace("%", ""));
    bValue = parseFloat(bValue.replace("%", ""));
  }

  // Handle NaN and Infinity cases
  if (
    isNaN(aValue) ||
    aValue === "NaN" ||
    aValue === "Infinity" ||
    aValue === "n/a"
  )
    aValue = 0;
  if (
    isNaN(bValue) ||
    bValue === "NaN" ||
    bValue === "Infinity" ||
    bValue === "n/a"
  )
    bValue = 0;

  // console.log(aValue, bValue);

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

const EnhancedTable = ({ preCalcPort, preCalcSort }) => {
  const [portfolio] = preCalcPort || useAtom(portfolioAtom);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("asset");
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (portfolio.assetsCalculations && portfolio.assets) {
      // console.log(portfolio, "meeeeee");
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
        const xValue = calc.totalInvest
          ? (calc.Holdings / calc.totalInvest).toFixed(2)
          : "NaN";
        const pricePercentage = calc.DCA
          ? (((asset.Price - calc.DCA) / calc.DCA) * 100).toFixed(2)
          : "Infinity";
        return {
          asset: asset.Ticker,
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
      // console.log(mergedData);
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
    return categories.map(
      (category) => categoryColorsNew[category] || "#ffffff"
    );
  };

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const getRandomColor = (ticker) => {
    let color = "#";
    const letters = "0123456789ABCDEF";
    const hash = hashString(ticker);
    for (let i = 0; i < 6; i++) {
      color += letters[(hash >> (i * 4)) & 0x0f];
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
    "n/a": "n/a",
    "Scam?": 1,
    "💀": 1,
    Bad: 2,
    Naja: 3,
    Ok: 4,
    Gut: 5,
    Honey: 6,
  };
  const colorMap = {
    "Scam?": "#B21C3C",
    "💀": "#B21C3C",
    Bad: "#CE3F24",
    Naja: "#CE8A2C",
    Ok: "#CFD138",
    Gut: "#8FD141",
    Honey: "#31A93A",
  };
  const getDropdownBackgroundColor = (value) => {
    return colorMap[valueMap[value]] || "transparent";
  };

  const [currency, setCurrency] = useState("EUR");
  const [rates, setRates] = useState(null);
  const searchParams = useSearchParams();
  const currentCurrency = searchParams.get("currency") || "EUR";

  useEffect(() => {
    const fetchCurrencyAndRates = async () => {
      const { rates } = await getCurrencyAndRates();
      setCurrency(currentCurrency);
      setRates(rates);
    };
    fetchCurrencyAndRates();
  }, [currentCurrency]);

  // console.log(currency);

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
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Portfolio ({assetsLeangth})
      </Typography>
      <ThemeProvider theme={darkTheme}>
        <TableContainer
          component={Paper}
          sx={{
            overflowX: "auto",
            backgroundColor: "transparent",
            backgroundImage: "none",
            boxShadow: "none",

            "& .MuiTableCell-root": {
              minWidth: "110px",
            },
          }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{
                "& .MuiTableCell-root": {
                  backgroundColor: "transparent",
                  padding: "2px",
                  color: "#ffffff50",
                  fontWeight: "bold",
                  "&:first-child": {
                    padding: "16px",
                  },

                  "& .MuiButtonBase-root": {
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "flex-start",

                    "& .MuiSvgIcon-root": {
                      opacity: 1,
                    },
                  },
                },
              }}
            >
              <TableRow>
                {[
                  { label: "Asset", key: "asset" },
                  { label: "", key: "percentage" },
                  { label: "Bestand", key: "bestand" },
                  { label: "X", key: "X" },
                  { label: "Preis /+-%", key: "preisChange" },
                  { label: "DCA Preis", key: "dcaPrice" },
                  { label: "Investition", key: "investition" },
                  { label: "Relevanz", key: "relevanz" },
                  { label: "DCA", key: "dca" },
                  { label: "Gewichtung", key: "gewichtung" },
                ].map((headCell) => (
                  <TableCell
                    key={headCell.key}
                    sortDirection={orderBy === headCell.key ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.key}
                      direction={orderBy === headCell.key ? order : "asc"}
                      onClick={(event) =>
                        handleRequestSort(event, headCell.key)
                      }
                      sx={{
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        // backgroundColor:
                        //   headCell.key === "asset" ? "white" : "transparent",
                        justifyContent:
                          headCell.key === "asset"
                            ? "flex-start"
                            : headCell.key === "relevanz" ||
                              headCell.key === "dca" ||
                              headCell.key === "gewichtung"
                            ? "center"
                            : "flex-end",
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                border: "1px solid #ffffff18",
                backgroundColor: "#00000030",

                "& .MuiTableCell-root": {
                  width: "auto",
                },
              }}
            >
              {stableSort(sortedData, getComparator(order, orderBy)).map(
                (row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "& .MuiTableCell-root": {
                        "&:not(:first-child)": {
                          borderRight: "1px solid #ffffff18",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ padding: "0px" }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 2,
                          borderRadius: 0,
                          position: "relative",
                        }}
                      >
                        <CategoryColorBar
                          colors={getCategoryColors(row.category)}
                        />
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{ width: "100%" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <Avatar
                              alt={row.asset}
                              src={row.imageUrl}
                              sx={{ width: 25, height: 25, marginRight: 1 }}
                            />
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                // marginLeft: "30%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transform: "translateY(3px)",
                              }}
                            >
                              {row.ticker}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        boxSizing: "border-box",
                        // display: "flex",
                        // justifyContent: "center",
                        height: "100%",
                        padding: "5px",
                      }}
                    >
                      <Box
                        component={Typography}
                        sx={{
                          ml: 1,
                          bgcolor: `${
                            getLightToneColor(
                              categoryColorsNew[row.category[0]]
                            ).lightTone
                          }`,
                          color: `${
                            getLightToneColor(
                              categoryColorsNew[row.category[0]]
                            ).textColor
                          }`,
                          fontWeight: "bold",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          maxWidth: "50%",
                          // lineHeight: "25px",
                          padding: "3px 12px",
                          borderRadius: "32px",
                          fontSize: "12px",
                          marginLeft: "auto",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            transform: "translateY(1px)",
                          }}
                        >
                          {row.percentage}
                        </Typography>
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
                          {row.bestand > 0
                            ? `${addCommas(
                                convertPrice(row.bestand, currency, rates)
                              )} ${currencySign[currency]}`
                            : 0}
                        </StyledTypography>
                        <StyledTypography
                          sx={{ color: "#999", fontSize: "12px" }}
                        >
                          {row.totalCoins} {row.ticker}
                        </StyledTypography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: "5px 0 5px 5px" }}>
                      <StyledTypography>
                        {row.X && !isNaN(row.X) ? row.X : "0"}x
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
                        <StyledTypography>
                          {row.preisChange !== 0
                            ? `${addCommas(
                                convertPrice(row.preisChange, currency, rates)
                              )} ${currencySign[currency]}`
                            : 0}
                        </StyledTypography>
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
                            {row.pricePercentage !== 0
                              ? `${addCommas(
                                  convertPrice(
                                    row.pricePercentage,
                                    currency,
                                    rates
                                  )
                                )} %`
                              : 0}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: "5px" }}>
                      <StyledTypography>
                        {row.dcaPrice > 0
                          ? `${addCommas(
                              convertPrice(row.dcaPrice, currency, rates)
                            )} ${currencySign[currency]}`
                          : 0}
                      </StyledTypography>
                    </TableCell>
                    <TableCell sx={{ padding: "5px" }}>
                      <StyledTypography>
                        {row.investition !== 0
                          ? `${addCommas(
                              convertPrice(row.investition, currency, rates)
                            )} ${currencySign[currency]}`
                          : 0}
                      </StyledTypography>
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "5px",
                        backgroundColor: getDropdownBackgroundColor(
                          row.relevanz
                        ),
                      }}
                    >
                      <StyledTypography>
                        {valueMap[row.relevanz]}
                      </StyledTypography>
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "5px",
                        backgroundColor: getDropdownBackgroundColor(row.dca),
                      }}
                    >
                      <StyledTypography>
                        {row.dca === 1 ? "💀" : valueMap[row.dca]}
                      </StyledTypography>
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "5px",
                        backgroundColor: getDropdownBackgroundColor(
                          row.gewichtung
                        ),
                      }}
                    >
                      <StyledTypography sx={{ alignItems: "center" }}>
                        {row.gewichtung === 1 ? "💀" : valueMap[row.gewichtung]}
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
