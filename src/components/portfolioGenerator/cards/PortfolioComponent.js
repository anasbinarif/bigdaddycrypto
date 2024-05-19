import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  Grid,
  Tooltip,
  IconButton,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteConfirmationDialog from "@/components/AlertDialog/AlertDialog";
import { getCategoryColor, getUserPortfolio } from "@/lib/data";
import AlertBar from "@/components/customAllert/Alert";
import { useAtom } from "jotai/index";
import { sessionAtom } from "@/app/stores/sessionStore";
import { useTranslations } from "next-intl";

const CategoryColorBar = styled(Box)(({ color }) => ({
  width: 4,
  height: "100%",
  backgroundColor: color,
  position: "absolute",
  left: 0,
  top: 0,
}));

const isFavorite = (CoinGeckoID, assetsCalculations) => {
  return assetsCalculations?.assets.some(
      (asset) => asset.CoinGeckoID === CoinGeckoID && asset.Favourite
  );
};

const PortfolioComponent = ({
                              portfolio,
                              setPortfolio,
                              loadingPortfolio,
                              assetsLeangth,
                              setSelectedCoin,
                              setTabSelector,
                            }) => {
  const [sessionJotai] = useAtom(sessionAtom);
  const [deleteIconIndex, setDeleteIconIndex] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const t = useTranslations("portfolioComponent");

  const handleDeleteClick = (asset) => {
    setSelectedAsset(asset);
  };

  const setCoin = (index) => {
    if (setSelectedCoin !== undefined) {
      setSelectedCoin(index);
      setTabSelector("two");
    }
  };

  const handleDeleteConfirm = async () => {
    const userId = sessionJotai?.user.id;
    const CoinGeckoID = selectedAsset.CoinGeckoID;

    try {
      const response = await fetch("/api/deleteCoinPortfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, CoinGeckoID }),
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedAsset(null);
        setPortfolio((prevState) => ({
          ...prevState,
          assets: prevState.assets.filter(
              (asset) => asset.CoinGeckoID !== CoinGeckoID
          ),
        }));
        setAlert({
          open: true,
          message: t("coinRemovedSuccess"),
          severity: "success",
        });
      } else {
        throw new Error(data.message || "Failed to delete the coin");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setAlert({
        open: true,
        message: `Error removing coin: ${error.message}`,
        severity: "error",
      });
    }

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setSelectedAsset(null);
  };

  const handleMouseEnter = (index) => {
    setDeleteIconIndex(index);
  };

  const handleMouseLeave = () => {
    setDeleteIconIndex(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (sessionJotai?.user) {
        const userId = sessionJotai?.user.id;
        const res = await fetch("/api/crypto", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) {
          throw new Error(`Failed to update data${res}`);
        }
      }
    };
    fetchData();
  }, [sessionJotai?.user.id, portfolio]);

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
      console.log(
          "check the asset",
          totalCoins,
          totalHoldingsValue,
          totalInvested
      );
    }
    return [totalCoins, totalHoldingsValue, totalInvested];
  };

  async function handleFavouriteClick(asset) {
    const userId = sessionJotai?.user.id;
    const CoinGeckoID = asset?.CoinGeckoID;
    const response = await fetch("/api/addCoinToFavorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, CoinGeckoID }),
    });
    if (response.ok) {
      const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
      setPortfolio(userPortfolio.data);
    }
  }

  return (
      <Box sx={{ position: "sticky", top: "100px" }}>
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
              p: 2,
              display: "flex",
              borderRadius: "8px",
            }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {t("title")} ({assetsLeangth})
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {t("subtitle")}
            </Typography>
            {loadingPortfolio ? (
                <Grid
                    sx={{
                      borderRadius: "4px",
                      overflow: "auto",
                      scrollbarColor: "#555559 #333339",
                      maxHeight: "500px",
                    }}
                >
                  {loadingPortfolio &&
                      portfolio.assets.map((asset, index) => (
                          <Grid item key={index} xs={12} sm={6} md={15}>
                            <Card
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={() => handleMouseLeave()}
                                onDoubleClick={() => setCoin(index)}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  p: 2,
                                  cursor: "pointer",
                                  borderRadius: 0,
                                  backgroundColor: "#23252b",
                                  "&:hover": { backgroundColor: "#00000099" },
                                  position: "relative",
                                  userSelect: "none",
                                }}
                            >
                              {deleteIconIndex === index && (
                                  <CategoryColorBar
                                      color={getCategoryColor(asset.Category)}
                                  />
                              )}
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar
                                    src={asset.cgImageURL}
                                    sx={{ width: 28, height: 28, mr: 1 }}
                                />
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                      variant="h6"
                                      sx={{ color: "#fff", fontSize: "14px" }}
                                  >
                                    {asset.Ticker}
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="body2" sx={{ color: "#fff" }}>
                                {asset?.Price ? asset?.Price.toFixed(6) : 0} €
                              </Typography>
                              <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "row",
                                  }}
                              >
                                <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      flexDirection: "column",
                                    }}
                                >
                                  <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ color: "#fff" }}
                                  >
                                    {setFinancialSummaryAPI(asset.CoinGeckoID)[1]} €
                                  </Typography>
                                  <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ color: "gray" }}
                                  >
                                    {setFinancialSummaryAPI(
                                        asset.CoinGeckoID
                                    )[0].toFixed(2)}{" "}
                                    {asset.Ticker}
                                  </Typography>
                                </Box>
                                {deleteIconIndex === index && (
                                    <>
                                      <Tooltip
                                          title={t("delete")}
                                          onClick={() => handleDeleteClick(asset)}
                                      >
                                        <IconButton
                                            sx={{
                                              color: "gray",
                                              "&:hover": { color: "red" },
                                            }}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip
                                          title={t("favourite")}
                                          onClick={() => handleFavouriteClick(asset)}
                                      >
                                        <IconButton
                                            sx={{
                                              color: isFavorite(
                                                  asset.CoinGeckoID,
                                                  portfolio.assetsCalculations
                                              )
                                                  ? "red"
                                                  : "gray",
                                            }}
                                        >
                                          <FavoriteIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                )}
                              </Box>
                            </Card>
                          </Grid>
                      ))}
                </Grid>
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
                  <Typography sx={{ color: "gray" }}>{t("loading")}</Typography>
                </Card>
            )}
          </Box>
          <DeleteConfirmationDialog
              open={Boolean(selectedAsset)}
              handleClose={handleCloseDialog}
              handleDeleteConfirm={handleDeleteConfirm}
              asset={selectedAsset}
          />
        </Box>
      </Box>
  );
};

export default PortfolioComponent;
