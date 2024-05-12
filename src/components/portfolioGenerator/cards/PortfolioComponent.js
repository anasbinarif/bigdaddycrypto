// src/components/PortfolioComponent.js
import React, { useState } from "react";
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
import DeleteConfirmationDialog from "@/components/AlertDialog/AlertDialog";
import { getCategoryColor } from "@/lib/data";
import AlertBar from "@/components/customAllert/Alert";

const CategoryColorBar = styled(Box)(({ color }) => ({
  width: 4,
  height: "100%",
  backgroundColor: color,
  position: "absolute",
  left: 0,
  top: 0,
}));

const PortfolioComponent = ({
  portfolio,
  setPortfolio,
  loadingPortfolio,
  assetsLeangth,
  setSelectedCoin,
}) => {
  // const [sessionJotai] = useAtom(sessionAtom);
  // const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });
  const [deleteIconIndex, setDeleteIconIndex] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  // const [loadingPortfolio, setLoadingPortfolio] = useState(false)
  // const [assetsLeangth, setAssetsLeangth] = useState(0)

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
    }
  };

  const handleDeleteConfirm = async () => {
    const portfolioId = portfolio._id;
    const CoinGeckoID = selectedAsset.CoinGeckoID;
    console.log(CoinGeckoID, portfolioId);

    try {
      // Call the API to delete the coin from the portfolioGenerator
      const response = await fetch("/api/deleteCoinPortfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ portfolioId, CoinGeckoID }),
      });

      const data = await response.json();

      // Handle response
      if (response.ok) {
        console.log("Success:", data.message);
        setSelectedAsset(null);
        // Remove the asset from the local state to update the UI
        setPortfolio((prevState) => ({
          ...prevState,
          assets: prevState.assets.filter(
            (asset) => asset.CoinGeckoID !== CoinGeckoID
          ),
        }));
        // alert('Coin removed successfully');
        setAlert({
          open: true,
          message: "Coin removed successfully",
          severity: "success",
        });
      } else {
        throw new Error(data.message || "Failed to delete the coin");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error removing coin: " + error.message);
    }

    // Close the dialog regardless of success or failure
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setSelectedAsset(null);
  };

  // useEffect(() => {
  //     const fetchData = async () => {
  //         if (sessionJotai?.user) {
  //             const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
  //             setPortfolio(userPortfolio.data.data)
  //         }
  //
  //     };
  //     fetchData();
  // }, [sessionJotai?.user.id]);

  // useEffect(() => {
  //     if (portfolio.userId && portfolio?.assets.length > 0) {
  //         setLoadingPortfolio(true)
  //         const len = portfolio?.assets.length;
  //         setAssetsLeangth(len);
  //         console.log("length of user assets", len);
  //     }
  // }, [portfolio])

  const handleMouseEnter = (index) => {
    setDeleteIconIndex(index);
  };

  const handleMouseLeave = () => {
    setDeleteIconIndex(null);
  };

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
          borderRadius: "2px",
          // position: "sticky",
          // top: "92px",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Portfolio ({assetsLeangth})
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Passe die Gewichtung der Assets an, um ihren tatsächlichen Anteil im
            Portfolio besser wiederzuspiegeln.
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
                      onClick={() => setCoin(index)}
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
                            {asset.UserHolding ? asset.UserHolding : 0} €{" "}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ color: "gray" }}
                          >
                            0 {asset.Ticker}
                          </Typography>
                        </Box>
                        {deleteIconIndex === index && (
                          <Tooltip
                            title="Delete"
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
      </Box>
    </Box>
  );
};

export default PortfolioComponent;
