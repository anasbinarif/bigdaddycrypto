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
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import {getAllAssets, getAssets} from "../../../../lib/data";
import Autocomplete from "@mui/material/Autocomplete";
import CoinCard from "../coinCard/CoinCard";
import "./stylesPopper.css";
import { useTranslations } from "next-intl";

const MenuProps = {
    PaperProps: {
        style: {
            backgroundColor: "#1d1d1d",
            color: "white",
        },
    },
};

const KryptoFilter = ({ userID, portfolio }) => {
    const t = useTranslations("kryptoFilter");
    const [priceIndicator, setPriceIndicator] = useState(t("noPriceIndicator"));
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [searchData, setSearchData] = useState([]);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        setLoading(true);
        getAllAssets()
            .then((data) => {
                setData(data.data);
                setSearchData(data.data.slice(0, 5));
                console.log("getAllAssets", data.data)
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
            />
        );
    }, []);

    const handleChange = (event) => {
        setPriceIndicator(event.target.value);
    };

    const searchCoin = (event, newValue) => {
        const filteredResults = data.length ? data
            .filter((item) =>
                item?.Name?.toLowerCase().includes(newValue.toLowerCase())
            )
            .slice(0, 5) : [];

        setSearchData(filteredResults);
    };

    const checkCoinSelected = (coin) => {
        if (!portfolio.assets) return false;
        return portfolio?.assets.some(
            (asset) => asset.CoinGeckoID === coin.CoinGeckoID
        );
    };

    return (
        <Box
            sx={{
                width: "100%",
                bgcolor: "#202530",
                padding: isSmallScreen ? "20px 10px" : "35px 30px",
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                justifyContent: isSmallScreen ? "center" : "space-between",
                alignItems: isSmallScreen ? "center" : "flex-start",
                borderRadius: "8px",
                gap: isSmallScreen ? "20px" : "0",
            }}
        >
            <Box sx={{ width: isSmallScreen ? "100%" : "70%", textAlign: isSmallScreen ? "center" : "left" }}>
                <Typography variant="h6" component="div">
                    {t("chooseAssets")}
                </Typography>
                <Typography
                    variant="body2"
                    gutterBottom
                    sx={{
                        fontSize: "0.9rem",
                        color: "#ffffff80",
                        maxWidth: isSmallScreen ? "100%" : "70%",
                        padding: "1rem 0",
                    }}
                >
                    {t("chooseAssetsDescription")}
                </Typography>
            </Box>
            <Box
                id="filters"
                sx={{
                    display: "flex",
                    flexDirection: isSmallScreen ? "column" : "row",
                    alignItems: "center",
                    gap: isSmallScreen ? "10px" : "2rem",
                    width: isSmallScreen ? "100%" : "auto",
                }}
            >
                <Select
                    inputProps={{ "aria-label": "Without label" }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={priceIndicator}
                    label="Price Indicator"
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                        color: "white",
                        fontSize: "0.8rem",
                        border: "none",
                        marginRight: isSmallScreen ? "0" : "2rem",
                        "& .MuiPaper-rounded": {
                            backgroundColor: "#1d1d1d",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid #ffffff20",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid #ffffff20",
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
                        "& .MuiInputBase-root": {},
                        "& .MuiSelect-select": {
                            padding: "5px",
                            "&:focus-visible": {
                                outline: "none",
                            },
                        },
                        "& .MuiSvgIcon-root": { color: "#ffffff" },
                    }}
                    MenuProps={MenuProps}
                >
                    <MenuItem
                        value={t("noPriceIndicator")}
                        sx={{ backgroundColor: "#1d1d1d" }}
                    >
                        {t("noPriceIndicator")}
                    </MenuItem>
                    <MenuItem value={t("extremelyPessimistic")}>
                        {t("extremelyPessimistic")}
                    </MenuItem>
                    <MenuItem value={t("pessimistic")}>{t("pessimistic")}</MenuItem>
                    <MenuItem value={t("optimistic")}>{t("optimistic")}</MenuItem>
                    <MenuItem value={t("latecomer")}>{t("latecomer")}</MenuItem>
                    <MenuItem value={t("latecomerII")}>{t("latecomerII")}</MenuItem>
                </Select>
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
                        return option.Name;
                    }}
                    renderOption={(props, option) => {
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
                            onFocus={(e) => e.target.select()}
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
                        alignSelf: isSmallScreen ? "stretch" : "flex-start",
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid #ffffff20",
                        },
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
                            "&:selected": {
                                border: "none",
                            },
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
                            "&.Mui-focused": {
                                border: "1px solid #ffffff",
                                color: "#ffffff",
                            },
                        },
                        "& .MuiSvgIcon-root": {
                            color: "#ffffff",
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default KryptoFilter;
