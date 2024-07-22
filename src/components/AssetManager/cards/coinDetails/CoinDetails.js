import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { faCrown, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai/index";
import { sessionAtom } from "../../../../app/stores/sessionStore";
import { portfolioAtom } from "../../../../app/stores/portfolioStore";
import AlertBar from "../../../customAllert/Alert";
import {
  convertPrice,
  currencySign,
  getCurrencyAndRates,
  getUserPortfolio,
} from "../../../../lib/data";
import Papa from "papaparse";
import { addDays, parse } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import CoinDetailsTable from "./CoinDetailsTable";
import CoinDetailsDisplay from "./CoinDetailsDisplay";
import styles from "./coinDetails.module.css";

const CoinDetails = ({ coin, setOperationHappening = null }) => {
  const t = useTranslations("coinDetails");
  // const { coin, index } = props;
  const [Loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);
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
  const [delInfo, setDelInfo] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const asset = portfolio?.assetsCalculations?.assets.find(
      (a) => a.CoinGeckoID === coin?.CoinGeckoID
    );
    console.log("date asset", asset);
    if (asset && asset.buyAndSell) {
      setRowVals(
        asset.buyAndSell.map((row) => ({
          ...row,
          Date: formatDateForInput(row.Date),
          Betrag: (row.PricePerCoin * row.Coins).toFixed(2),
        }))
      );
    }
  }, [coin?.CoinGeckoID, portfolio?.assetsCalculations.assets]);

  useEffect(() => {
    const totalCoins = rowVals?.reduce((acc, row) => {
      const coinsValue = parseFloat(row.Coins);
      return row.Type === "Kauf" ? acc + coinsValue : acc - coinsValue;
    }, 0);
    console.log(totalCoins, coin?.Price);
    const totalHoldingsValue = (totalCoins * parseFloat(coin?.Price)).toFixed(
      2
    );
    const totalInvested = rowVals
      .reduce((acc, row) => {
        if (row?.Type === "Kauf") {
          return acc + parseFloat(row.Betrag);
        }
        return acc;
      }, 0)
      .toFixed(2);
    console.log(totalInvested);
    const realizedProfit = rowVals
      .reduce((acc, row) => {
        if (row.Type === "Verkauf") {
          return acc + parseFloat(row.Betrag);
        }
        return acc;
      }, 0)
      .toFixed(2);
    console.log(realizedProfit);
    const avgPurchasePrice_0 =
      totalInvested /
      rowVals.reduce((acc, row) => {
        if (row.Type === "Kauf") {
          return acc + parseFloat(row.Coins);
        }
        return acc;
      }, 0);
    console.log(avgPurchasePrice_0);
    const avgPurchasePrice = isNaN(avgPurchasePrice_0) ? 0 : avgPurchasePrice_0;
    const kaufTotalCoin = rowVals
      .reduce((acc, row) => {
        if (row.Type === "Kauf") {
          return acc + parseFloat(row.Coins);
        }
        return acc;
      }, 0)
      .toFixed(2);
    console.log(kaufTotalCoin);
    const verkaufTotalCoin = rowVals
      .reduce((acc, row) => {
        if (row.Type === "Verkauf") {
          return acc + parseFloat(row.Coins);
        }
        return acc;
      }, 0)
      .toFixed(2);
    console.log(verkaufTotalCoin);
    const avgPurchasePricePercentage_0 = (
      100 -
      (totalInvested / (kaufTotalCoin * coin?.Price)) * 100
    ).toFixed(2);
    console.log(avgPurchasePricePercentage_0);
    const avgPurchasePricePercentage = isNaN(avgPurchasePricePercentage_0)
      ? 0
      : avgPurchasePricePercentage_0;
    const avgSellingPrice = (realizedProfit / verkaufTotalCoin).toFixed(2);
    console.log(avgSellingPrice);
    const avgSellingPricePercentage = (
      100 -
      (avgSellingPrice / avgPurchasePrice) * 100
    ).toFixed(2);
    const totalWinLoss = (
      totalHoldingsValue -
      (parseFloat(totalInvested) - parseFloat(realizedProfit))
    ).toFixed(2);
    console.log(totalWinLoss);
    const winloss =
      avgSellingPrice * verkaufTotalCoin -
      verkaufTotalCoin * avgPurchasePrice +
      (totalHoldingsValue - totalCoins * avgPurchasePrice);
    console.log(winloss);
    const totalWinLossPercentage = parseFloat(
      ((totalWinLoss / totalInvested) * 100).toFixed(2)
    );
    console.log(totalWinLossPercentage);
    const X = totalHoldingsValue / totalInvested;

    console.log(
      "totalWinLoss=",
      totalWinLoss,
      totalInvested,
      totalWinLossPercentage
    );

    setFinancialSummary({
      totalCoins: checkNaN(totalCoins),
      totalHoldingsValue: checkNaN(totalHoldingsValue),
      totalInvested: checkNaN(totalInvested),
      realizedProfit: checkNaN(realizedProfit),
      avgPurchasePrice: checkNaN(avgPurchasePrice),
      avgPurchasePricePercentage: checkNaN(avgPurchasePricePercentage),
      avgSellingPrice: checkNaN(avgSellingPrice),
      avgSellingPricePercentage: checkNaN(avgSellingPricePercentage),
      totalWinLoss: checkNaN(totalWinLoss),
      totalWinLossPercentage: checkNaN(totalWinLossPercentage),
      X: checkNaN(X),
    });
    changeTableValue === 1 && setChangeTableValue(2);
  }, [rowVals, coin?.Price]);

  const checkNaN = (value) => (isNaN(value) ? 0 : value);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addRow = () => {
    setRowVals([
      ...rowVals,
      {
        Type: "Kauf",
        Date: "00/00/00",
        PricePerCoin: null,
        Betrag: null,
        Coins: null,
      },
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
      let num = betrag / coins;
      // console.log(num);
      // if (num > 0.01) num = Number(num.toPrecision(2));
      // else num = num.toFixed(2);
      console.log(num);

      row["PricePerCoin"] = coins ? num : 0;
    }

    setRowVals(updatedRows);
  };

  console.log("testing adding rows to table", rowVals);

  const handleBuyAndSell = async () => {
    setLoading(true);
    setOperationHappening(true);
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
      const userID = sessionJotai?.user.id;
      const userId = sessionJotai?.user.id;
      const CoinGeckoID = coin?.CoinGeckoID;
      // console.log("Saving data", rowVals, CoinGeckoID, userID);
      const Portfolio_Assets = {
        totalInvest: financialSummary.totalInvested || 0,
        totalSold: financialSummary.realizedProfit || 0,
        totalCoins: financialSummary.totalCoins || 0,
        Holdings: financialSummary.totalHoldingsValue || 0,
        DCA: financialSummary.avgPurchasePrice || 0,
      };
      try {
        const token = sessionJotai?.user.accessToken;
        const response = await fetch("/api/addBuyAndSell", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userID,
            CoinGeckoID,
            rowVals,
            Portfolio_Assets,
          }),
        });
        console.log(response);
        if (response.ok) {
          // const res = await UpdateCryptoCoins(userId);
          setAlertInfo({
            message: t("successAlert"),
            severity: "success",
          });
          const userPortfolio = await getUserPortfolio(userID);
          setPortfolio(userPortfolio?.data);
          setLoading(false);
        } else {
          // throw new Error("Failed to save data");
        }
      } catch (error) {
        setAlertInfo({ message: error.message, severity: "error" });
      }
      setShowAlert(true);
    }
    setOperationHappening(false);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rowVals.filter((_, idx) => idx !== index);
    setRowVals(updatedRows);
    setChangeTableValue(1);
  };

  useEffect(() => {
    const del = async () => {
      setOperationHappening(true);
      const userID = sessionJotai?.user.id;
      const userId = sessionJotai?.user.id;
      const CoinGeckoID = coin?.CoinGeckoID;
      console.log("Saving data", rowVals, CoinGeckoID, userID);
      const Portfolio_Assets = {
        totalInvest: financialSummary.totalInvested || 0,
        totalSold: financialSummary.realizedProfit || 0,
        totalCoins: financialSummary.totalCoins || 0,
        Holdings: financialSummary.totalHoldingsValue || 0,
        DCA: financialSummary.avgPurchasePrice || 0,
      };
      try {
        const token = sessionJotai?.user.accessToken;
        const response = await fetch("/api/addBuyAndSell", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
            message: t("successAlert"),
            severity: "success",
          });
          // const res = await UpdateCryptoCoins(userId);
          const userPortfolio = await getUserPortfolio(userID);
          setPortfolio(userPortfolio?.data);
          setLoading(false);
        } else {
          // throw new Error("Failed to save data");
        }
      } catch (error) {
        setAlertInfo({ message: error.message, severity: "error" });
      }
      setShowAlert(true);
      setOperationHappening(false);
    };

    changeTableValue === 2 && del() && setChangeTableValue(0);
  }, [changeTableValue]);

  // const computeDaysPast = (dateStr) => {
  //   const date = new Date(dateStr);
  //   const now = new Date();
  //   const diffTime = Math.abs(now - date);
  //   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // };

  const formatDateForInput = (isoDateString) => {
    return isoDateString.split("T")[0]; // Splits the ISO string at 'T' and returns the date part
  };

  // const getTodayString = () => {
  //   const today = new Date();
  //   const day = `0${today.getDate()}`.slice(-2); // Ensuring two digits
  //   const month = `0${today.getMonth() + 1}`.slice(-2); // Ensuring two digits, adding 1 because getMonth() is zero-indexed
  //   const year = today.getFullYear();
  //   return `${day} / ${month} / ${year}`; // Formats date as "YYYY-MM-DD"
  // };

  const handleExportCSV = () => {
    if (sessionJotai?.user?.subscriptionPlan === "free") {
      setAlertOpen(true);
      return;
    }

    const headers = ["Date", "Name", "Symbol", "Action", "Coins", "Amount"];
    const rows = [];

    portfolio.assetsCalculations.assets.forEach((asset) => {
      const coin = portfolio.assets.find(
        (c) => c.CoinGeckoID === asset.CoinGeckoID
      );
      if (coin && asset.buyAndSell) {
        asset.buyAndSell.forEach((transaction) => {
          rows.push({
            Date: new Date(transaction.Date).toLocaleDateString("en-US"), // Format date to MM/DD/YYYY
            Name: coin.Name,
            Symbol: coin.Ticker,
            Action: transaction.Type === "Kauf" ? "Buy" : "Sell",
            Coins: transaction.Coins,
            Amount: transaction.Betrag,
          });
        });
      }
    });

    console.log("portfolio-rows", rows);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => Object.values(row).join(",")),
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
      setAlertOpen(true);
      return;
    }
    handleOpenDialog();
  };

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
          const portfolioCoins = portfolio.assetsCalculations.assets
            .map((asset) => {
              const coin = portfolio.assets.find(
                (c) => c.CoinGeckoID === asset.CoinGeckoID
              );
              return coin
                ? { ...coin, buyAndSell: asset.buyAndSell || [] }
                : null;
            })
            .filter((coin) => coin);

          // Check if all symbols in the imported data match the current portfolio's tickers
          const validData = results.data.filter((row) => {
            return portfolioCoins.some((coin) => coin.Ticker === row.Symbol);
          });

          if (validData.length === 0) {
            setAlertInfo({
              message: "No matching symbols found in the current portfolio.",
              severity: "error",
            });
            setShowAlert(true);
            return;
          }

          // Map imported data to the buy and sell structure
          const importedData = validData.map((row) => {
            let parsedDate = null;
            if (row.Date) {
              try {
                parsedDate = parse(row.Date, "M/d/yyyy", new Date());
                if (isNaN(parsedDate)) {
                  throw new Error("Invalid Date");
                }
              } catch (error) {
                console.error("Invalid Date format:", row.Date);
                parsedDate = null;
              }
            }

            const amount = parseFloat(row.Amount);
            const coins = parseFloat(row.Coins);

            return {
              Type: row.Action === "Buy" ? "Kauf" : "Verkauf",
              Date: parsedDate
                ? addDays(parsedDate, 1).toISOString().split("T")[0]
                : null,
              PricePerCoin: parseFloat((amount / coins).toFixed(2)),
              Betrag: amount.toFixed(2),
              Coins: coins.toFixed(2),
              Name: row.Name,
              Symbol: row.Symbol,
            };
          });

          // Group data by coin symbol
          const groupedData = portfolioCoins.reduce((acc, coin) => {
            const coinData = importedData.filter(
              (row) => row.Symbol === coin.Ticker
            );
            if (coinData.length > 0) {
              acc[coin.Ticker] = coinData;
            }
            return acc;
          }, {});

          // Prepare data for API call
          const apiData = Object.keys(groupedData).map((symbol) => {
            const coin = portfolioCoins.find((coin) => coin.Ticker === symbol);
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
              body: JSON.stringify({
                userID: sessionJotai?.user.id,
                data: apiData,
              }),
            });

            if (response.ok) {
              const userPortfolio = await getUserPortfolio(
                sessionJotai?.user.id
              );
              setPortfolio(userPortfolio?.data);
              setAlertInfo({
                message: "Data successfully imported!",
                severity: "success",
              });
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
        },
      });
    }
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

  console.log(coin);
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
        <CoinDetailsDisplay
          financialSummary={financialSummary}
          coin={coin}
          width={width}
          currency={currency}
          rates={rates}
        />
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
              label={t("transactions")}
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
              label={t("buyZones")}
              sx={{
                backgroundColor: value === 1 ? "#ffffff08" : "#00000033",
                marginRight: "15px",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                fontWeight: value === 1 ? "bold" : "normal",
                fontSize: "12px",
              }}
              disabled
            />
            <Tab
              label={t("sellZones")}
              sx={{
                backgroundColor: value === 2 ? "#ffffff08" : "#00000033",
                marginRight: "15px",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                fontWeight: value === 2 ? "bold" : "normal",
                fontSize: "12px",
              }}
              disabled
            />
          </Tabs>
          <Box>
            {value === 0 && (
              <CoinDetailsTable
                rowVals={rowVals}
                handleRowData={handleRowData}
                handleDeleteRow={handleDeleteRow}
                validationError={validationError}
              />
            )}
            {value === 1 && <div>{t("buyZonesContent")}</div>}
            {value === 2 && <div>{t("sellZonesContent")}</div>}
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
              disabled={!coin}
            >
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
              {t("newTransaction")}
            </Button>
            {/* <Button
              sx={{
                marginTop: "20px",
                backgroundColor: "#00000033",
                color: "white",
                fontSize: "0.8rem",
              }}
              onClick={handleImport}
            >
              {t("importCSV")}
              <FontAwesomeIcon
                icon={faCrown}
                style={{
                  paddingLeft: "5px",
                  opacity: "0.5",
                  fontSize: "0.9rem",
                  marginRight: "15px",
                }}
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
            >
              {t("exportCSV")}
              <FontAwesomeIcon
                icon={faCrown}
                style={{
                  paddingLeft: "5px",
                  opacity: "0.5",
                  fontSize: "0.9rem",
                  marginRight: "15px",
                }}
                color="gold"
              />
            </Button> */}
            <Button
              sx={{
                marginTop: "20px",
                p: "0.5rem 1rem",
                backgroundColor: "#1188ff",
                color: "white",
                fontSize: "0.8rem",
                "&:hover": { backgroundColor: "#0a549f" },
              }}
              onClick={handleBuyAndSell}
              disabled={rowVals.length <= 0}
            >
              {Loading ? "Loading..." : `${t("update")}`}
            </Button>
          </Box>
        </Box>
        {/* <AlertBar
          open={showAlert}
          message={alertInfo.message}
          severity={alertInfo.severity}
          onClose={closeAlert}
        /> */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{t("importCSVTitle")}</DialogTitle>
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
                <Typography>{t("dragAndDrop")}</Typography>
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
              {t("cancel")}
            </Button>
            <Button onClick={handleFileUpload} color="primary">
              {t("upload")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {t("importExportInfo")}
        </Alert>
      </Snackbar>
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={closeAlert}>
        <Alert
          onClose={closeAlert}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CoinDetails;
