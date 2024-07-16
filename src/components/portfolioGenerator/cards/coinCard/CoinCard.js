import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  styled,
  SvgIcon,
  Button,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Star";
import {
  bewerteAssetExtremPessimistisch,
  bewerteAssetSpaeteinsteiger,
  categoryColorsNew,
  getUserPortfolio,
  storeUserPortfolioCoin,
} from "../../../../lib/data";
import { portfolioAtom } from "../../../../app/stores/portfolioStore";
import { useAtom } from "jotai";
import { sessionAtom } from "../../../../app/stores/sessionStore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteConfirmationDialog from "../../../../components/AlertDialog/AlertDialog";
import useEnhancedEffect from "@mui/utils/useEnhancedEffect";

const ColorCircle = ({ color }) => (
  <SvgIcon>
    <circle cx="12" cy="12" r="5" fill={color} />
  </SvgIcon>
);

const StyledCard = styled(Card)(({ theme, selected }) => ({
  backgroundColor: "#333", // Dark background
  color: "#fff", // White text
  margin: theme.spacing(1),
  position: "relative", // To position the category color bar
  borderRadius: theme.shape.borderRadius,
  userSelect: "none",
  transition: "background-color 0.3s ease", // Smooth transition
  "&:hover": {
    backgroundColor: selected ? undefined : "#00000099", // Hover background color only if not selected
  },
}));

const CategoryColorBar = styled(Box)(({ colors, selected }) => {
  if (!colors || colors.length === 0) {
    colors = ["#ffffff"]; // Default color if undefined or empty
  }

  const gradient =
    colors.length > 1 ? `linear-gradient(${colors.join(", ")})` : colors[0];

  return {
    width: 4,
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    display: selected ? "none" : "block",
    background: gradient,
  };
});

const CoinCard = ({
  coin,
  selected,
  search = false,
  risk,
  priceIndicator,
  assetsLeangth,
  currentCategory,
  setData,
}) => {
  const {
    Name,
    cgImageURL,
    Ticker,
    Potential,
    Sicherheit,
    Category,
    BottomRanking,
    Bottom,
    Price,
    Risk,
  } = coin;
  const [width, setWidth] = useState(0);
  const [sessionJotai] = useAtom(sessionAtom);
  const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });
  const [filterTag, setFilterTag] = useState("");
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const getCategoryColors = (categories) => {
    return categories?.map(
      (category) => categoryColorsNew[category] || "#ffffff"
    );
  };

  const checkCalculation = (Potential, Sicherheit) => {
    return !!Potential && !!Sicherheit;
  };

  const confirmHandleDoubleClick = () => {
    if (selected) {
      setOpen(true);
    } else {
      handleDoubleClick();
    }
  };

  const handleDoubleClick = async () => {
    const userId = sessionJotai?.user.id;
    // console.log(
    //   sessionJotai.user.subscriptionPlan,
    //   !sessionJotai?.user?.pastUserCheck
    // );

    if (
      // !sessionJotai?.user?.pastUserCheck &&
      sessionJotai?.user?.subscriptionPlan === "free" &&
      assetsLeangth >= 10 &&
      !selected
    ) {
      setError(
        "If you want to add more coins to your portfolio, please subscribe to one of our plans."
      );
      setAlertOpen(true);
      return;
    }

    setLoading(true);
    const token = sessionJotai?.user.accessToken;
    const res = await storeUserPortfolioCoin(userId, coin, token);

    if (res.ok) {
      // const ress = await UpdateCryptoCoins(userId);
      // if (ress) console.log("")
      const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
      setPortfolio(userPortfolio.data);
    } else {
      console.error(
        "Error handling the portfolioGenerator update:",
        res.message
      );
    }

    setLoading(false); // Set loading to false
    setOpen(false);
  };

  useEffect(() => {
    const rank = BottomRanking;
    const xWert = +((1 / Bottom) * Price).toFixed(2);
    let newFilterTag = "";
    switch (priceIndicator) {
      case "pi0":
        newFilterTag = bewerteAssetExtremPessimistisch(rank, xWert);
        break;
      case "pi1":
        newFilterTag = bewerteAssetExtremPessimistisch(rank, xWert);
        break;
      case "pi2":
        newFilterTag = bewerteAssetExtremPessimistisch(rank, xWert);
        break;
      case "pi3":
        newFilterTag = bewerteAssetSpaeteinsteiger(rank, xWert);
        break;
      case "pi4":
        newFilterTag = bewerteAssetSpaeteinsteiger(rank, xWert);
        break;
      default:
        newFilterTag = "";
    }
    setFilterTag(newFilterTag);
  }, [priceIndicator, BottomRanking, Bottom, Price]);

  const priceIndicatorColors = {
    Honey: "#32CD32cc", // Grün
    Gut: "#ADFF2Fcc", // Hellgrün
    OK: "#FFA500cc", // Gelb
    Naja: "#FF4500cc", // Orange
    Teuer: "#DC143Ccc", // Rot
  };

  async function handleFavouriteClick() {
    setLoading(true);
    // console.log("handleFavouriteClick", coin);
    if (
      !sessionJotai?.user?.subscriptionPlan ||
      sessionJotai?.user?.subscriptionPlan === "free" ||
      sessionJotai?.user?.subscriptionPlan === "free+"
    ) {
      setError(
        "If you want to add coins to Fav, please subscribe to one of our plans."
      );
      setAlertOpen(true);
      setLoading(false); // Reset loading state here
      return;
    }
    const userId = sessionJotai?.user.id;
    const CoinGeckoID = coin?.CoinGeckoID;
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
      const userPortfolio = await getUserPortfolio(userId);
      setPortfolio(userPortfolio.data);
      setData((prevData) => {
        const updatedFavourite = prevData.favourite
          ? [...prevData.favourite]
          : [];
        const coinIndex = updatedFavourite.findIndex(
          (favCoin) => favCoin.CoinGeckoID === CoinGeckoID
        );

        if (coinIndex > -1) {
          // Coin is already in favourites, remove it
          updatedFavourite.splice(coinIndex, 1);
        } else {
          // Coin is not in favourites, add it
          updatedFavourite.push(coin);
        }

        return {
          ...prevData,
          favourite: updatedFavourite,
        };
      });
    } else {
      console.error("Failed to toggle favourite status.");
    }
    setLoading(false);
  }

  const isFavorite = (CoinGeckoID, assetsCalculations) => {
    return assetsCalculations?.Favourite.some(
      (asset) => asset.CoinGeckoID === CoinGeckoID
    );
  };
  const [xfactorText, setXfactorText] = useState("");

  useEffect(() => {
    // console.log(
    //   "1 / coin?.Bottom * coin?.Price",
    //   (1 / coin?.Bottom) * coin?.Price
    // );
    const xfactorValue = Math.max((1 / coin?.Bottom) * coin?.Price, 1).toFixed(
      1
    );
    setXfactorText(`${xfactorValue}x in diesem Zyklus`);
  }, [coin]);

  const [cursorPos, setCursorPos] = useState({ top: 0, left: 0 });

  const handleMouseMove = (event) => {
    setCursorPos({ top: event.clientY, left: event.clientX });
  };

  const getBackgroundColor = (sicherheitAverage) => {
    if (sicherheitAverage >= 0 && sicherheitAverage < 5.5) {
      return "rgb(248, 190, 161)";
    } else if (sicherheitAverage >= 5.5 && sicherheitAverage < 7) {
      return "rgb(191, 218, 177)"; // or another shade for "light faded green"
    } else if (sicherheitAverage >= 7 && sicherheitAverage <= 10) {
      return "rgb(81, 196, 65)";
    } else {
      return "gray"; // default color if the value is out of expected range
    }
  };

  return (
    <>
      {search ? (
        <StyledCard
          onDoubleClick={confirmHandleDoubleClick}
          selected={selected}
          sx={{
            cursor: "pointer",
            border: selected
              ? "1px solid #00aa66aa"
              : Risk === "risk"
              ? "1px solid rgb(222,11,11)"
              : "none",
            backgroundColor: selected
              ? "#00aa6633"
              : Risk === "risk"
              ? "rgba(222,11,11,0.05)"
              : "#00000033",
            width: "95%",
            borderStyle: risk ? "dashed" : selected ? "solid" : "none",
            borderLeft: selected ? "" : risk ? "none" : "",
          }}
        >
          <CategoryColorBar
            colors={getCategoryColors(Category)}
            selected={selected}
          />
          <CardContent>
            <CheckCircleIcon
              sx={{
                color: "#00aa66",
                display: selected ? "block" : "none",
                position: "absolute",
                zIndex: 1,
                top: "5px",
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", mb: 1, pl: 1 }}>
              <Avatar
                src={cgImageURL}
                sx={{ width: 35, height: 35, marginRight: 1 }}
              />
              <Typography variant="subtitle2" noWrap>
                {Ticker}
              </Typography>
              <Typography
                component="div"
                variant="body2"
                noWrap
                sx={{ marginLeft: "10px" }}
              >
                {Name}
              </Typography>
            </Box>
            {filterTag && (
              <Box
                sx={{
                  position: "absolute",
                  right: "0",
                  top: "0",
                  zIndex: 2,
                  padding: "3px 8px 2px",
                  borderBottomLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                  color: "#fff9",
                  background: "#1114",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  component="div"
                  variant="body2"
                  sx={{
                    fontSize: 20,
                    display: "flex",
                    gap: "2px",
                    color: "white",
                  }}
                >
                  {filterTag}
                </Typography>
                <ColorCircle color={priceIndicatorColors[filterTag]} />
              </Box>
            )}
            <>
              <Box
                sx={{
                  position: "absolute",
                  right: "0",
                  top: "0",
                }}
              >
                <Tooltip
                  title="Favourite"
                  onClick={handleFavouriteClick}
                  sx={{
                    position: "absolute",
                    left: "0",
                    bottom: "0",
                  }}
                >
                  <IconButton
                    sx={{
                      color: isFavorite(
                        coin.CoinGeckoID,
                        portfolio?.assetsCalculations
                      )
                        ? "yellow"
                        : "gray",
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
            {checkCalculation(Potential, Sicherheit) && (
              <Box
                sx={{
                  position: "absolute",
                  right: "0",
                  bottom: "0",
                  bgcolor: getBackgroundColor(Sicherheit),
                  borderBottomRightRadius: "4px",
                  borderTopLeftRadius: "4px",
                  padding: "1px 6px 0",
                }}
              >
                <Typography
                  component="div"
                  variant="body2"
                  sx={{
                    color: "#000000",
                    fontSize: 13,
                    display: "flex",
                    gap: "2px",
                  }}
                >
                  <span>{Potential}</span>
                  <span>|</span>
                  <span>{Sicherheit}</span>
                </Typography>
              </Box>
            )}
          </CardContent>
        </StyledCard>
      ) : (
        <StyledCard
          onDoubleClick={confirmHandleDoubleClick}
          selected={selected}
          sx={{
            cursor: "pointer",
            border: selected
              ? "1px solid #00aa66aa"
              : risk
              ? "1px solid rgb(222, 11, 11)"
              : "none",
            backgroundColor: selected
              ? "#00aa6633"
              : risk
              ? "rgba(222, 11, 11, .05)"
              : "#00000033",
            width:
              width >= 1500
                ? "calc(25% - 16px)"
                : width > 1200
                ? "calc(33.33% - 16px)"
                : width > 900
                ? "calc(50% - 16px)"
                : width > 700
                ? "calc(33.33% - 16px)"
                : width > 500
                ? "calc(50% - 16px)"
                : "calc(100% - 16px)",
            borderStyle: risk ? "dashed" : selected ? "solid" : "none",
            borderLeft: selected ? "" : risk ? "none" : "",
          }}
        >
          <CategoryColorBar
            colors={getCategoryColors(Category)}
            selected={selected}
          />
          <Tooltip
            title={xfactorText}
            arrow
            PopperProps={{
              anchorEl: {
                getBoundingClientRect: () => ({
                  top: cursorPos.top,
                  left: cursorPos.left,
                  right: cursorPos.left,
                  bottom: cursorPos.top,
                  width: 0,
                  height: 0,
                }),
                clientWidth: 0,
                clientHeight: 0,
              },
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 10], // Offset from the cursor
                  },
                },
              ],
            }}
          >
            <CardContent
              sx={{ display: "flex", alignItems: "flex-start" }}
              onMouseMove={handleMouseMove}
            >
              <CheckCircleIcon
                sx={{
                  color: "#00aa66",
                  display: selected ? "block" : "none",
                  position: "absolute",
                  zIndex: 1,
                  top: "5px",
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, pl: 1 }}>
                <Avatar
                  src={cgImageURL}
                  sx={{ width: 35, height: 35, marginRight: 1 }}
                />
              </Box>
              <Box sx={{ paddingLeft: 1, paddingBottom: 2 }}>
                <Typography
                  variant="subtitle2"
                  noWrap
                  sx={{
                    marginBottom: "2px",
                    marginTop: "2px",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {Ticker}
                </Typography>
                <Typography
                  component="div"
                  variant="body2"
                  noWrap
                  sx={{ color: "#ffffff80" }}
                >
                  {Name}
                </Typography>
              </Box>
              {filterTag && (
                <Box
                  sx={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    zIndex: 2,
                    padding: "3px 8px 2px",
                    borderBottomLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    color: "#fff9",
                    background: "#1114",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    component="div"
                    variant="body2"
                    sx={{
                      fontSize: 12,
                      display: "flex",
                      gap: "2px",
                      color: "#fff9",
                    }}
                  >
                    {filterTag}
                  </Typography>
                  <ColorCircle color={priceIndicatorColors[filterTag]} />
                </Box>
              )}
              <>
                <Box
                  sx={{
                    position: "absolute",
                    left: "0",
                    bottom: "0",
                  }}
                >
                  <Tooltip title="Favourite" onClick={handleFavouriteClick}>
                    <IconButton
                      sx={{
                        color: isFavorite(
                          coin.CoinGeckoID,
                          portfolio?.assetsCalculations
                        )
                          ? "yellow"
                          : "gray",
                      }}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
              {checkCalculation(Potential, Sicherheit) && (
                <Box
                  sx={{
                    position: "absolute",
                    right: "0",
                    bottom: "0",
                    bgcolor: getBackgroundColor(Sicherheit),
                    borderBottomRightRadius: "4px",
                    borderTopLeftRadius: "4px",
                    padding: "1px 6px 0",
                  }}
                >
                  <Typography
                    component="div"
                    variant="body2"
                    sx={{
                      color: "#000000",
                      fontSize: 13,
                      display: "flex",
                      gap: "2px",
                    }}
                  >
                    <span>{Potential}</span>
                    <span>|</span>
                    <span>{Sicherheit}</span>
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Tooltip>
        </StyledCard>
      )}
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
      <DeleteConfirmationDialog
        open={open}
        handleClose={() => setOpen(false)}
        handleDeleteConfirm={handleDoubleClick}
        asset={coin.Name}
      />
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
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CoinCard;
