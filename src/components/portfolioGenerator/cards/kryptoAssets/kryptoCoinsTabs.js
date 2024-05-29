import React, { useState, useEffect } from "react";
import { Tab, SvgIcon, Box, Typography, useMediaQuery, useTheme, Button } from "@mui/material";
import { categoryColors, getAssets } from "../../../../lib/data";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import CoinCard from "../coinCard/CoinCard";
import CoinCardSkeleton from "../coinCard/CoinCardSkeleton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useTranslations } from "next-intl";

const ColorCircle = ({ color }) => (
  <SvgIcon>
    <circle cx="12" cy="12" r="6" fill={color} />
  </SvgIcon>
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ScrollableKryptoTabs = ({ portfolio, loadingPortfolio, userID, priceIndicator, assetsLeangth }) => {
  const t = useTranslations("scrollableKryptoTabs");
  const [value, setValue] = useState(0);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState("favourite");
  const [showRiskCoins, setShowRiskCoins] = useState({}); // State to manage risk coin visibility

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const tabLabels = [
    t("favourite"),
    t("ai"),
    t("web3Anonymity"),
    t("defi"),
    t("greenCoins"),
    t("gamingMetaverse"),
    t("btcConnection"),
    t("cbdcNetworks"),
    t("eCommerce"),
    t("tokenizationRWA"),
    t("noHypeTopic"),
  ];

  const categoryMapping = {
    [t("ai")]: "ai",
    [t("web3Anonymity")]: "web3",
    [t("defi")]: "defi",
    [t("greenCoins")]: "green",
    [t("gamingMetaverse")]: "metaverse",
    [t("btcConnection")]: "btc",
    [t("cbdcNetworks")]: "cbdc",
    [t("eCommerce")]: "ecommerce",
    [t("tokenizationRWA")]: "nft",
    [t("noHypeTopic")]: "none",
    [t("favourite")]: "favourite",
  };

  const firstHalfCount = 6;
  const firstHalfLabels = tabLabels.slice(0, firstHalfCount);
  const secondHalfLabels = tabLabels.slice(firstHalfCount);

  useEffect(() => {
    if (currentCategory) {
      setLoading(true);
      getAssets(currentCategory)
        .then((data) => {
          setData((prevData) => ({ ...prevData, [currentCategory]: data.data }));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [currentCategory]);

  const handleChange = (event, newValue, line) => {
    if (line === 2) {
      newValue += firstHalfCount;
    }
    setValue(newValue);
    const selectedCategory = categoryMapping[tabLabels[newValue]];
    setCurrentCategory(selectedCategory);
  };

  const categorizedData = tabLabels.reduce((acc, label) => {
    if (label === t("favourite")) {
      const favouriteAssetsIds = portfolio?.assetsCalculations?.assets
        .filter((asset) => asset.Favourite)
        .map((asset) => asset.CoinGeckoID);
      acc[label] = portfolio?.assets && portfolio?.assets.filter((asset) =>
        favouriteAssetsIds.includes(asset.CoinGeckoID)
      );
    } else {
      const categoryName = categoryMapping[label];
      acc[label] = data[categoryName] || [];
    }
    return acc;
  }, {});

  const checkCoinSelected = (coin) => {
    if (!portfolio.assets) return false;
    return portfolio?.assets.some(
      (asset) => asset.CoinGeckoID === coin.CoinGeckoID
    );
  };

  const checkCoinRisk = (coin) => {
    return !!coin.Risk;
  };

  const handleToggleRiskCoins = (category) => {
    setShowRiskCoins((prevShowRiskCoins) => ({
      ...prevShowRiskCoins,
      [category]: !prevShowRiskCoins[category],
    }));
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value < firstHalfCount ? value : false}
          onChange={(e, newValue) => handleChange(e, newValue, 1)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example 1"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              "&.Mui-disabled": { opacity: 0.3 },
            },
          }}
        >
          {firstHalfLabels.map((label, index) => (
            <Tab
              key={index}
              icon={
                label === t("favourite") ? (
                  <FavoriteIcon sx={{ color: "red" }} />
                ) : (
                  <ColorCircle color={categoryColors[label]} />
                )
              }
              iconPosition="start"
              label={label}
              sx={{ color: "white", whiteSpace: "nowrap" }}
            />
          ))}
        </Tabs>
        <Tabs
          value={value >= firstHalfCount ? value - firstHalfCount : false}
          onChange={(e, newValue) => handleChange(e, newValue, 2)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example 2"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              "&.Mui-disabled": { opacity: 0.3 },
            },
          }}
        >
          {secondHalfLabels.map((label, index) => (
            <Tab
              key={index + firstHalfCount}
              icon={
                label === t("favourite") ? (
                  <FavoriteIcon sx={{ color: "red" }} />
                ) : (
                  <ColorCircle color={categoryColors[label]} />
                )
              }
              iconPosition="start"
              label={label}
              sx={{ color: "white", whiteSpace: "nowrap" }}
            />
          ))}
        </Tabs>
      </Box>
      {tabLabels.map((label, index) => (
        <TabPanel key={index} value={value} index={index}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: isSmallScreen ? "center" : "flex-start",
            }}
          >
            {loading
              ? Array.from(new Array(15)).map((_, idx) => (
                <CoinCardSkeleton key={idx} />
              ))
              : categorizedData[label] && (() => {
                const nonRiskCoins = categorizedData[label].filter(coin => !checkCoinRisk(coin));
                const riskCoins = categorizedData[label].filter(coin => checkCoinRisk(coin));
                return [
                  ...nonRiskCoins.map((coin, index) => (
                    <CoinCard
                      key={`${coin.CoinGeckoID}-${index}`}
                      coin={coin}
                      selected={checkCoinSelected(coin)}
                      risk={checkCoinRisk(coin)}
                      priceIndicator={priceIndicator}
                      assetsLeangth={assetsLeangth}
                    />
                  )),
                  ...(showRiskCoins[label] ? riskCoins.map((coin, index) => (
                    <CoinCard
                      key={`${coin.CoinGeckoID}-risk-${index}`}
                      coin={coin}
                      selected={checkCoinSelected(coin)}
                      risk={checkCoinRisk(coin)}
                      priceIndicator={priceIndicator}
                      assetsLeangth={assetsLeangth}
                    />
                  )) : [])
                ]
              })()
            }
          </Box>
          {categorizedData[label]?.some(checkCoinRisk) && (
            <Button onClick={() => handleToggleRiskCoins(label)}
              sx={{
                margin: "16px",
                color: "#bbb",
                fontSize: "13px",
                padding: "5px 10px",
                backgroundColor: "#ffffff22",
                borderRadius: "4px",
                transition: ".3s all"
              }}
            >
              {showRiskCoins[label] ? t("hideRiskCoins") : t("showRiskCoins")}
            </Button>
          )}
        </TabPanel>
      ))}
    </>
  );
};

export default ScrollableKryptoTabs;
