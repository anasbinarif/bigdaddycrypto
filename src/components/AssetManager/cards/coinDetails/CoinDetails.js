import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
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
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./coinDetails.module.css";
import { useAtom } from "jotai/index";
import { sessionAtom } from "@/app/stores/sessionStore";
import { portfolioAtom } from "@/app/stores/portfolioStore";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertBar from "@/components/customAllert/Alert";
import { getUserPortfolio } from "@/lib/data";

const CoinDetails = (props) => {
  const { coin, index } = props;
  const [value, setValue] = useState(0);
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

  return (
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
        <Box sx={{ display: "flex", flexDirection: "column", width: "25%" }}>
          <Box
            sx={{ display: "flex", alignItems: "center", mb: 1, pl: 1, mr: 2 }}
          >
            <Avatar
              src={coin.cgImageURL}
              sx={{ width: 50, height: 50, marginRight: 1 }}
            />
            <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
              {coin.Ticker}
            </Typography>
          </Box>
          <Box sx={{ alignSelf: "center" }}>
            <Typography>{coin.CoinGeckoID}</Typography>
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
                color: `${
                  financialSummary.avgPurchasePrice > 0 ? "" : "rgb(68, 68, 68)"
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
                color: `${
                  financialSummary.avgSellingPrice > 0 ? "" : "rgb(68, 68, 68)"
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
    </Box>
  );
};

export default CoinDetails;
