import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { portfolioAtom } from "@/app/stores/portfolioStore";
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
import { getCategoryColor } from "@/lib/data";

const CategoryColorBar = styled(Box)(({ color }) => ({
  width: "5px",
  height: "100%",
  backgroundColor: color,
  position: "absolute",
  left: 0,
  top: 0,
}));

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
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
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
      // Calculate total investment
      const totalInvestment = portfolio.assetsCalculations.assets.reduce(
        (acc, curr) => acc + curr.totalInvest,
        0
      );

      const mergedData = portfolio.assets.map((asset) => {
        const calc =
          portfolio.assetsCalculations.assets.find(
            (ac) => ac.CoinGeckoID === asset.CoinGeckoID
          ) || {};
        // Calculate percentage of the total investment
        const percentage = totalInvestment
          ? ((calc.totalInvest / totalInvestment) * 100).toFixed(2)
          : 0;
        const xValue = (calc.Holdings / calc.totalInvest).toFixed(2) || 0;
        const pricePersentage = (
          ((asset.Price - calc.DCA) / calc.DCA) *
          100
        ).toFixed(2);
        return {
          asset: asset.Name,
          ticker: asset.Ticker,
          imageUrl: asset.cgImageURL,
          bestand: calc.Holdings || 0,
          totalCoins: calc.totalCoins || 0,
          preisChange: `${asset.Price.toFixed(2)}`,
          dcaPrice: calc.DCA || "n/a",
          investition: calc.totalInvest || 0,
          relevanz: calc.Relevanz || "n/a",
          dca: "n/a",
          gewichtung: calc.Gewichtung || "n/a",
          category: asset.Category,
          percentage: percentage + "%",
          X: xValue || 0,
          pricePersentage: pricePersentage || 0,
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

  return (
    <Box
      sx={{
        backgroundColor: "#202530",
        color: "white",
        height: "100%",
        borderRadius: "8px",
        padding: "35px 20px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Portfolio ({assetsLeangth})
      </Typography>
      <ThemeProvider theme={darkTheme}>
        <TableContainer component={Paper} sx={{ overflowX: "" }}>
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
                    sortDirection={
                      orderBy === headCell.toLowerCase() ? order : false
                    }
                  >
                    <TableSortLabel
                      active={orderBy === headCell.toLowerCase()}
                      direction={
                        orderBy === headCell.toLowerCase() ? order : "asc"
                      }
                      onClick={(event) =>
                        handleRequestSort(event, headCell.toLowerCase())
                      }
                      sx={{
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        // backgroundColor: "yellow",
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
                      sx={{ padding: "0px" }}
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
                        <CategoryColorBar
                          color={getCategoryColor(row.category)}
                        />
                        <Box display="flex" alignItems="center">
                          <Avatar
                            alt={row.asset}
                            src={row.imageUrl}
                            sx={{ width: 20, height: 20, marginRight: 1 }}
                          />
                          <Typography sx={{ fontSize: "14px" }}>
                            {row.asset} ({row.ticker})
                          </Typography>
                          <Box
                            component={Typography}
                            variant="body2"
                            sx={{
                              ml: 0,
                              bgcolor: "red",
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
                        <StyledTypography
                          sx={{ color: "#999", fontSize: "12px" }}
                        >
                          {row.totalCoins} {row.ticker}
                        </StyledTypography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "5px 0 5px 5px",
                        backgroundColor: "purple",
                      }}
                    >
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
                        {row.pricePersentage != "Infinity" && (
                          <Typography
                            className={row.pricePersentage < 0 ? "down" : "up"}
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
                            {row.pricePersentage}
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
                      <StyledTypography>{row.relevanz}</StyledTypography>
                    </TableCell>
                    <TableCell sx={{ padding: "5px", backgroundColor: "red" }}>
                      <StyledTypography>{row.dca}</StyledTypography>
                    </TableCell>
                    <TableCell sx={{ padding: "5px", backgroundColor: "blue" }}>
                      <StyledTypography sx={{ alignItems: "center" }}>
                        {row.gewichtung}
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
