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
} from "@mui/material";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import getCoins from "./coins.js";

const StyledTextField = (props) => {
  return (
    <TextField
      // margin="normal"
      // label={props.label}
      // name={props.name}
      // value={props.value}
      // onChange={props.onChange}
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
  const [data, setData] = useState([
    // { id: "01coin", symbol: "zoc", name: "01coin" },
    // { id: "0chain", symbol: "zcn", name: "Zus" },
    // { id: "0-knowledge-network", symbol: "0kn", name: "0 Knowledge Network" },
    // { id: "0-mee", symbol: "ome", name: "O-MEE" },
    // { id: "0vix-protocol", symbol: "vix", name: "0VIX Protocol" },
    // { id: "0vm", symbol: "zerovm", name: "0VM" },
    // { id: "0x", symbol: "zrx", name: "0x Protocol" },
    // {
    //   id: "0x0-ai-ai-smart-contract",
    //   symbol: "0x0",
    //   name: "0x0.ai: AI Smart Contract",
    // },
    // {
    //   id: "0x1-tools-ai-multi-tool",
    //   symbol: "0x1",
    //   name: "0x1.tools: AI Multi-tool",
    // },
    // { id: "0xaiswap", symbol: "0xaiswap", name: "0xAISwap" },
    // { id: "0xanon", symbol: "0xanon", name: "0xAnon" },
    // { id: "0xblack", symbol: "0xb", name: "0xBlack" },
    // { id: "0xcoco", symbol: "coco", name: "0xCoco" },
    // { id: "0xconnect", symbol: "0xcon", name: "0xConnect" },
    // { id: "0xdao", symbol: "oxd", name: "0xDAO" },
    // { id: "0xdefcafe", symbol: "cafe", name: "0xDEFCAFE" },
    // { id: "0xengage", symbol: "engage", name: "0xEngage" },
    // { id: "0xfreelance", symbol: "0xfree", name: "0xFreelance" },
    // { id: "0xfriend", symbol: "0xf", name: "0xFriend" },
    // { id: "0xgambit", symbol: "0xg", name: "0xgambit" },
    // { id: "0xgasless", symbol: "0xgas", name: "0xGasless (OLD)" },
    // { id: "0xgasless-2", symbol: "0xgas", name: "0xGasless" },
    // { id: "0x-leverage", symbol: "oxl", name: "0x Leverage" },
    // { id: "0xlsd", symbol: "0xlsd", name: "0xLSD" },
    // { id: "0xmonero", symbol: "0xmr", name: "0xMonero" },
    // { id: "0xnude", symbol: "nude", name: "0xNude" },
    // { id: "0xnumber", symbol: "oxn", name: "0xNumber" },
    // { id: "0xos-ai", symbol: "0xos", name: "0xOS AI" },
    // { id: "0xs", symbol: "$0xs", name: "0xS" },
    // { id: "0xscans", symbol: "scan", name: "0xScans" },
    // { id: "0xsnipeproai", symbol: "0xspai", name: "0xSnipeProAi" },
    // { id: "0xtools", symbol: "0xt", name: "0xTools" },
    // { id: "0xvault", symbol: "vault", name: "0xVault" },
    // { id: "1000bonk", symbol: "1000bonk", name: "1000BONK" },
    // { id: "1000btt", symbol: "1000btt", name: "1000BTT" },
    // { id: "1000rats", symbol: "1000rats", name: "1000RATS" },
    // {
    //   id: "1000sats-ordinals",
    //   symbol: "1000sats",
    //   name: "1000SATS (Ordinals)",
    // },
    // { id: "1000shib", symbol: "1000shib", name: "1000SHIB" },
    // { id: "1000troll", symbol: "1000troll", name: "1000TROLL" },
    // { id: "12ships", symbol: "tshp", name: "12Ships" },
    // { id: "16dao", symbol: "16dao", name: "16DAO" },
    // { id: "biis-ordinals", symbol: "biis", name: "Biis (Ordinals)" },
    // { id: "bikerush", symbol: "brt", name: "Bikerush" },
    // { id: "bilira", symbol: "tryb", name: "BiLira" },
    // { id: "billiard-crypto", symbol: "bic", name: "Billiard Crypto" },
    // { id: "billicat", symbol: "bcat", name: "BilliCat" },
    // {
    //   id: "billionaires-pixel-club",
    //   symbol: "bpc",
    //   name: "Billionaires Pixel Club",
    // },
    // { id: "billionhappiness", symbol: "bhc", name: "BillionHappiness" },
    // { id: "billionview", symbol: "bvt", name: "Billionview" },
    // { id: "billy-token", symbol: "billy", name: "Billy Token" },
    // { id: "bim", symbol: "bim", name: "BIM" },
    // { id: "bimbo-the-dog", symbol: "bimbo", name: "Bimbo The Dog" },
    // { id: "binamon", symbol: "bmon", name: "Binamon" },
    // { id: "binance-bitcoin", symbol: "btcb", name: "Binance Bitcoin" },
    // {
    //   id: "binance-bridged-usdt-bnb-smart-chain",
    //   symbol: "bsc-usd",
    //   name: "Binance Bridged USDT (BNB Smart Chain)",
    // },
    // { id: "binancecoin", symbol: "bnb", name: "BNB" },
    // {
    //   id: "binance-coin-wormhole",
    //   symbol: "bnb",
    //   name: "Binance Coin (Wormhole)",
    // },
    // { id: "binance-eth", symbol: "beth", name: "Binance ETH staking" },
    // { id: "binanceidr", symbol: "bidr", name: "BIDR" },
    // {
    //   id: "binance-peg-avalanche",
    //   symbol: "avax",
    //   name: "Binance-Peg Avalanche",
    // },
    // {
    //   id: "binance-peg-bitcoin-cash",
    //   symbol: "bch",
    //   name: "Binance-Peg Bitcoin Cash",
    // },
    // { id: "binance-peg-busd", symbol: "busd", name: "Binance-Peg BUSD" },
    // { id: "binance-peg-cardano", symbol: "ada", name: "Binance-Peg Cardano" },
  ]);
  const [searchData, setSearchData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const coins = getCoins();
        // console.log(coins);
        setData(coins);
        setSearchData(coins.slice(0, 5));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
    // setSearchData(data.slice(0, 5));
  }, []);
  // console.log(searchData);

  const searchCoin = (event) => {
    setSearch(event.target.value);
    // console.log(event.target.value);
    const newSearchData = data
      .filter((data) => data.name.includes(event.target.value))
      .slice(0, 5);
    // console.log(newSearchData);
    setSearchData(newSearchData);
  };

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
      <Container
        component="main"
        maxWidth="md"
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
                    <TableRow key={index} onClick>
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
          <Typography variant="h6" gutterBottom>
            Add Asset
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <StyledTextField
              margin="normal"
              required
              fullWidth={true}
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoFocus
            />
            <StyledTextField
              margin="normal"
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
              <InputLabel id="category-label" sx={{ color: "white" }}>
                Category
              </InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleChange}
                sx={{
                  color: "white",
                  border: "none",

                  "& .MuiSelect-select": {
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

                  "& .MuiSvgIcon-root": { color: "#ffffff" },
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
