import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Select, Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { faCrown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./coinDetails.module.css";
import { useAtom } from "jotai/index";
import { sessionAtom } from "../../../../app/stores/sessionStore";
import { portfolioAtom } from "../../../../app/stores/portfolioStore";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertBar from "../../../customAllert/Alert";
import { getUserPortfolio } from "../../../../lib/data";
import Papa from 'papaparse';
import { parse } from 'date-fns';

const CoinDetails = (props) => {
  const { coin, index } = props;
  const [value, setValue] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [rowVals, setRowVals] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [sessionJotai] = useAtom(sessionAtom);
  const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });
  const [financialSummary, setFinancialSummary] = useState({
    totalCoins: 0,
    totalHoldingsValue: 0,
    totalInvested: 0,
    realizedProfit: 0,
    avgPurchasePrice: 0,
    avgPurchasePricePercentage: 0,
    avgSellingPrice: 0,
    avgSellingPricePercentage: 0,
    totalWinLoss: 0,
    totalWinLossPercentage: 0,
    X: 0,
  });
  const [changeTableValue, setChangeTableValue] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ message: "", severity: "info" });

  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const asset = portfolio.assetsCalculations.assets.find(
      (a) => a.CoinGeckoID === coin.CoinGeckoID
    );
    console.log("date asset", asset);
    if (asset && asset.buyAndSell) {
      setRowVals(
        asset.buyAndSell.map((row) => ({
          ...row,
          Date: formatDateForInput(row.Date), // Format the date for input
          Betrag: (row.PricePerCoin * row.Coins).toFixed(2),
        }))
      );
    }
  }, [coin.CoinGeckoID, portfolio.assetsCalculations.assets]);

  useEffect(() => {
    setChangeTableValue(1);
    const totalCoins = rowVals.reduce((acc, row) => {
      const coinsValue = parseFloat(row.Coins);
      return row.Type === "Kauf" ? acc + coinsValue : acc - coinsValue;
    }, 0);
    const totalHoldingsValue = (totalCoins * parseFloat(coin.Price)).toFixed(2);
    const totalInvested = rowVals
      .reduce((acc, row) => {
        if (row.Type === "Kauf") {
          return acc + parseFloat(row.Betrag);
        }
        return acc;
      }, 0)
      .toFixed(2);
    const realizedProfit = rowVals
      .reduce((acc, row) => {
        if (row.Type === "Verkauf") {
          return acc + parseFloat(row.Betrag);
        }
        return acc;
      }, 0)
      .toFixed(2);
    const avgPurchasePrice = (
      totalInvested /
      rowVals.reduce((acc, row) => {
        if (row.Type === "Kauf") {
          return acc + parseFloat(row.Coins);
        }
        return acc;
      }, 0)
    ).toFixed(2);
    const kaufTotalCoin = rowVals
      .reduce((acc, row) => {
        if (row.Type === "Kauf") {
          return acc + parseFloat(row.Coins);
        }
        return acc;
      }, 0)
      .toFixed(2);
    const verkaufTotalCoin = rowVals
      .reduce((acc, row) => {
        if (row.Type === "Verkauf") {
          return acc + parseFloat(row.Coins);
        }
        return acc;
      }, 0)
      .toFixed(2);
    const avgPurchasePricePercentage = (
      100 -
      (totalInvested / (kaufTotalCoin * coin.Price)) * 100
    ).toFixed(2);
    const avgSellingPrice = (realizedProfit / verkaufTotalCoin).toFixed(2);
    const avgSellingPricePercentage = (
      100 -
      (avgSellingPrice / avgPurchasePrice) * 100
    ).toFixed(2);
    const totalWinLoss = (
      totalHoldingsValue -
      (parseFloat(totalInvested) - parseFloat(realizedProfit))
    ).toFixed(2);
    const totalWinLossPercentage = (
      (totalWinLoss / totalInvested) *
      100
    ).toFixed(2);
    const X = totalHoldingsValue / totalInvested;

    console.log(
      "totalWinLoss=",
      totalWinLoss,
      totalInvested,
      totalWinLossPercentage
    );

    setFinancialSummary({
      totalCoins,
      totalHoldingsValue,
      totalInvested,
      realizedProfit,
      avgPurchasePrice,
      avgPurchasePricePercentage,
      avgSellingPrice,
      avgSellingPricePercentage,
      totalWinLoss,
      totalWinLossPercentage,
      X,
    });
  }, [rowVals, coin.Price]);

  console.log("selected coin bro", coin);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addRow = () => {
    setRowVals([
      ...rowVals,
      { Type: "Kauf", Date: "00/00/00", PricePerCoin: 0, Betrag: 0, Coins: 0 },
    ]);
  };

  const handleRowData = (newVal, index, col) => {
    const updatedRows = [...rowVals];
    const row = updatedRows[index];
    row[col] = newVal;

    // When 'Betrag' or 'Coins' is updated, recalculate 'PricePerCoin'
    if (col === "Betrag" || col === "Coins") {
      const coins = parseFloat(row["Coins"]);
      const betrag = parseFloat(row["Betrag"]);
      row["PricePerCoin"] = coins ? (betrag / coins).toFixed(2) : 0;
    }

    setRowVals(updatedRows);
  };

  console.log("testing adding rows to table", rowVals);

  const handleBuyAndSell = async () => {
    let error = "";
    for (const row of rowVals) {
      if (row.Date === "" || row.Date === "00/00/00") {
        error = "Please enter a valid date.";
        break;
      }
      if (row.PricePerCoin <= 0) {
        error = "Price per coin must be greater than zero.";
        break;
      }
      if (row.Betrag <= 0) {
        error = "Amount must be greater than zero.";
        break;
      }
      if (row.Coins <= 0) {
        error = "Number of coins must be greater than zero.";
        break;
      }
    }
    setValidationError(error);
    if (!error) {
      // Perform the save operation here
      const userID = sessionJotai?.user.id;
      const CoinGeckoID = coin.CoinGeckoID;
      console.log("Saving data", rowVals, CoinGeckoID, userID);
      const Portfolio_Assets = {
        totalInvest: financialSummary.totalInvested,
        totalSold: financialSummary.realizedProfit,
        totalCoins: financialSummary.totalCoins,
        Holdings: financialSummary.totalHoldingsValue,
        DCA: financialSummary.avgPurchasePrice,
      };
      try {
        const response = await fetch("/api/addBuyAndSell", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID,
            CoinGeckoID,
            rowVals,
            Portfolio_Assets,
          }),
        });
        if (response.ok) {
          setAlertInfo({
            message: "Transaktion erfolgreich gespeichert!",
            severity: "success",
          });
          const userPortfolio = await getUserPortfolio(userID);
          setPortfolio(userPortfolio?.data);
        } else {
          throw new Error("Failed to save data");
        }
      } catch (error) {
        setAlertInfo({ message: error.message, severity: "error" });
      }
      setShowAlert(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rowVals.filter((_, idx) => idx !== index);
    setRowVals(updatedRows);
  };

  const computeDaysPast = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDateForInput = (isoDateString) => {
    return isoDateString.split("T")[0]; // Splits the ISO string at 'T' and returns the date part
  };

  const getTodayString = () => {
    const today = new Date();
    const day = `0${today.getDate()}`.slice(-2); // Ensuring two digits
    const month = `0${today.getMonth() + 1}`.slice(-2); // Ensuring two digits, adding 1 because getMonth() is zero-indexed
    const year = today.getFullYear();
    return `${day} / ${month} / ${year}`; // Formats date as "YYYY-MM-DD"
  };

  const handleExportCSV = () => {
    if (sessionJotai?.user?.subscriptionPlan === "free") {
      setAlertOpen(true);
      return;
    }
    console.log("portfolioportfolioportfolio,", portfolio);
  
    const headers = ["Date", "Name", "Symbol", "Action", "Coins", "Amount"];
    const rows = [];
  
    portfolio.assetsCalculations.assets.forEach((asset) => {
      const coin = portfolio.assets.find(c => c.CoinGeckoID === asset.CoinGeckoID);
      if (coin && asset.buyAndSell) {
        asset.buyAndSell.forEach((transaction) => {
          rows.push({
            Date: new Date(transaction.Date).toLocaleDateString("en-US"), // Format date to MM/DD/YYYY
            Name: coin.Name, // Assuming all are Bitcoin, adjust if necessary
            Symbol: coin.Ticker, // Assuming all are BTC, adjust if necessary
            Action: transaction.Type === "Kauf" ? "Buy" : "Sell",
            Coins: transaction.Coins,
            Amount: transaction.Betrag
          });
        });
      }
    });
  
    console.log("portfolio-rows", rows);
  
    const csvContent = [
      headers.join(","),
      ...rows.map(row => Object.values(row).join(","))
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "exported_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const handleImport = () => {
    if (sessionJotai?.user?.subscriptionPlan === "free") {
      setAlertOpen(true)
      return
    }
    handleOpenDialog()
  }


  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setFile(null);
    setOpenDialog(false);
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          console.log("Parsed CSV Data:", results.data);
  
          // Filter and map the parsed data to match portfolio coins
          const portfolioCoins = portfolio.assetsCalculations.assets.map((asset) => {
            const coin = portfolio.assets.find(c => c.CoinGeckoID === asset.CoinGeckoID);
            return coin ? { ...coin, buyAndSell: asset.buyAndSell || [] } : null;
          }).filter(coin => coin);
  
          // Check if all symbols in the imported data match the current portfolio's tickers
          const validData = results.data.filter(row => {
            return portfolioCoins.some(coin => coin.Ticker === row.Symbol);
          });
  
          if (validData.length === 0) {
            setAlertInfo({ message: "No matching symbols found in the current portfolio.", severity: "error" });
            setShowAlert(true);
            return;
          }
  
          // Map imported data to the buy and sell structure
          const importedData = validData.map(row => {
            let parsedDate = null;
            if (row.Date) {
              try {
                parsedDate = parse(row.Date, 'M/d/yyyy', new Date());
                if (isNaN(parsedDate)) {
                  throw new Error("Invalid Date");
                }
              } catch (error) {
                console.error("Invalid Date format:", row.Date);
                parsedDate = null;
              }
            }
  
            return {
              Type: row.Action === "Buy" ? "Kauf" : "Verkauf",
              Date: parsedDate ? parsedDate.toISOString().split("T")[0] : null,
              PricePerCoin: row.Amount / row.Coins,
              Betrag: row.Amount,
              Coins: row.Coins,
              Name: row.Name,
              Symbol: row.Symbol,
            };
          });
  
          // Group data by coin symbol
          const groupedData = portfolioCoins.reduce((acc, coin) => {
            const coinData = importedData.filter(row => row.Symbol === coin.Ticker);
            if (coinData.length > 0) {
              acc[coin.Ticker] = coinData;
            }
            return acc;
          }, {});
  
          // Prepare data for API call
          const apiData = Object.keys(groupedData).map(symbol => {
            const coin = portfolioCoins.find(coin => coin.Ticker === symbol);
            return {
              CoinGeckoID: coin.CoinGeckoID,
              buyAndSell: groupedData[symbol],
            };
          });
  
          try {
            console.log("/api/importBuyAndSell", apiData);
            // Call the API to store the data
            const response = await fetch("/api/importBuyAndSell", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userID: sessionJotai?.user.id, data: apiData }),
            });
  
            if (response.ok) {
              const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
              setPortfolio(userPortfolio?.data);
              setAlertInfo({ message: "Data successfully imported!", severity: "success" });
              setShowAlert(true);
              handleCloseDialog();
            } else {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to import data");
            }
          } catch (error) {
            setAlertInfo({ message: error.message, severity: "error" });
            setShowAlert(true);
          }
        },
        error: (error) => {
          console.error("Error parsing CSV: ", error);
          setAlertInfo({ message: "Error parsing CSV", severity: "error" });
          setShowAlert(true);
        }
      });
    }
  };
  
  
  


  return (
    <>
      <Box
        sx={{
          backgroundColor: "#202530",
          color: "white",
          height: "100%",
          borderRadius: "8px",
          padding: "35px 30px",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              display: "flex",
              alignSelf: "flex-start",
              width: "25%",
              marginRight: "1.5rem",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", mb: 1, pl: 1, mr: 2 }}
            >
              <Avatar
                src={coin.cgImageURL}
                sx={{
                  width: 50,
                  height: 50,
                  marginRight: 1,
                  alignSelf: "flex-start",
                }}
              />
            </Box>
            <Box sx={{ alignSelf: "center" }}>
              <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
                {coin.Ticker}
              </Typography>
              <Typography noWrap>{coin.CoinGeckoID}</Typography>
              <Typography>{coin.Price.toFixed(2)} €</Typography>
            </Box>
          </Box>
          <Box className={styles.grid}>
            <Box className={styles.grid__item}>
              <Typography sx={{ fontSize: "0.9rem" }}>Bestand</Typography>
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {financialSummary.totalHoldingsValue},00 €
              </Typography>
              <Typography sx={{ color: "#ffffff88" }}>
                {financialSummary.totalCoins} {coin.Ticker}
              </Typography>
            </Box>
            <Box className={styles.grid__item}>
              <Typography sx={{ fontSize: "0.9rem" }}>Investiert</Typography>
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {financialSummary.totalInvested},00 €
              </Typography>
              <Typography sx={{ color: "#ffffff88" }}>Geplant: 0,00 €</Typography>
            </Box>
            <Box className={styles.grid__item}>
              <Typography sx={{ fontSize: "0.9rem" }}>
                Gesamtgewinn/-Verlust
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {financialSummary.totalWinLoss},00 €
              </Typography>
              <Typography
                className={
                  financialSummary.avgPurchasePricePercentage < 0 ? "down" : "up"
                }
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
                {financialSummary.totalWinLossPercentage} %
              </Typography>
            </Box>
            <Box className={styles.grid__item}>
              <Typography sx={{ fontSize: "0.9rem" }}>
                Durchschn. Kaufpreis
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  color: `${financialSummary.avgPurchasePrice > 0 ? "" : "rgb(68, 68, 68)"
                    }`,
                  whiteSpace: "nowrap",
                }}
              >
                {financialSummary.avgPurchasePrice > 0
                  ? `${financialSummary.avgPurchasePrice} €`
                  : "--,-- €"}
              </Typography>
              <Typography
                className={
                  financialSummary.avgPurchasePricePercentage < 0 ? "down" : "up"
                }
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
                {financialSummary.avgPurchasePricePercentage} %
              </Typography>
            </Box>
            <Box className={styles.grid__item}>
              <Typography sx={{ fontSize: "0.9rem" }}>
                Durchschn. Verkaufspreis
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  color: `${financialSummary.avgSellingPrice > 0 ? "" : "rgb(68, 68, 68)"
                    }`,
                  whiteSpace: "nowrap",
                }}
              >
                {financialSummary.avgSellingPrice > 0
                  ? `${financialSummary.avgSellingPrice} €`
                  : "--,-- €"}
              </Typography>
              {financialSummary.avgSellingPricePercentage > 0 && (
                <Typography
                  className={
                    financialSummary.avgSellingPricePercentage < 0 ? "up" : "down"
                  }
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
                  {financialSummary.avgSellingPricePercentage} %
                </Typography>
              )}
            </Box>
            <Box className={styles.grid__item}>
              <Typography sx={{ fontSize: "0.9rem" }}>
                Gewinn realisiert
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {financialSummary.realizedProfit},00 €
              </Typography>
              <Typography sx={{ color: "#ffffff88" }}>% von Invest</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: "100%", marginTop: "3rem" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="transparent"
            sx={{
              "& .MuiTab-root": {
                color: "#ffffff80",
                "&.Mui-selected": {
                  backgroundColor: "#ffffff08",
                  color: "#ffffff",
                  border: "none",
                },
              },
            }}
          >
            <Tab
              label="Transaktionen"
              sx={{
                backgroundColor: value === 0 ? "#ffffff08" : "#00000033",
                marginRight: "15px",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                fontWeight: value === 0 ? "bold" : "normal",
                color: value === 0 ? "#ffffff" : "#ffffff80",
                fontSize: "12px",
              }}
            />
            <Tab
              label="Kaufzonen"
              sx={{
                backgroundColor: value === 1 ? "#ffffff08" : "#00000033",
                marginRight: "15px",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                fontWeight: value === 1 ? "bold" : "normal",
                fontSize: "12px",
              }}
            />
            <Tab
              label="Verkaufszonen"
              sx={{
                backgroundColor: value === 2 ? "#ffffff08" : "#00000033",
                marginRight: "15px",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                fontWeight: value === 2 ? "bold" : "normal",
                fontSize: "12px",
              }}
            />
          </Tabs>
          <Box>
            {value === 0 && (
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#ffffff08",
                  "& .MuiTableCell-head": {
                    color: "#ffffff50",
                    border: "none",
                    fontWeight: "bold",
                  },
                  "& .MuiTableBody-root .MuiTableRow-root": {
                    backgroundColor: "#00000033",
                    "&:hover": {
                      backgroundColor: "#00000050",
                    },
                  },
                  "& .MuiTableCell-body": {
                    color: "white",
                    border: "none",
                  },
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Aktion</TableCell>
                      <TableCell>Datum</TableCell>
                      <TableCell>Preis pro Coin</TableCell>
                      <TableCell>Betrag in EUR</TableCell>
                      <TableCell>Coins</TableCell>
                      <TableCell>Haltedauer</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Render six rows */}
                    {rowVals.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            inputProps={{ "aria-label": "Without label" }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={row.Type}
                            label="Age"
                            onChange={(e) =>
                              handleRowData(e.target.value, index, "Type")
                            }
                            variant="outlined"
                            sx={{
                              color:
                                row.Type === "Kauf"
                                  ? "#4CAF50"
                                  : row.Type === "Verkauf"
                                    ? "#F44336"
                                    : "white",
                              fontSize: "0.8rem",
                              border: "none",

                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "1px solid #ffffff20",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                border: "1px solid #ffffff20",
                              },

                              "& .MuiFormHelperText-root": {
                                color: "#ffffff",
                              },
                              "& .MuiFormLabel-root": {
                                color: "#ffffff",
                                "&.Mui-focused": {
                                  color: "#ffffff",
                                },
                              },

                              "& .MuiOutlinedInput-root": {
                                "&:selected": {
                                  border: "none",
                                },
                              },

                              "& .MuiInputBase-root": {
                                // border: "none",
                              },
                              "& .MuiSelect-select": {
                                // border: "1px solid #ffffff20",
                                // border: "none",
                                padding: "5px",
                                "&:focus-visible": {
                                  outline: "none",
                                },
                              },
                              "& .MuiSvgIcon-root": { color: "#ffffff" },
                            }}
                          >
                            <MenuItem value="Kauf">Kauf</MenuItem>
                            <MenuItem value="Verkauf">VerKauf</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div>
                            {/* <label htmlFor="datePicker">Select a date:</label> */}
                            <input
                              type="date"
                              id="datePicker"
                              value={row.Date}
                              onChange={(e) =>
                                handleRowData(e.target.value, index, "Date")
                              }
                              max={getTodayString()}
                              className={styles["input--date"]}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid #ffffff20",
                              padding: "3px 5px",
                              borderRadius: "4px",
                              maxWidth: "100px",
                            }}
                          >
                            {row.PricePerCoin} €
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid #ffffff20",
                              padding: "3px 5px",
                              borderRadius: "4px",
                              maxWidth: "100px",
                            }}
                          >
                            <input
                              type="text"
                              id="betragInput"
                              value={row.Betrag}
                              onChange={(e) =>
                                handleRowData(
                                  parseFloat(e.target.value) || 0,
                                  index,
                                  "Betrag"
                                )
                              }
                              style={{
                                marginRight: "5px",
                                width: "100px",
                                backgroundColor: "transparent",
                                border: "none",
                              }}
                            />
                            €
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid #ffffff20",
                              padding: "3px 5px",
                              borderRadius: "4px",
                              maxWidth: "100px",
                            }}
                          >
                            <input
                              type="text"
                              id="numberInput"
                              value={row.Coins}
                              onChange={(e) =>
                                handleRowData(
                                  parseFloat(e.target.value) || 0,
                                  index,
                                  "Coins"
                                )
                              }
                              className={styles.input}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", flexDirection: "row" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "3px 5px",
                                maxWidth: "100px",
                              }}
                            >
                              {row.Date === "00/00/00"
                                ? ""
                                : `${computeDaysPast(row.Date)} Tage`}
                            </div>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title="Delete"
                            onClick={() => handleDeleteRow(index)}
                          >
                            <IconButton
                              sx={{ color: "gray", "&:hover": { color: "red" } }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {validationError && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {validationError}
                  </Typography>
                )}
              </TableContainer>
            )}
            {value === 1 && <div>Content for Tab 2</div>}
            {value === 2 && <div>Content for Tab 3</div>}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              sx={{
                marginTop: "20px",
                backgroundColor: "#00000033",
                color: "white",
                fontSize: "0.8rem",
              }}
              onClick={addRow}
            >
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
              Neue Transaktion hinzufügen
            </Button>
            <Button
              sx={{
                marginTop: "20px",
                backgroundColor: "#00000033",
                color: "white",
                fontSize: "0.8rem",
              }}
              onClick={handleImport}
            >
              Import CSV
              <FontAwesomeIcon
                icon={faCrown}
                style={{ paddingLeft: "5px", opacity: "0.5", fontSize: "0.9rem", marginRight: "15px" }}
                color="gold"
              />
            </Button>
            <Button
              sx={{
                marginTop: "20px",
                backgroundColor: "#00000033",
                color: "white",
                fontSize: "0.8rem",
                marginLeft: "10px",
              }}
              onClick={handleExportCSV}
              disabled={rowVals.length <= 0}
            >
              Export CSV
              <FontAwesomeIcon
                icon={faCrown}
                style={{ paddingLeft: "5px", opacity: "0.5", fontSize: "0.9rem", marginRight: "15px" }}
                color="gold"
              />
            </Button>
            <Button
              sx={{
                marginTop: "20px",
                backgroundColor: "#1188ff",
                color: "white",
                fontSize: "0.8rem",
                "&:hover": { backgroundColor: "#0a549f" },
              }}
              onClick={handleBuyAndSell}
              disabled={rowVals.length <= 0}
            >
              Update
            </Button>
          </Box>
        </Box>
        <AlertBar
          open={showAlert}
          message={alertInfo.message}
          severity={alertInfo.severity}
          onClose={closeAlert}
        />
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Import CSV</DialogTitle>
          <DialogContent sx={{ maxWidth: "600px", width: "100%" }}>
            <Box
              sx={{
                border: "2px dashed #ccc",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("fileInput").click()}
            >
              {file ? (
                <Typography>{file.name}</Typography>
              ) : (
                <Typography>Drag and drop a file or click to select</Typography>
              )}
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="fileInput"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleFileUpload} color="primary">
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
        <Alert onClose={() => setAlertOpen(false)} severity="info" variant="filled" sx={{ width: '100%' }}>
          To access the Import/Export, please subscribe to one of our plans.
        </Alert>
      </Snackbar>
    </>
  );
};

export default CoinDetails;
