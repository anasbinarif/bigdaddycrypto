"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  Chip,
  Paper,
  Avatar,
  Grid,
  FormControlLabel,
  Checkbox,
  Snackbar,
  IconButton,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Close as CloseIcon } from "@mui/icons-material";
import getCoins from "./coins.js";
import { styled } from "@mui/material/styles";
import { categoriesDisplay1, categoryColors, getAllAssets } from "../../../lib/data";
import { pink } from "@mui/material/colors";

const StyledTextField = (props) => {
  return (
    <TextField
      {...props}
      sx={{
        mb: 2,
        "& .MuiFormHelperText-root": {
          color: "#ffffff", // Helper text color
        },
        "& .MuiFormLabel-root": {
          color: "#ffffff",
          "&.Mui-focused": {
            color: "#ffffff",
          },
        },
        "& .MuiInputBase-root": {
          "& .MuiInputBase-input": {
            color: "#fff",
          },
        },
        "& .MuiOutlinedInput-root": {
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ffffff",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ffffff",
          },
        },
      }}
    />
  );
};

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const AddAsset = () => {
  const t = useTranslations("adminPage");

  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    bottom: "",
    bottomRanking: "",
    coinGeckoID: "",
    cgPrice: "",
    cgImageURL: "",
    risk: "",
    potential: "",
    sicherheit: "",
    categories: [],
  });
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [allAssets, setAllAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const coins = await getCoins();
        setData(coins);
        setSearchData(coins.slice(0, 100));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    setLoading(true);
    getAllAssets()
      .then((data) => {
        // console.log(data);
        setAllAssets(data.data);
        // setSearchData(data.data.slice(0, 5));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    fetchAllData();
  }, []);
  // console.log("setAllAssets:", allAssets);

  const searchCoin = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearch(searchText);

    // Filter for exact matches first
    let exactMatches = data.filter(
      (coin) =>
        coin.name.toLowerCase() === searchText ||
        coin.symbol.toLowerCase() === searchText
    );

    // If there are fewer than 100 exact matches, include partial matches
    if (exactMatches.length < 100) {
      const partialMatches = data.filter(
        (coin) =>
          (coin.name.toLowerCase().includes(searchText) ||
            coin.symbol.toLowerCase().includes(searchText)) &&
          !(
            coin.name.toLowerCase() === searchText ||
            coin.symbol.toLowerCase() === searchText
          ) // Exclude exact matches already included
      );

      exactMatches = exactMatches.concat(
        partialMatches.slice(0, 100 - exactMatches.length)
      );
    }

    setSearchData(exactMatches.slice(0, 100));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      risk: event.target.checked ? "risk" : "",
    }));
  };

  const handleAddCategory = (event) => {
    const { value } = event.target;
    if (formData.categories.includes(value)) return;
    setFormData((prevState) => ({
      ...prevState,
      categories: [...prevState.categories, value],
    }));
  };

  const handleDeleteCategory = (categoryToDelete) => () => {
    setFormData((prevState) => ({
      ...prevState,
      categories: prevState.categories.filter(
        (category) => category !== categoryToDelete
      ),
    }));
  };

  const menuItemDisplayMap = {
    "ai": "AI",
    "web3": "Web3/Anonymität",
    "defi": "DeFi",
    "green": "Grüne Coins",
    "metaverse": "Gaming/Metaverse",
    "btc": "BTC-Zusammenhang",
    "cbdc": "CBDC-Netzwerke",
    "ecommerce": "eCommerce",
    "nft": "Tokenisierung/RWA"
  };
  
  const handleCoinClicked = async (row) => {
    setFormData({
      name: "",
      ticker: "",
      bottom: "",
      bottomRanking: "",
      coinGeckoID: "",
      cgPrice: "",
      cgImageURL: "",
      risk: "",
      potential: "",
      sicherheit: "",
      categories: [],
    });
    if (checkAssetInDB(row.id)) {
      const response = await fetch(`/api/getAssetById?id=${row.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const asset = data?.asset[0]
      console.log("coindetainsfromdb", data);
      setFormData((prevState) => ({
        ...prevState,
        name: row.name,
        ticker: row.symbol.toUpperCase(),
        coinGeckoID: row.id,
        potential: asset.Potential,
        sicherheit: asset.Sicherheit,
        categories: asset.Category.map(category => menuItemDisplayMap[category]),
        risk: asset.Risk
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        name: row.name,
        ticker: row.symbol.toUpperCase(),
        coinGeckoID: row.id,
      }));
    }
    try {
      const response = await fetch(
        `/api/getAssetDetailFromCoingecko?id=${row.id}`
      );
      if (response.ok) {
        const assetDetails = await response.json();
        setFormData((prevState) => ({
          ...prevState,
          bottom: assetDetails.data.lowestPrice,
          cgPrice: assetDetails.data.currentPrice,
          cgImageURL: assetDetails.data.cgImageURL,
        }));
      } else {
        console.error("Error fetching asset details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching asset details:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.ticker ||
      !formData.bottom ||
      !formData.cgPrice ||
      formData.categories.length === 0
    ) {
      setAlertMessage(t("fillAllFields"));
      setOpen(true);
      return;
    }

    const formattedData = {
      ...formData,
      bottom: parseFloat(formData.bottom),
      cgPrice: parseFloat(formData.cgPrice),
      potential: parseFloat(formData.potential),
      sicherheit: parseFloat(formData.sicherheit),
      categories: formData.categories.map((category) => {
        return Object.keys(categoriesDisplay1).find(
          (key) => categoriesDisplay1[key] === category
        );
      }),
    };

    const res = await fetch("/api/addAssetFromAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: formattedData }),
      cache: "no-store",
    });

    if (res.ok) {
      setAlertMessage(t("assetAdded"));
      setFormData({
        name: "",
        ticker: "",
        bottom: "",
        bottomRanking: "",
        coinGeckoID: "",
        cgPrice: "",
        cgImageURL: "",
        risk: "",
        potential: "",
        sicherheit: "",
        categories: [],
      });
      getAllAssets()
          .then((data) => {
            // console.log(data);
            setAllAssets(data.data);
            // setSearchData(data.data.slice(0, 5));
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            setLoading(false);
          });
    } else {
      setAlertMessage(t("assetAddFailed"));
    }
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const checkAssetInDB = (id) => {
    const val = allAssets.some(asset => asset.CoinGeckoID === id);
    // console.log("yoooo", val, id);
    return val;
  }

  return (
    <Box>
      <Container
        // component="main"
        maxWidth="xl"
        sx={{
          mt: 5,
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            backgroundColor: "#202530",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            alignSelf: "flex-start",
            marginRight: { md: "2rem", xs: "0" },
            marginBottom: { xs: "2rem", md: "0" },
            width: { md: "50%", xs: "100%" },
          }}
        >
          <Box
            sx={{
              width: "100%",
              paddingBottom: "1rem",
              borderBottom: "1px solid #ffffff",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t("searchNameOrTicker")}
            </Typography>
            <StyledTextField
              margin="normal"
              fullWidth
              label={t("search")}
              name="search"
              value={search}
              onChange={searchCoin}
              autoFocus
            />
          </Box>
          <Box sx={{ mt: "1rem" }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {t("selectAsset")}
            </Typography>
            <TableContainer
              sx={{
                backgroundColor: "#ffffff08",
                maxHeight: "400px",
                overflowY: "auto",
                "& .MuiTableCell-head": {
                  color: "#ffffff50",
                  border: "none",
                  fontWeight: "bold",
                },
                "& .MuiTableBody-root .MuiTableRow-root": {
                  // backgroundColor: "#00000033",
                  "&:hover": {
                    // backgroundColor: "#00000050",
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
                    <TableCell>CoinGecko-ID</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchData.map((row, index) => (
                    <TableRow
                      key={index}
                      onClick={() => handleCoinClicked(row)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: checkAssetInDB(row.id) ? "#32a7e1" : "#00000033",
                        "&:hover": {
                          backgroundColor: checkAssetInDB(row.id) ? "#064665" : "#00000050",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography>{row.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{row.symbol}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{row.name}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "#202530",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            width: { md: "50%", xs: "100%" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" gutterBottom>
              {t("addAsset")}
            </Typography>
            {formData.cgImageURL && (
              <Avatar
                src={formData.cgImageURL}
                sx={{ width: 50, height: 50 }}
              />
            )}
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  label={t("name")}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  label={t("ticker")}
                  name="ticker"
                  value={formData.ticker}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  label={t("bottom")}
                  name="bottom"
                  value={formData.bottom}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  margin="normal"
                  fullWidth
                  label={t("bottomRanking")}
                  name="bottomRanking"
                  value={formData.bottomRanking}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  margin="normal"
                  fullWidth
                  label={t("coinGeckoID")}
                  name="coinGeckoID"
                  value={formData.coinGeckoID}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  margin="normal"
                  fullWidth
                  label={t("cgPrice")}
                  name="cgPrice"
                  value={formData.cgPrice}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  margin="normal"
                  fullWidth
                  label={t("potential")}
                  name="potential"
                  value={formData.potential}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  margin="normal"
                  fullWidth
                  label={t("sicherheit")}
                  name="sicherheit"
                  value={formData.sicherheit}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  margin="normal"
                  fullWidth
                  label="Image url"
                  name="cgImageURL"
                  value={formData.cgImageURL}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.risk === "risk"}
                      onChange={handleCheckboxChange}
                      sx={{
                        color: pink[800],
                        "&.Mui-checked": {
                          color: pink[600],
                        },
                      }}
                    />
                  }
                  label={t("risk")}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label" sx={{ color: "white" }}>
                {t("addCategory")}
              </InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value=""
                label={t("addCategory")}
                required
                onChange={handleAddCategory}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "& .MuiSvgIcon-root": { color: "white" },
                }}
              >
                <MenuItem value="AI">{t("ai")}</MenuItem>
                <MenuItem value="Web3/Anonymität">{t("web3")}</MenuItem>
                <MenuItem value="DeFi">{t("defi")}</MenuItem>
                <MenuItem value="Grüne Coins">{t("green")}</MenuItem>
                <MenuItem value="Gaming/Metaverse">{t("metaverse")}</MenuItem>
                <MenuItem value="BTC-Zusammenhang">{t("btc")}</MenuItem>
                <MenuItem value="CBDC-Netzwerke">{t("cbdc")}</MenuItem>
                <MenuItem value="eCommerce">{t("ecommerce")}</MenuItem>
                <MenuItem value="Tokenisierung/RWA">{t("nft")}</MenuItem>
                <MenuItem value="none">{t("none")}</MenuItem>
              </Select>
            </FormControl>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0.5,
                m: 0,
              }}
            >
              {formData.categories.map((category, index) => (
                <ListItem key={index}>
                  <Chip
                    label={category}
                    onDelete={handleDeleteCategory(category)}
                    sx={{
                      color: "white",
                      backgroundColor: categoryColors[category] || "default",
                      "& .MuiChip-deleteIcon": { color: "white" },
                    }}
                  />
                </ListItem>
              ))}
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("addAsset")}
            </Button>
          </Box>
        </Box>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={alertMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default AddAsset;
