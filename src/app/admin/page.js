"use client";
import React, { useState } from "react";
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
} from "@mui/material";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const StyledTextField = (props) => {
  return (
    <TextField
      margin="normal"
      label={props.label}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
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
    category: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    // Post formData to your API or server
  };

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="md" sx={{ mt: 15, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add Asset
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <StyledTextField
            required
            fullWidth={true}
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoFocus
          />
          <StyledTextField
            required
            fullWidth
            label="Ticker"
            name="ticker"
            value={formData.ticker}
            onChange={handleChange}
          />
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
          <StyledTextField
            margin="normal"
            fullWidth
            label="Bottom Ranking"
            name="bottomRanking"
            value={formData.bottomRanking}
            onChange={handleChange}
            type="number"
          />
          <StyledTextField
            margin="normal"
            fullWidth
            label="CoinGecko ID"
            name="coinGeckoID"
            value={formData.coinGeckoID}
            onChange={handleChange}
          />
          <StyledTextField
            margin="normal"
            fullWidth
            label="cgPrice"
            name="cgPrice"
            value={formData.cgPrice}
            onChange={handleChange}
            type="number"
          />
          <StyledTextField
            margin="normal"
            fullWidth
            label="cgImageURL"
            name="cgImageURL"
            value={formData.cgImageURL}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Asset
          </Button>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default AdminPage;