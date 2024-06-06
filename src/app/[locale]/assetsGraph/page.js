"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Slider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import Image from "next/image";
import Graph from "../../../../public/assets/svg/BDC-Graph.svg";
import { getAssetTest } from "../../../lib/data";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import { symbol } from "prop-types";

const reverseMapping = {
  ai: "AI",
  web3: "Web3/Anonymität",
  defi: "DeFi",
  green: "Grüne Coins",
  metaverse: "Gaming/Metaverse",
  btc: "BTC-Zusammenhang",
  cbdc: "CBDC-Netzwerke",
  ecommerce: "ECommerce",
  nft: "Tokenisierung/RWA",
  none: "Kein Hype-Thema",
};

const Testing = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState({
    visible: false,
    data: {},
    x: 0,
    y: 0,
  });
  const [symbolSize, setSymbolSize] = useState(35);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState({
    ai: true,
    web3: true,
    defi: true,
    green: true,
    metaverse: true,
    btc: true,
    cbdc: true,
    ecommerce: true,
    nft: true,
    none: true,
  });

  function areAllTrue(obj) {
    return Object.values(obj).every((value) => value === true);
  }

  useEffect(() => {
    getAssetTest()
      .then((data) => {
        setAssets(data);
      })
      .catch((error) => {
        console.log("error.message", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log("graph data:", assets);
  }, [assets]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltip.visible) {
        setTooltip({ visible: false, data: {}, x: 0, y: 0 });
      }
    };

    if (tooltip.visible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [tooltip.visible]);

  const calculatePosition = (value, offset) => {
    return `calc(${(100 / 12) * 1 + (100 / 12) * value}% - ${offset}px)`;
  };

  const handleCoinClick = (event, asset) => {
    event.stopPropagation(); // Prevent triggering the document click event
    const assetX = calculatePosition(asset.Potential, symbolSize / 2);
    const assetY = `calc(100% - ${calculatePosition(
      asset.Sicherheit,
      symbolSize / 2
    )})`;
    setTooltip({
      visible: true,
      data: asset,
      x: assetX,
      y: assetY,
    });
  };
  // console.log(selectedItem);

  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        if (areAllTrue(selectedItem)) return asset;

        if (asset?.Category.some((cat) => selectedItem[cat])) return asset;
      })
      .map((asset) => {
        const filter =
          asset?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset?.Ticker?.toLowerCase().includes(searchTerm.toLowerCase());

        if (!asset.Name) return <></>;
        return (
          <Box
            className="coinBtn"
            data-sicherheit={asset.Sicherheit}
            data-potential={asset.Potential}
            data-filter={filter}
            key={asset._id}
            component="div"
            sx={{
              position: "absolute",
              left: calculatePosition(asset.Potential, symbolSize / 10),
              top: `calc(100% - ${calculatePosition(
                asset.Sicherheit,
                symbolSize / 10
              )})`,
              opacity: filter ? "1" : "0.3",
              zIndex: filter ? "1000" : "500",
              transform: "translate(-50%, -50%)",
              transition: "all 0.3s ease-in-out",
              cursor: "pointer",
              background: "#fff",
              display: "flex",
              boxShadow: "3px 3px 12px rgba(0, 0, 0, .1)",
              borderRadius: "100px",
              padding: "2px",
              "&:hover": {
                transform: "scale(1.5) translate(-50%, -50%)",
                zIndex: "21000",
              },
            }}
            onMouseEnter={(event) => handleCoinClick(event, asset)}
          >
            <Image
              src={asset.cgImageURL}
              alt={asset.Name}
              width={filter ? symbolSize : symbolSize * 0.8}
              height={filter ? symbolSize : symbolSize * 0.8}
              style={{
                borderRadius: "50%",
                boxShadow: "3px 3px 12px rgba(0,0,0,.1)",
              }}
            />
          </Box>
        );
      });
  }, [assets, selectedItem, searchTerm]);
  // console.log(filteredAssets);

  useEffect(() => {
    const coins = document.querySelectorAll(".coinBtn");
    // console.log(coins);

    if (coins) {
      coins.forEach((button) => {
        const sicherheit = button.getAttribute("data-sicherheit");
        const potential = button.getAttribute("data-potential");

        button.style.left = calculatePosition(potential, symbolSize / 10);
        button.style.top = `calc(100% - ${calculatePosition(
          sicherheit,
          symbolSize / 10
        )})`;

        const image = button.querySelector("img");
        if (image) {
          image.style.width = `${symbolSize}px`;
          image.style.height = `${symbolSize}px`;
        }
      });
    }
  }, [symbolSize]);

  const handleCheckboxChange = (event) => {
    setSelectedItem(
      event.target.name === "all"
        ? {
            ai: true,
            web3: true,
            defi: true,
            green: true,
            metaverse: true,
            btc: true,
            cbdc: true,
            ecommerce: true,
            nft: true,
            none: true,
          }
        : {
            ...selectedItem,
            [event.target.name]: event.target.checked,
          }
    );
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          backgroundColor: "#111826",
          color: "#fff",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginTop: "8%",
        }}
      >
        <Box
          sx={{
            mx: 1,
            width: "20%",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: "#202530",
            border: "none",
            borderRadius: "5px",
            padding: "10px 10px",
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              color: "#aaa",
              whiteSpace: "nowrap",
            }}
          >
            Symbol Size:
          </Typography>
          <Slider
            defaultValue={symbolSize}
            min={20}
            max={50}
            aria-label="Default"
            valueLabelDisplay="auto"
            onChange={(e, newValue) => setSymbolSize(newValue)}
            sx={{
              color: "var(--color-secondary)",
            }}
          />
        </Box>
        <Box sx={{ width: "20%" }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: "#202530",
              borderRadius: "5px",
              border: "none",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ffffff",
                },
                "&:hover fieldset": {
                  borderColor: "#ffffff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ffffff",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#ffffff",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#ffffff",
              },
              "& .MuiInputBase-input": {
                color: "#ffffff",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ffffff",
              },
            }}
          />
        </Box>
        <FormControl
          sx={{
            m: 1,
            backgroundColor: "#202530",
            width: "20%",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ffffff",
              },
              "&:hover fieldset": {
                borderColor: "#ffffff",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#ffffff",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#ffffff",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#ffffff",
            },
            "& .MuiSelect-icon": {
              color: "#ffffff",
            },
            "& .MuiSelect-select": {
              color: "#ffffff",
            },
          }}
        >
          <InputLabel id="demo-simple-select-label">All Categories</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="All Categories"
            // onChange={(e) => setSelectedItem(e.target.value)}
          >
            <MenuItem value="">
              <Checkbox
                checked={areAllTrue(selectedItem)}
                onChange={handleCheckboxChange}
                name="all"
              />
              All Categories
            </MenuItem>
            {Object.entries(reverseMapping).map(([key, value]) => (
              <MenuItem>
                <Checkbox
                  checked={selectedItem[key]}
                  onChange={handleCheckboxChange}
                  name={key}
                />
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          position: "relative",
          // maxWidth: "100%",
          maxWidth: "1200px",
          height: "1200px",
          marginTop: "1rem",
          backgroundColor: "#111826",
          overflow: "hidden",
          padding: "0px",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Image src={Graph} layout="fill" objectFit="cover" alt="Background" />
          {filteredAssets}
        </Box>
        {tooltip.visible && (
          <Box
            sx={{
              position: "absolute",
              top: `calc(${tooltip.y} + 10px)`,
              left: `calc(${tooltip.x} + 10px)`,
              backgroundColor: "#fff",
              color: "#000",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
              pointerEvents: "none",
              width: "200px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#000",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                fontSize: "14px",
              }}
            >
              {tooltip.data.Name} ({tooltip.data.Ticker})
            </Typography>
            <Typography sx={{ color: "gray", marginTop: "5px" }}>
              Hype Topic:
            </Typography>
            <Typography sx={{ color: "#000", marginBottom: "8px" }}>
              {reverseMapping[tooltip.data.Category[0]] || "No hype topic"}
            </Typography>
            <Typography sx={{ color: "gray" }}>Evaluation:</Typography>
            <Typography
              sx={{ color: "#000", whiteSpace: "nowrap", fontSize: "12px" }}
            >
              Safety: <b>{tooltip.data.Sicherheit.toFixed(1)}</b>, Potential:{" "}
              <b>{tooltip.data.Potential.toFixed(1)}</b>
            </Typography>
          </Box>
        )}
      </Box>
      <Footer />
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

export default Testing;
