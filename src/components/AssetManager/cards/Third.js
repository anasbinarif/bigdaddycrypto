"use client";
import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { faCrown, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai/index";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { portfolioAtom } from "../../../../src/app/stores/portfolioStore";
import {
  convertPrice,
  currencySign,
  getCurrencyAndRates,
} from "../../../lib/data";
import { useSearchParams } from "next/navigation";
import addCommas from "../../../lib/currencyFormatter";
import maxLenCrop from "../../../lib/checkString";

const Third = () => {
  const t = useTranslations("third");
  const [portfolio] = useAtom(portfolioAtom, { assets: [] });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const totalInvestment = portfolio.assetsCalculations.assets
    .reduce((acc, curr) => acc + curr.totalInvest, 0)
    .toFixed(2);
  const totalGesamtwert = portfolio.assetsCalculations.assets
    .reduce((acc, curr) => acc + curr.Holdings, 0)
    .toFixed(2);
  const aktuellerProfit = (totalGesamtwert - totalInvestment).toFixed(2);
  const gesamtwertPercentage = (
    (aktuellerProfit / totalInvestment) *
    100
  ).toFixed(2);
  const [currency, setCurrency] = useState("EUR");
  const [rates, setRates] = useState(null);
  const searchParams = useSearchParams();
  const currentCurrency = searchParams.get("currency") || "EUR";

  useEffect(() => {
    const fetchCurrencyAndRates = async () => {
      const { rates } = await getCurrencyAndRates();
      setCurrency(currentCurrency);
      setRates(rates);
    };
    fetchCurrencyAndRates();
  }, [currentCurrency]);

  return (
    <Box
      sx={{
        backgroundColor: "#202530",
        color: "white",
        height: "100%",
        borderRadius: "8px",
        padding: isSmallScreen ? "15px" : "25px",
      }}
    >
      <Box
        sx={{ fontSize: isSmallScreen ? "100%" : "120%", fontWeight: "bold" }}
      >
        {t("portfolioOverview")}
        <FontAwesomeIcon
          icon={faCrown}
          style={{ paddingLeft: "10px", opacity: "0.25", fontSize: "0.9rem" }}
        />
      </Box>
      <Divider sx={{ marginY: isSmallScreen ? "10px" : "15px" }} />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#00000033",
          padding: isSmallScreen ? "0.5rem" : "1rem",
          marginTop: "1rem",
        }}
      >
        <Typography sx={{ fontSize: isSmallScreen ? "0.8rem" : "0.9rem" }}>
          {t("totalValue")}
        </Typography>
        <Typography
          sx={{
            position: "relative",
            fontSize: isSmallScreen ? "1.5rem" : "2rem",
            fontWeight: "bold",

            "& > div": {
              display: "none",
            },

            "&:hover > div": {
              display: "block",
            },
          }}
        >
          {maxLenCrop(
            addCommas(convertPrice(totalGesamtwert, currency, rates))
          )}{" "}
          {currencySign[currency]}
          {addCommas(convertPrice(totalGesamtwert, currency, rates)).length >
            12 && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                backgroundColor: "#818181ef",
                borderRadius: "4px",
                padding: "2px",
                fontSize: "14px",
              }}
            >
              {addCommas(convertPrice(totalGesamtwert, currency, rates))}
            </div>
          )}
        </Typography>
        <Typography
          className={gesamtwertPercentage < 0 ? "down" : "up"}
          sx={{
            "&.down": {
              color: "red",
            },
            "&.up": {
              color: "green",
            },
            "&.down:before": {
              content: '"▼ "',
              fontSize: "80%",
              marginRight: "3px",
            },
            "&.up:before": {
              content: '"▲ "',
              fontSize: "80%",
              marginRight: "3px",
            },
          }}
        >
          {isNaN(gesamtwertPercentage) ? 0 : gesamtwertPercentage}%
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#00000033",
          padding: isSmallScreen ? "0.5rem" : "1rem",
          marginTop: "1rem",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: isSmallScreen ? "0.8rem" : "0.9rem",
              opacity: "0.5",
            }}
          >
            {t("totalInvestment")}
          </Typography>
          <Typography
            sx={{
              fontSize: isSmallScreen ? "0.8rem" : "0.9rem",
              fontWeight: "bold",
            }}
          >
            {addCommas(convertPrice(totalInvestment, currency, rates))}{" "}
            {currencySign[currency]}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: isSmallScreen ? "0.8rem" : "0.9rem",
              opacity: "0.5",
            }}
          >
            {t("currentProfit")}
          </Typography>
          <Typography
            sx={{
              fontSize: isSmallScreen ? "0.8rem" : "0.9rem",
              fontWeight: "bold",
            }}
          >
            {addCommas(convertPrice(aktuellerProfit, currency, rates))}{" "}
            {currencySign[currency]}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: isSmallScreen ? "0.8rem" : "0.9rem",
              opacity: "0.5",
            }}
          >
            {t("realizedSoFar")}
          </Typography>
          <Typography
            sx={{
              fontSize: isSmallScreen ? "0.8rem" : "0.9rem",
              fontWeight: "bold",
            }}
          >
            0,00 {currencySign[currency]}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: isSmallScreen ? "0.8rem" : "0.9rem",
              opacity: "0.5",
            }}
          >
            {t("totalPotential")}
            <FontAwesomeIcon
              icon={faQuestionCircle}
              style={{ opacity: "0.5", marginLeft: "0.5rem" }}
            />
          </Typography>
          <Typography
            sx={{
              fontSize: isSmallScreen ? "0.8rem" : "0.9rem",
              fontWeight: "bold",
            }}
          >
            0,00 {currencySign[currency]}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Third;
