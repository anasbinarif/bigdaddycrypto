"use client";
import { Box, TextField, Typography, Popper } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { getAssets } from "@/lib/data";
import Autocomplete from "@mui/material/Autocomplete";
import CoinCard from "../coinCard/CoinCard";
import "./stylesPopper.css";

const KryptoFilter = ({ userID, portfolio }) => {
  const [priceIndicator, setPriceIndicator] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [searchData, setSearchData] = useState([]);
  // console.log(portfolio);

  useEffect(() => {
    // console.log("hello bro whats up");
    setLoading(true);
    getAssets()
      .then((data) => {
        // console.log("tetsingwtfman", data);
        setData(data.data);
        setSearchData(data.data.slice(0, 5));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [userID]);

  const PopperMy = useCallback((props) => {
    const anchorEl = document.getElementById("filters");

    return (
      <Popper
        {...props}
        anchorEl={anchorEl}
        style={{
          width: anchorEl.clientWidth,
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
        sx={{
          "& > .MuiPaper-root": {
            backgroundColor: "#1d1d1d",
          },
        }}
        placement="bottom-end"
        // disablePortal
      />
    );
  }, []);

  const handleChange = (event) => {
    setPriceIndicator(event.target.value);
  };

  const searchCoin = (event, newValue) => {
    const filteredResults = data
      .filter((item) =>
        item.Name.toLowerCase().includes(newValue.toLowerCase())
      )
      .slice(0, 5);

    setSearchData(filteredResults);
  };

  const checkCoinSelected = (coin) => {
    if (!portfolio.assets) return false;
    return portfolio?.assets.some(
      (asset) => asset.CoinGeckoID === coin.CoinGeckoID
    );
  };

  // console.log(data);
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#202530",
        padding: "35px 30px",
        display: "flex",
        justifyContent: "space-between",
        borderRadius: "8px"
      }}
    >
      <Box sx={{ width: "70%" }}>
        <Typography variant="h6" component="div">
          Wähle deine Krypto-Assets
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          sx={{
            fontSize: "0.9rem",
            color: "#ffffff80",
            maxWidth: "70%",
            padding: "1rem 0",
          }}
        >
          Wähle deine gewünschten Krypto-Assets aus und füge sie durch
          Doppelklick in dein Portfolio ein.
        </Typography>
      </Box>
      <Box
        id="filters"
        sx={{
          display: "flex",
          alignSelf: "flex-start",
        }}
      >
        <TextField
          width={10}
          select
          value={priceIndicator}
          onChange={handleChange}
          SelectProps={{
            native: true,
          }}
          variant="outlined"
          sx={{
            marginRight: "2rem",

            "& .MuiOutlinedInput-root": {
              border: "1px solid #ffffff",
            },
            "& .MuiOutlinedInput-input": {
              padding: "0.5rem 1rem",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },

            "& .MuiNativeSelect-select": {
              fontSize: "0.8rem",
              color: "white",
              padding: "0.5rem 1rem",
              display: "flex",
            },

            "& .MuiNativeSelect-icon": {
              color: "#ffffff",
            },
          }}
          color="info"
        >
          <option value="">Kein Preis-Indikator anzeigen</option>
          <option value="pi0">Preis-Indikator: Extrem Pessimistisch</option>
          <option value="pi1">Preis-Indikator: Pessimistisch</option>
          <option value="pi2">Preis-Indikator: Optimistisch</option>
          <option value="pi3">Preis-Indikator: Spätseinsteiger</option>
          <option value="pi4">Preis-Indikator: Spätseinsteiger II</option>
        </TextField>
        <Autocomplete
          PopperComponent={PopperMy}
          id="country-select-demo"
          // fullWidth
          // autoHighlight
          onInputChange={searchCoin}
          disableClearable
          options={searchData}
          getOptionLabel={(option) => {
            if (option === undefined || option === null) {
              return "";
            }
            return option.Name;
          }}
          renderOption={(props, option) => {
            // console.log("Option object:", option);
            return (
              <CoinCard
                key={option.ID}
                coin={option}
                selected={checkCoinSelected(option)}
                search={true}
              />
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              // style={{ backgroundColor: "white" }}
              onFocus={(e) => e.target.select()} // mio onfocus
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password",
              }}
            />
          )}
          onClose={(event, reason) => {
            if (reason === "select-option" || reason === "blur") {
              return;
            }
            event.preventDefault();
          }}
          sx={{
            minWidth: "180px",
            alignSelf: "flex-start",
            "& .MuiFormControl-root": {
              wordWrap: "nowrap",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .MuiOutlinedInput-root.MuiInputBase-root": {
              border: "none",
              borderRadius: "4px",
              padding: "0",
            },
            "& .MuiOutlinedInput-root": {
              border: "1px solid #ffffff",
              padding: "0",
              color: "white",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #ffffff",
              padding: "0",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #ffffff",
            },
            "& .MuiOutlinedInput-root:selected .MuiOutlinedInput-notchedOutline":
              {
                border: "1px solid #ffffff",
              },
            "& .MuiFormLabel-root": {
              color: "#ffffff",
              fontSize: "0.8rem",
              padding: "0",
            },
          }}
        />
        {/* <Autocomplete
          id="free-solo-demo"
          options={searchData}
          // value={searchVal}
          // onChange={searchCoin}
          getOptionLabel={(option) => {
            if (option === undefined || option === null) {
              return "";
            }
            return option.Name;
          }}
          renderInput={(params) => <TextField {...params} label="" />}
          renderOption={(props, option) => {
            // console.log("Option object:", option);
            return (
              <CoinCard
                key={option.ID}
                coin={option}
                selected={checkCoinSelected(option)}
                search={true}
              />
            );
          }}
          sx={{
            minWidth: "180px",
            alignSelf: "flex-start",
            "& .MuiFormControl-root": {
              wordWrap: "nowrap",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .MuiOutlinedInput-root.MuiInputBase-root": {
              border: "none",
              borderRadius: "4px",
              padding: "0",
            },
            "& .MuiOutlinedInput-root": {
              border: "1px solid #ffffff",
              padding: "0",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #ffffff",
              padding: "0",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #ffffff",
            },
            "& .MuiOutlinedInput-root:selected .MuiOutlinedInput-notchedOutline":
              {
                border: "1px solid #ffffff",
              },
            "& .MuiFormLabel-root": {
              color: "#ffffff",
              fontSize: "0.8rem",
              padding: "0",
            },
          }}
        /> */}
      </Box>
    </Box>
  );
};

export default KryptoFilter;
