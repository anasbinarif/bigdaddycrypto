import { Avatar, Box, Typography } from "@mui/material";
import styles from "./coinDetails.module.css";
import { convertPrice, currencySign } from "../../../../lib/data";
import { useTranslations } from "next-intl";

function addCommas(number) {
  let numberString = number.toString();

  let parts = numberString.split(".");

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  let tempStr = parts.join(".").replace(/[.,]/g, function (match) {
    return match === "," ? "." : ",";
  });

  return tempStr;
}

const CoinDetailsDisplay = ({
  financialSummary,
  coin,
  width,
  currency,
  rates,
}) => {
  const t = useTranslations("coinDetails");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: width < 1200 ? "column" : "row",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignSelf: "flex-start",
          width: "25%",
          marginRight: "1.5rem",
          mb: width < 1200 ? "2rem" : 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            pl: 1,
            mr: 2,
          }}
        >
          <Avatar
            src={coin?.cgImageURL}
            sx={{
              width: 50,
              height: 50,
              marginRight: 1,
              alignSelf: "flex-start",
            }}
          />
        </Box>
        <Box sx={{ alignSelf: "center" }}>
          <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
            {coin?.Ticker}
          </Typography>
          <Typography noWrap>{coin?.CoinGeckoID}</Typography>
          <Typography>
            {addCommas(convertPrice(coin?.Price.toFixed(2), currency, rates))}{" "}
            {currencySign[currency]}
          </Typography>
        </Box>
      </Box>
      <Box className={styles.grid}>
        <Box className={styles.grid__item}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            {t("duration")}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "1.5rem",
              },
            }}
          >
            {addCommas(
              convertPrice(financialSummary.totalHoldingsValue, currency, rates)
            )}{" "}
            {currencySign[currency]}
          </Typography>
          <Typography
            sx={{
              color: "#ffffff88",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            {financialSummary.totalCoins} {coin?.Ticker}
          </Typography>
        </Box>
        <Box className={styles.grid__item}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            {t("totalInvestment")}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "1.5rem",
              },
            }}
          >
            {addCommas(
              convertPrice(financialSummary.totalInvested, currency, rates)
            )}{" "}
            {currencySign[currency]}
          </Typography>
          <Typography
            sx={{
              color: "#ffffff88",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            Geplant: 0,00 {currencySign[currency]}
          </Typography>
        </Box>
        <Box className={styles.grid__item}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            {t("totalWinLoss")}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "1.5rem",
              },
            }}
          >
            {addCommas(
              convertPrice(financialSummary.totalWinLoss, currency, rates)
            )}{" "}
            {currencySign[currency]}
          </Typography>
          <Typography
            className={
              financialSummary.avgPurchasePricePercentage < 0 ? "down" : "up"
            }
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
              "@media only screen and (max-width: 1500px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            {financialSummary.totalWinLossPercentage} %
          </Typography>
        </Box>
        <Box className={styles.grid__item}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            {t("avgPurchasePrice")}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: `${
                financialSummary.avgPurchasePrice > 0 ? "" : "rgb(68, 68, 68)"
              }`,
              whiteSpace: "nowrap",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "1.5rem",
              },
            }}
          >
            {financialSummary.avgPurchasePrice > 0
              ? `${addCommas(
                  convertPrice(
                    financialSummary.avgPurchasePrice,
                    currency,
                    rates
                  )
                )} ${currencySign[currency]}`
              : `--,-- ${currencySign[currency]}`}
          </Typography>
          <Typography
            className={
              financialSummary.avgPurchasePricePercentage < 0 ? "down" : "up"
            }
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

              "@media only screen and (max-width: 1500px)": {
                fontSize: "0.9rem",
              },
            }}
          >
            {financialSummary.avgPurchasePricePercentage} %
          </Typography>
        </Box>
        <Box className={styles.grid__item}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            {t("avgSellingPrice")}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: `${
                financialSummary.avgSellingPrice > 0 ? "" : "rgb(68, 68, 68)"
              }`,
              whiteSpace: "nowrap",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "1.5rem",
              },
            }}
          >
            {financialSummary.avgSellingPrice > 0
              ? `${addCommas(
                  convertPrice(
                    financialSummary.avgSellingPrice,
                    currency,
                    rates
                  )
                )} ${currencySign[currency]}`
              : `--,-- ${currencySign[currency]}`}
          </Typography>
          {financialSummary.avgSellingPricePercentage > 0 && (
            <Typography
              className={
                financialSummary.avgSellingPricePercentage < 0 ? "up" : "down"
              }
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

                "@media only screen and (max-width: 1500px)": {
                  fontSize: "0.8rem",
                },
              }}
            >
              {financialSummary.avgSellingPricePercentage} %
            </Typography>
          )}
        </Box>
        <Box className={styles.grid__item}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            {t("realizedProfit")}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "1.5rem",
              },
            }}
          >
            {addCommas(
              convertPrice(financialSummary.realizedProfit, currency, rates)
            )}{" "}
            {currencySign[currency]}
          </Typography>
          <Typography
            sx={{
              color: "#ffffff88",
              "@media only screen and (max-width: 1500px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            % {t("ofInvestment")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CoinDetailsDisplay;
