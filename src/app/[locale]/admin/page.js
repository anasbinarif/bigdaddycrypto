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
  Paper, Avatar, Grid,
} from "@mui/material";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import getCoins from "./coins.js";
import { styled } from '@mui/material/styles';
import { categoryColors } from "../../../lib/data";
import Image from "next/image";

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

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const AdminPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    bottom: "",
    bottomRanking: "",
    coinGeckoID: "",
    cgPrice: "",
    cgImageURL: "",
    risk: false,
    potential: "",
    sicherheit: "",
    categories: [], // Change from 'category' to 'categories'
  });
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const coins = getCoins();
        setData(coins);
        setSearchData(coins.slice(0, 100));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  const searchCoin = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearch(searchText);
    const newSearchData = data
      .filter((coin) => coin.name.toLowerCase().includes(searchText))
      .slice(0, 100);
    setSearchData(newSearchData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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

  const handleCoinClicked = async (row) => {
    console.log("row", row);
    setFormData((prevState) => ({
      ...prevState,
      name: row.name,
      ticker: row.symbol.toUpperCase(),
      coinGeckoID: row.id,
    }));
    try {
      const response = await fetch(`/api/getAssetDetailFromCoingecko?id=${row.id}`);
      if (response.ok) {
        const assetDetails = await response.json();
        console.log("Asset details:", assetDetails);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    // Post formData to your API or server
  };

  return (
    <>
      <Navbar />
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          mt: 15,
          mb: 4,
          display: "flex",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#202530",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            alignSelf: "flex-start",
            marginRight: "2rem",
            width: "50%",
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
              1. Suche Name oder Ticker:
            </Typography>
            <StyledTextField
              margin="normal"
              fullWidth
              label="Suche"
              name="Suche"
              value={search}
              onChange={searchCoin}
              autoFocus
            />
          </Box>
          <Box sx={{ mt: "1rem" }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              2. Wähle das Asset aus:
            </Typography>
            <TableContainer
              sx={{
                backgroundColor: "#ffffff08",
                maxHeight: "400px", // Set max height for scrolling
                overflowY: "auto", // Enable scrolling
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
                    <TableCell>CoinGecko-ID</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchData.map((row, index) => (
                    <TableRow key={index} onClick={() => handleCoinClicked(row)} sx={{ cursor: "pointer" }} >
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
            width: "50%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" gutterBottom>
              Add Asset
            </Typography>
            {formData.cgImageURL && <Avatar
              src={formData.cgImageURL}
              sx={{ width: 50, height: 50 }}
            />}</Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 5 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoFocus
                />
              </Grid>
              <Grid item xs={6}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  label="Ticker"
                  name="ticker"
                  value={formData.ticker}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  label="Bottom"
                  name="bottom"
                  value={formData.bottom}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <StyledTextField
                  margin="normal"
                  fullWidth
                  label="Bottom Ranking"
                  name="bottomRanking"
                  value={formData.bottomRanking}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <StyledTextField
                  margin="normal"
                  fullWidth
                  label="CoinGecko ID"
                  name="coinGeckoID"
                  value={formData.coinGeckoID}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledTextField
                  margin="normal"
                  fullWidth
                  label="cgPrice"
                  name="cgPrice"
                  value={formData.cgPrice}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>
            </Grid>
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label" sx={{ color: "white" }}>
                Add Category
              </InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value=""
                label="Add Category"
                onChange={handleAddCategory}
                sx={{
                  color: "white",
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  '& .MuiSvgIcon-root': { color: 'white' },
                }}
              >
                <MenuItem value="AI">AI</MenuItem>
                <MenuItem value="Web3/Anonymität">Web3/Anonymität</MenuItem>
                <MenuItem value="DeFi">DeFi</MenuItem>
                <MenuItem value="Grüne Coins">Grüne Coins</MenuItem>
                <MenuItem value="Gaming/Metaverse">Gaming/Metaverse</MenuItem>
                <MenuItem value="BTC-Zusammenhang">BTC-Zusammenhang</MenuItem>
                <MenuItem value="CBDC-Netzwerke">CBDC-Netzwerke</MenuItem>
                <MenuItem value="eCommerce">eCommerce</MenuItem>
                <MenuItem value="Tokenisierung/RWA">Tokenisierung/RWA</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 0.5, m: 0 }}>
              {formData.categories.map((category, index) => (
                <ListItem key={index}>
                  <Chip
                    label={category}
                    onDelete={handleDeleteCategory(category)}
                    sx={{
                      color: 'white',
                      backgroundColor: categoryColors[category] || 'default',
                      '& .MuiChip-deleteIcon': { color: 'white' }
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
              Add Asset
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default AdminPage;
