import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  Grid,
  Tooltip,
  IconButton,
  styled,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteConfirmationDialog from "../../AlertDialog/AlertDialog";
import {
  categoryColors,
  categoryColorsNew,
  convertPrice,
  currencySign,
  getCategoryColor,
  getCurrencyAndRates,
  getUserPortfolio,
  UpdateCryptoCoins,
} from "../../../lib/data";
import AlertBar from "../../customAllert/Alert";
import { useAtom } from "jotai/index";
import { sessionAtom } from "../../../app/stores/sessionStore";
import { portfolioAtom } from "../../../app/stores/portfolioStore";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { faCrown, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import addCommas from "../../../lib/currencyFormatter";
import maxLenCrop from "../../../lib/checkString";

const CategoryColorBar = styled(Box)(({ colors }) => {
  const gradient =
    colors.length > 1 ? `linear-gradient(${colors.join(", ")})` : colors[0];

  return {
    width: 4,
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    background: gradient,
  };
});

const isFavorite = (CoinGeckoID, assetsCalculations) => {
  return assetsCalculations?.Favourite.some(
    (asset) => asset.CoinGeckoID === CoinGeckoID
  );
};

const PortfolioCard = React.memo(
  ({
    asset,
    index,
    deleteIconIndex,
    handleMouseEnter,
    handleMouseLeave,
    setCoin,
    handleDeleteClick,
    currency,
    rates,
    getCategoryColors,
    currencySign,
    setFinancialSummaryAPI,
    convertPrice,
    addCommas,
    maxLenCrop,
  }) => {
    return (
      <Grid
        item
        key={asset.id}
        xs={12}
        sm={6}
        md={15}
        sx={{
          width: "100%",
          "& .MuiPaper-root": {
            backgroundColor: "#00000033",
          },
        }}
      >
        <Card
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave()}
          onDoubleClick={() => setCoin(index)}
          id="hello"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            cursor: "pointer",
            borderRadius: 0,
            backgroundColor: "#23252b",
            "&:hover": { backgroundColor: "#00000099" },
            "&:hover > *:first-child": { display: "block" },
            "&:hover > *:last-child > *:last-child": {
              display: "inline-flex !important",
            },
            position: "relative",
            userSelect: "none",
            width: "100%",
          }}
        >
          <CategoryColorBar
            colors={getCategoryColors(asset.Category)}
            sx={{ display: "none" }}
          />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={asset.cgImageURL}
              sx={{ width: 28, height: 28, mr: 1 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ color: "#fff", fontSize: "14px" }}>
                {asset.Ticker}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "#fff",
              flexBasis: "33%",
              marginLeft: "auto",
              textAlign: "right",
            }}
          >
            {maxLenCrop(
              addCommas(
                convertPrice(asset?.Price || 0, currency, rates)
              ).toString()
            )}{" "}
            {currencySign[currency]}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              flexBasis: "40%",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ color: "#fff" }}
              >
                {convertPrice(
                  setFinancialSummaryAPI(asset.CoinGeckoID)[1],
                  currency,
                  rates
                )}{" "}
                {currencySign[currency]}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ color: "gray" }}
              >
                {setFinancialSummaryAPI(asset.CoinGeckoID)[0].toFixed(2)}{" "}
                {asset.Ticker}
              </Typography>
            </Box>
            <Tooltip
              title="Delete"
              onClick={() => handleDeleteClick(asset)}
              style={{ display: "none" }}
            >
              <IconButton sx={{ color: "gray", "&:hover": { color: "red" } }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Card>
      </Grid>
    );
  }
);

PortfolioCard.displayName = "PortfolioCard";

const PortfolioComponent = ({
  loadingPortfolio,
  assetsLeangth,
  setSelectedCoin,
  setTabSelector,
}) => {
  const [width, setWidth] = useState(0);
  const [sessionJotai] = useAtom(sessionAtom);
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });
  const [deleteIconIndex, setDeleteIconIndex] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [err, setErr] = useState(false);
  const t = useTranslations("portfolioComponent");

  const [currency, setCurrency] = useState("EUR");
  const [rates, setRates] = useState(null);
  const searchParams = useSearchParams();
  const currentCurrency = searchParams.get("currency") || "EUR";

  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState(null);

  const [delAllBtn, setDelAllBtn] = useState(false);

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
    const fetchCurrencyAndRates = async () => {
      const { rates } = await getCurrencyAndRates();
      setCurrency(currentCurrency);
      setRates(rates);
    };
    fetchCurrencyAndRates();
  }, [currentCurrency]);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleDeleteClick = (asset) => {
    setSelectedAsset(asset);
  };

  const setCoin = (index) => {
    if (setSelectedCoin !== undefined) {
      // console.log(index);
      setSelectedCoin(index);
      setTabSelector("two");
    }
  };

  const handleDeleteConfirm = async () => {
    // const portfolioId = portfolio._id;
    const userId = sessionJotai?.user.id;
    const CoinGeckoID = selectedAsset.CoinGeckoID;
    const token = sessionJotai?.user.accessToken;

    try {
      setLoading(true);
      // Call the API to delete the coin from the portfolioGenerator
      const response = await fetch("/api/deleteCoinPortfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, CoinGeckoID }),
      });

      const data = await response.json();

      // Handle response
      if (response.ok) {
        // console.log("Success:", data.message);
        setSelectedAsset(null);

        // Remove the asset from the local state to update the UI
        setPortfolio((prevState) => ({
          ...prevState,
          assets: prevState.assets.filter(
            (asset) => asset.CoinGeckoID !== CoinGeckoID
          ),
          assetsCalculations: {
            ...prevState.assetsCalculations,
            assets: prevState.assetsCalculations.assets.filter(
              (asset) => asset.CoinGeckoID !== CoinGeckoID
            ),
          },
        }));
        // alert('Coin removed successfully');
        // setAlert({
        //   open: true,
        //   message: `${t("coinRemovedSuccess")}`,
        //   severity: "success",
        // });
      } else {
        throw new Error(data.message || "Failed to delete the coin");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error.message);
      // alert("Error removing coin: " + error.message);
    }

    // Close the dialog regardless of success or failure
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setSelectedAsset(null);
  };

  const handleMouseEnter = (index) => {
    // console.log(index);
    setDeleteIconIndex(index);
  };

  const handleMouseLeave = () => {
    setDeleteIconIndex(null);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (sessionJotai?.user) {
  //       const userId = sessionJotai?.user.id;
  //       try {
  //         const res = await UpdateCryptoCoins(userId);
  //         if (res.ok) {
  //           // const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
  //           // setPortfolio(userPortfolio.data);
  //         } else {
  //           console.error("Failed to update crypto coins: ", res.statusText);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching data: ", error);
  //       }
  //     }
  //   };
  //
  //   fetchData();
  // }, [sessionJotai?.user.id, portfolio]);

  const setFinancialSummaryAPI = (CoinGeckoID) => {
    const asset = portfolio.assetsCalculations.assets.find(
      (a) => a.CoinGeckoID === CoinGeckoID
    );
    const price = portfolio.assets.find(
      (a) => a.CoinGeckoID === CoinGeckoID
    ).Price;
    const totalCoins = asset.buyAndSell.reduce((acc, row) => {
      const coinsValue = parseFloat(row.Coins);
      return row.Type === "Kauf" ? acc + coinsValue : acc - coinsValue;
    }, 0);
    const totalHoldingsValue = (totalCoins * parseFloat(price)).toFixed(2);
    const totalInvested = asset.buyAndSell
      .reduce((acc, row) => acc + parseFloat(row.Betrag), 0)
      .toFixed(2);
    if (CoinGeckoID === "hedera-hashgraph") {
      // console.log(
      //   "check the asset",
      //   totalCoins,
      //   totalHoldingsValue,
      //   totalInvested
      // );
    }
    return [totalCoins, totalHoldingsValue, totalInvested];
  };

  async function handleFavouriteClick(asset) {
    if (
      !sessionJotai?.user?.subscriptionPlan ||
      sessionJotai?.user?.subscriptionPlan === "free"
    ) {
      setErr(
        "If you want to add coins to Fav, please subscribe to one of our plans."
      );
      setAlertOpen(true);
      return;
    }
    setLoading(true);
    const userId = sessionJotai?.user.id;
    const CoinGeckoID = asset?.CoinGeckoID;
    const token = sessionJotai?.user.accessToken;
    const response = await fetch("/api/addCoinToFavorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, CoinGeckoID }),
    });
    if (response.ok) {
      const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
      setPortfolio(userPortfolio.data);
      setLoading(false);
    }
  }
  const getCategoryColors = (categories) => {
    return categories.map(
      (category) => categoryColorsNew[category] || "#ffffff"
    );
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
    if (
      !sessionJotai?.user?.subscriptionPlan ||
      sessionJotai?.user?.subscriptionPlan === "free" ||
      sessionJotai?.user?.subscriptionPlan === "free+"
    ) {
      setErr("If export portfolio, please subscribe to one of our plans.");
      setAlertOpen(true);
      return;
    }
    // console.log("portfolioportfolioportfolio,", portfolio);

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
            Name: coin.Name, // Assuming all are Bitcoin, adjust if necessary
            Symbol: coin.Ticker, // Assuming all are BTC, adjust if necessary
            Action: transaction.Type === "Kauf" ? "Buy" : "Sell",
            Coins: transaction.Coins,
            Amount: transaction.Betrag,
          });
        });
      }
    });

    // console.log("portfolio-rows", rows);

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
    if (
      !sessionJotai?.user?.subscriptionPlan ||
      sessionJotai?.user?.subscriptionPlan === "free" ||
      sessionJotai?.user?.subscriptionPlan === "free+"
    ) {
      setErr(
        "If you want to import portfolio, please subscribe to one of our plans."
      );
      setAlertOpen(true);
      return;
    }
    handleOpenDialog();
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseImpDialog = () => {
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
              handleCloseImpDialog();
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

  const handleDeleteAllPortfolioCoins = async () => {
    const token = sessionJotai?.user?.accessToken;
    const response = await fetch("/api/deleteAllPortfolioCoins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: sessionJotai?.user.id,
      }),
    });
    if (response.ok) {
      setAlert({
        open: true,
        message: "All portfolio coins deleted successfully!",
        severity: "success",
      });
      const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
      setPortfolio(userPortfolio?.data);
    } else {
      const errorData = await response.json();
      setAlert({
        open: true,
        message: errorData.message || "Failed to delete portfolio coins",
        severity: "error",
      });
    }
    setDelAllBtn(false);
  };
  // console.log("port,", portfolio);

  const renderPortfolio = useMemo(() => {
    return !portfolio?.assets ? (
      <></>
    ) : (
      portfolio?.assets.slice().map((asset, index) => (
        <PortfolioCard
          key={asset.id} // Use a stable unique key
          asset={asset}
          index={index}
          deleteIconIndex={deleteIconIndex}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          setCoin={setCoin}
          handleDeleteClick={handleDeleteClick}
          currency={currency}
          rates={rates}
          getCategoryColors={getCategoryColors}
          currencySign={currencySign}
          setFinancialSummaryAPI={setFinancialSummaryAPI}
          convertPrice={convertPrice}
          addCommas={addCommas}
          maxLenCrop={maxLenCrop}
        />
      ))
    );
  }, [portfolio]);

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: "100px",
          // pl: width < 900 ? 0 : 3,
          // width: width >= 1400 ? "33.33%" : width > 900 ? "400px" : "100%",
          // mt: width < 900 ? "2rem" : 0,
        }}
      >
        <AlertBar
          open={alert.open}
          message={alert.message}
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, open: false })}
        />
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#202530",
            // p: "2px",
            display: "flex",
            borderRadius: "8px",
          }}
        >
          <Box sx={{ p: 3, width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  marginBottom: "1rem",
                  mt: "8px",
                }}
              >
                {t("title")} ({assetsLeangth})
              </Typography>
              <Button
                onClick={() => setDelAllBtn(true)}
                sx={{
                  backgroundColor: "#00000033",
                  padding: "0.5rem 1rem",
                  // color: "white",
                  display: "flex",
                  alignItems: "center",
                  textTransform: "capitalize",
                  color: "var(--color-secondary)",
                  fontWeight: "bold",

                  "&:hover": {
                    color: "black",
                    backgroundColor: "var(--color-secondary)",
                  },
                }}
              >
                {t("deleteAll")}
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ marginLeft: "10px", transform: "translateY(-2px)" }}
                />
              </Button>
            </Box>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: "#ffffff80", fontSize: "0.9rem", mb: "2rem" }}
            >
              {t("subtitle")}
            </Typography>
            {loadingPortfolio ? (
              <>
                <Grid
                  sx={{
                    borderRadius: "4px",
                    overflow: "auto",
                    scrollbarColor: "#555559 #333339",
                    maxHeight: "500px",
                    // width: "100%",
                    "& .MuiGrid-item": {
                      "@media only screen and (max-width: 1000px)": {
                        maxWidth: "1000px",
                      },
                    },
                  }}
                >
                  {loadingPortfolio && renderPortfolio}
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    sx={{
                      marginTop: "20px",
                      backgroundColor: "#00000033",
                      color: "white",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.5rem 1rem",
                    }}
                    onClick={handleImport}
                  >
                    import
                    {/* {t("importCSV")} */}
                    <FontAwesomeIcon
                      icon={faCrown}
                      style={{
                        paddingLeft: "5px",
                        opacity: "0.5",
                        fontSize: "0.9rem",
                        // marginRight: "15px",
                        transform: "translateY(-1px)",
                      }}
                      color={
                        sessionJotai?.user?.subscriptionPlan &&
                        sessionJotai?.user?.subscriptionPlan !== "free" &&
                        sessionJotai?.user?.subscriptionPlan !== "free+"
                          ? "gold"
                          : "grey"
                      }
                    />
                  </Button>
                  <Button
                    sx={{
                      marginTop: "20px",
                      backgroundColor: "#00000033",
                      color: "white",
                      fontSize: "0.8rem",
                      // marginLeft: "10px",
                      display: "flex",
                      justifyContent: "center",
                      padding: "0.5rem 1rem",
                    }}
                    onClick={handleExportCSV}
                  >
                    export
                    {/* {t("exportCSV")} */}
                    <FontAwesomeIcon
                      icon={faCrown}
                      style={{
                        paddingLeft: "5px",
                        opacity: "0.5",
                        fontSize: "0.9rem",
                        // marginRight: "15px",
                        transform: "translateY(-1px)",
                      }}
                      color={
                        sessionJotai?.user?.subscriptionPlan &&
                        sessionJotai?.user?.subscriptionPlan !== "free" &&
                        sessionJotai?.user?.subscriptionPlan !== "free+"
                          ? "gold"
                          : "grey"
                      }
                    />
                  </Button>
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
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
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
                      <Button onClick={handleCloseImpDialog} color="primary">
                        {t("cancel")}
                      </Button>
                      <Button onClick={handleFileUpload} color="primary">
                        {t("upload")}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </>
            ) : (
              <Card
                sx={{
                  height: "300px",
                  backgroundColor: "#23252b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "gray" }}>Keine Einträge</Typography>
              </Card>
            )}
          </Box>
          <DeleteConfirmationDialog
            open={Boolean(selectedAsset)}
            handleClose={handleCloseDialog}
            handleDeleteConfirm={handleDeleteConfirm}
            asset={selectedAsset}
          />
          <DeleteConfirmationDialog
            open={delAllBtn}
            handleClose={() => setDelAllBtn(false)}
            handleDeleteConfirm={handleDeleteAllPortfolioCoins}
            // asset={selectedAsset}
          />
        </Box>
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
          {err}
        </Alert>
      </Snackbar>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </>
  );
};

export default PortfolioComponent;
