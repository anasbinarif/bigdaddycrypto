"use client";
import {
  Box,
  TextField,
  Typography,
  Popper,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  withTheme,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { getAllAssets, getAssets } from "../../../../lib/data";
import Autocomplete from "@mui/material/Autocomplete";
import CoinCard from "../coinCard/CoinCard";
import "./stylesPopper.css";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai/index";
import { sessionAtom } from "../../../../app/stores/sessionStore";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { portfolioAtom } from "../../../../app/stores/portfolioStore";

const MenuProps = {
  PaperProps: {
    style: {
      backgroundColor: "#1d1d1d",
      color: "white",
    },
  },
};

const KryptoFilter = ({
  userID,
  priceIndicator,
  setPriceIndicator,
  setRerender,
}) => {
  const t = useTranslations("kryptoFilter");
  const [width, setWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [sessionJotai] = useAtom(sessionAtom);
  const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });
  const [searchData, setSearchData] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
    setLoading(true);
    getAllAssets()
      .then((data) => {
        // console.log(data);
        setData(data.data);
        // setSearchData(data.data.slice(0, 5));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [userID]);
  // console.log(searchData);

  // useEffect(() => {
  //   setLoading(true);
  //   getAllAssets()
  //     .then((data) => {
  //       setData(data.data);
  //       // setSearchData(data.data.slice(0, 5));
  //       // console.log("getAllAssets", data.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     });
  // }, [userID]);

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
            "& .MuiAutocomplete-noOptions": {
              color: "white",
            },
            "& > .MuiTypography-root": {
              color: "white",
            },
            backgroundColor: "#202530",
            filter: "brightness(0.8)",
          },
        }}
        placement="bottom-end"
      />
    );
  }, []);

  const handleChange = (event) => {
    if (sessionJotai?.user?.subscriptionPlan !== "Premium") {
      setAlertOpen(true);
      return;
    }
    setPriceIndicator(event.target.value);
  };

  const searchCoin = (event, newValue) => {
    if (!newValue) return;
    const filteredResults = data.length
      ? data
          .filter(
            (item) =>
              item?.Name?.toLowerCase().includes(newValue.toLowerCase()) ||
              item?.Ticker?.toLowerCase().includes(newValue.toLowerCase())
          )
          .slice(0, 5)
      : [];

    setSearchData(filteredResults);
  };

  const checkCoinSelected = (coin) => {
    if (!portfolio?.assets) return false;
    return portfolio?.assets.some(
      (asset) => asset.CoinGeckoID === coin.CoinGeckoID
    );
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#202530",
          padding: "0.5rem",
          // padding: isSmallScreen ? "20px 10px" : "35px 30px",
          display: "flex",
          flexDirection: width > 1100 ? "row" : "column",
          justifyContent: isSmallScreen ? "center" : "space-between",
          alignItems: isSmallScreen ? "center" : "flex-start",
          borderRadius: "8px",
          gap: isSmallScreen ? "20px" : "0",
        }}
      >
        <Box
          sx={{
            width: width < 1100 ? "100%" : "70%",
            textAlign: isSmallScreen ? "center" : "left",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", fontSize: "1.6rem" }}
          >
            {t("chooseAssets")}
          </Typography>
          {/* {(width > 1400 || width < 1100) && ( */}
          <Typography
            variant="body2"
            gutterBottom
            sx={{
              fontSize: "0.9rem",
              color: "#ffffff80",
              maxWidth: "100%",
              padding: "1rem 0 0 0",
            }}
          >
            {t("chooseAssetsDescription")}
          </Typography>
          {/* )} */}
        </Box>
        <Box
          id="filters"
          sx={{
            display: "flex",
            flexDirection:
              width > 1300
                ? "row"
                : width > 1100
                ? "column"
                : width > 500
                ? "row"
                : "column",
            alignItems: "center",
            justifyContent: width < 1100 ? "space-between" : "stretch",
            gap: isSmallScreen ? "16px" : "1rem",
            width: width < 1100 ? "100%" : "auto",
            "@media only screen and (max-width: 1100px)": {
              pt: "16px",
            },
            "*, *::after, *::before": {
              outline: "none",
              border: "none",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              // flexDirection: width < 1300 ? "column" : "row",
              "@media only screen and (max-width: 1100px)": {
                width: "100%",
              },
              alignItems: "center",
              position: "relative",
            }}
          >
            <Select
              inputProps={{ "aria-label": "Without label" }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={priceIndicator}
              // label="Price Indicator"
              onChange={handleChange}
              // variant="outlined"
              sx={{
                "*, *::after, *::before": {
                  outline: "none",
                  border: "none",
                },
                color: "white",
                fontSize: "0.8rem",
                border: "1px solid #ffffff80",
                "@media only screen and (max-width: 1100px)": {
                  width: "100%",
                },
                "&:hover": {
                  border: "1px solid #ffffff",
                },
                "&:focus": {
                  outline: "none",
                },
                // marginRight: isSmallScreen ? "0" : "2rem",
                "& .MuiPaper-rounded": {
                  backgroundColor: "#1d1d1d",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #ffffff80",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #ffffff80",
                },
                "& .MuiFormHelperText-root": {
                  color: "#ffffff",
                },
                "& .MuiFormLabel-root": {
                  color: "#ffffff",
                  "&.Mui-focused": {
                    color: "#ffffff",
                  },
                },
                "& .MuiOutlinedInput-root": {
                  "&:selected": {
                    border: "none",
                  },
                },
                "& .MuiSelect-select": {
                  padding: "9px 8px 9px 14px",
                  minHeight: 0,
                  // border: "1px solid white",

                  "& .MuiSelect-outlined": {
                    border: "1px solid red",
                  },
                  "&:focus": {
                    border: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                  },
                },
                "& .MuiSvgIcon-root": { color: "#ffffff" },
              }}
              MenuProps={MenuProps}
            >
              <MenuItem value="pi" sx={{ backgroundColor: "#1d1d1d" }}>
                {t("noPriceIndicator")}
              </MenuItem>
              <MenuItem value="pi0">{t("extremelyPessimistic")}</MenuItem>
              <MenuItem value="pi1">{t("pessimistic")}</MenuItem>
              <MenuItem value="pi2">{t("optimistic")}</MenuItem>
              <MenuItem value="pi3">{t("latecomer")}</MenuItem>
              <MenuItem value="pi4">{t("latecomerII")}</MenuItem>
            </Select>
            <FontAwesomeIcon
              icon={faCrown}
              style={{
                opacity: "0.5",
                fontSize: "0.9rem",
                marginRight: "0px",
                marginLeft: "12px",
                // position: "absolute",
                // top: "-50%",
                // right: "-15px",
              }}
              color={
                sessionJotai?.user?.subscriptionPlan &&
                sessionJotai?.user?.subscriptionPlan === "Premium"
                  ? "gold"
                  : "grey"
              }
            />
          </Box>
          <Autocomplete
            PopperComponent={PopperMy}
            id="country-select-demo"
            onInputChange={searchCoin}
            disableClearable
            options={searchData}
            getOptionLabel={(option) => {
              if (option === undefined || option === null) {
                return "";
              }

              return `${option.Name} ${option.Ticker}`;
            }}
            renderOption={(props, option) => {
              return (
                <CoinCard
                  key={option.ID}
                  coin={option}
                  selected={checkCoinSelected(option)}
                  search={true}
                  setRerender={setRerender}
                />
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                onFocus={(e) => e.target.select()}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password",
                }}
                // label={t("search")}
                placeholder={t("search")}
              />
            )}
            onClose={(event, reason) => {
              if (reason === "select-option" || reason === "blur") {
                return;
              }
              // event.preventDefault();
            }}
            sx={{
              "*, *::after, *::before": {
                outline: "none",
                border: "none",
              },
              width: "100%",
              color: "white",
              "@media only screen and (min-width:1100px)": {
                minWidth: "180px",
              },
              alignSelf: isSmallScreen ? "stretch" : "flex-start",
              "&.Mui-focused .MuiFormControl-root .MuiInputBase-root MuiInputBase-input":
                {
                  border: "1px solid #ffffff20",
                },
              "& .MuiOutlinedInput-root.MuiInputBase-root": {
                border: "1px solid #ffffff80",
                borderRadius: "4px",
                padding: "0",
                color: "white",
              },
              "& .MuiInputBase-input.MuiOutlinedInput-input::placeholder": {
                fontSize: "0.9rem",
                color: "white",
                opacity: 1,
              },
              "& .MuiFormLabel-root": {
                fontSize: "0.9rem",
                color: "white",
                top: "-15%",
              },
              "& .MuiSvgIcon-root": {
                color: "#ffffff",
                paddingRight: 0,
              },
            }}
          />
        </Box>
      </Box>
      {/* {width < 1400 && width > 1100 && (
        <Typography
          variant="body2"
          gutterBottom
          sx={{
            fontSize: "0.9rem",
            color: "#ffffff80",
            maxWidth: "100%",
            padding: "4px 6px ",
          }}
        >
          {t("chooseAssetsDescription")}
        </Typography>
      )} */}
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
          {t("alert")}
        </Alert>
      </Snackbar>
    </>
  );
};

export default KryptoFilter;
