import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  SvgIcon,
  Tab,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { categoryColors, getAssets } from "../../../../lib/data";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import CoinCard from "../coinCard/CoinCard";
import CoinCardSkeleton from "../coinCard/CoinCardSkeleton";
import FavoriteIcon from "@mui/icons-material/Star";
import { useTranslations } from "next-intl";
import { sessionAtom } from "../../../../app/stores/sessionStore";
import { useAtom } from "jotai";
import { portfolioAtom } from "../../../../app/stores/portfolioStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

function toCamelCase(str) {
  // Split the string based on '-' or '/' character
  const words = str.split(/[-/]/);

  // Convert each word to camelCase
  const camelCasedWords = words.map((word, index) => {
    // Capitalize the first letter of each word except for the first one
    if (index !== 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    } else {
      return word.toLowerCase(); // Keep the first word as it is
    }
  });

  // Join the words back together
  return camelCasedWords.join("");
}

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
        <Box sx={{ mt: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ScrollableKryptoTabs = ({
  loadingPortfolio,
  userID,
  priceIndicator,
  assetsLeangth,
  reload,
}) => {
  const t = useTranslations("scrollableKryptoTabs");
  const t2 = useTranslations("donutLegend");
  const [value, setValue] = useState(0);
  const [sessionJotai] = useAtom(sessionAtom);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState("favourite");
  const [showRiskCoins, setShowRiskCoins] = useState({});
  const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });
  const userId = sessionJotai?.user.id;

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
    if (currentCategory && userId) {
      setLoading(true);
      getAssets(currentCategory, userId)
        .then((data) => {
          setData((prevData) => ({
            ...prevData,
            [currentCategory]: data.data,
          }));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [currentCategory, userId, portfolio]);

  const handleChange = (event, newValue, line) => {
    if (line === 2) {
      newValue += firstHalfCount;
    }
    // console.log(newValue);
    setValue(newValue);
    // console.log("1111111111111111111111111111111111", tabLabels[newValue]);
    const selectedCategory = categoryMapping[tabLabels[newValue]];
    // console.log(selectedCategory);
    setCurrentCategory(selectedCategory);
  };

  const categorizedData = tabLabels.reduce((acc, label) => {
    // if (label === t("favourite")) {
    //   const favouriteAssetsIds = portfolio?.assetsCalculations?.assets
    //     .filter((asset) => asset.Favourite)
    //     .map((asset) => asset.CoinGeckoID);
    //   acc[label] =
    //     portfolio?.assets &&
    //     portfolio?.assets.filter((asset) =>
    //       favouriteAssetsIds.includes(asset.CoinGeckoID)
    //     );
    // } else {
    //   const categoryName = categoryMapping[label];
    //   acc[label] = data[categoryName] || [];
    // }
    const categoryName = categoryMapping[label];
    acc[label] = data[categoryName] || [];
    return acc;
  }, {});

  const checkCoinSelected = (coin) => {
    if (!portfolio?.assets) return false;
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
  // console.log(firstHalfLabels, secondHalfLabels);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <span className="divider" style={{ marginBottom: "24px" }}></span>
        <Tabs
          value={value === 0 ? value : false}
          onChange={(e, newValue) => {
            setValue(0);
            // console.log(tabLabels[newValue]);
            const selectedCategory = categoryMapping[tabLabels[value]];
            // console.log(selectedCategory);
            setCurrentCategory(selectedCategory);
          }}
          variant="scrollable"
          scrollButtons={false}
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example 1"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              "&.Mui-disabled": { opacity: 0.3 },
            },
            "& .MuiTab-root": {
              width: "calc(20% - 12px)",
              "@media only screen and (max-width: 1500px)": {
                width: "calc(25% - 12px)",
              },
              "@media only screen and (max-width: 1200px)": {
                width: "calc(33.33% - 12px)",
              },
              "@media only screen and (max-width: 700px)": {
                minHeight: "auto",
                padding: "20px 0",
                width: "calc(50% - 12px)",
              },
              "@media only screen and (max-width: 450px)": {
                fontSize: "clamp(0.625rem, -0.25rem + 4vw, 0.875rem)",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--color-secondary-2)",
            },
            "& .MuiTab-root:not(.Mui-selected):hover": {
              backgroundColor: "#00000011",
            },
            "& .Mui-selected": {
              // borderBottomColor: "var(--color-secondary)",
              color: "var(--color-secondary)",
            },
            "& .MuiTabs-flexContainer": {
              alignItems: "center",
            },
          }}
        >
          <Tab
            icon={<FavoriteIcon sx={{ color: "yellow" }} />}
            iconPosition="start"
            label={t("favourite")}
            sx={{
              display: "flex",
              color: "white",
              borderTopRightRadius: "8px",
              borderTopLeftRadius: "8px",
              whiteSpace: "nowrap",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              margin: "4px 6px",
              minHeight: "55px",
              // "& .MuiButtonBase-root.MuiTab-root": {
              // },
              "&.Mui-selected": {
                // borderBottomColor: "var(--color-secondary)",
                color: "var(--color-secondary)",
              },
            }}
          />
          <FontAwesomeIcon
            icon={faCrown}
            style={{
              paddingLeft: "10px",
              opacity: "0.5",
              fontSize: "0.9rem",
            }}
            color={
              sessionJotai?.user?.subscriptionPlan &&
              sessionJotai?.user?.subscriptionPlan !== "free" &&
              sessionJotai?.user?.subscriptionPlan !== "free+"
                ? "gold"
                : "grey"
            }
          />
        </Tabs>

        <Tabs
          value={value >= tabLabels.length ? false : value > 0 ? value : false}
          onChange={(e, newValue) => handleChange(e, newValue, 1)}
          variant="scrollable"
          scrollButtons={false}
          // allowScrollButtonsMobile
          aria-label="scrollable auto tabs example 1"
          sx={{
            display: "flex",
            // gap: "2rem",
            [`& .${tabsClasses.scrollButtons}`]: {
              "&.Mui-disabled": { opacity: 0.3 },
            },
            "& .MuiTabs-flexContainer": {
              flexWrap: "wrap",
            },
            "& .MuiTab-root": {
              width: "calc(20% - 12px)",
              "@media only screen and (max-width: 1500px)": {
                width: "calc(25% - 12px)",
              },
              "@media only screen and (max-width: 1200px)": {
                width: "calc(33.33% - 12px)",
              },
              "@media only screen and (max-width: 700px)": {
                minHeight: "auto",
                padding: "20px 0",
                width: "calc(50% - 12px)",
              },
              "@media only screen and (max-width: 450px)": {
                fontSize: "clamp(0.625rem, -0.25rem + 4vw, 0.875rem)",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "transparent",
            },
            "& .MuiTab-root:not(.Mui-selected):hover": {
              backgroundColor: "#00000011",
            },
            "& .Mui-selected": {
              // borderBottomColor: "var(--color-secondary)",
              borderBottom: `1px solid var(--color-secondary)`,
              color: "var(--color-secondary)",
            },
          }}
        >
          {tabLabels.map((label, index) => {
            // console.log(index, toCamelCase(label.toLowerCase()));
            return (
              <Tab
                key={index + 1}
                icon={
                  label === t("favourite") ? (
                    <FavoriteIcon sx={{ color: "red" }} />
                  ) : (
                    <ColorCircle color={categoryColors[label]} />
                  )
                }
                iconPosition="start"
                label={label}
                sx={{
                  display: index === 0 ? "none" : "flex",
                  color: "white",
                  borderTopRightRadius: "8px",
                  borderTopLeftRadius: "8px",
                  whiteSpace: "nowrap",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  margin: "4px 6px",
                  minHeight: "55px",
                  "&:not(:last-child)": {},
                  "&.Mui-selected": {
                    // borderBottomColor: "var(--color-secondary)",
                    // borderBottom: `1px solid ${categoryColors[label]}`,
                    color: "var(--color-secondary)",
                  },
                }}
              />
            );
          })}
        </Tabs>
      </Box>
      <span className="divider" style={{ marginTop: "24px" }}></span>
      {tabLabels.map((label, index) => (
        <TabPanel key={index} value={value} index={index}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              // padding: 0,
              justifyContent: isSmallScreen ? "center" : "flex-start",
            }}
          >
            {loading
              ? Array.from(new Array(15)).map((_, idx) => (
                  <CoinCardSkeleton key={idx} />
                ))
              : categorizedData[label] &&
                (() => {
                  const nonRiskCoins = categorizedData[label].filter(
                    (coin) => !checkCoinRisk(coin)
                  );
                  const riskCoins = categorizedData[label].filter((coin) =>
                    checkCoinRisk(coin)
                  );
                  // console.log(label);
                  if (label === "Favorites" || label === "Favoriten") {
                    // console.log("hellooooooo", categorizedData[label]);
                    return categorizedData[label].map((coin, index) => (
                      <CoinCard
                        key={`${coin.CoinGeckoID}-${index}`}
                        coin={coin}
                        selected={checkCoinSelected(coin)}
                        risk={checkCoinRisk(coin)}
                        priceIndicator={priceIndicator}
                        assetsLeangth={assetsLeangth}
                        currentCategory={currentCategory}
                        setData={setData}
                      />
                    ));
                  }
                  return [
                    ...nonRiskCoins.map((coin, index) => (
                      <CoinCard
                        key={`${coin.CoinGeckoID}-${index}`}
                        coin={coin}
                        selected={checkCoinSelected(coin)}
                        risk={checkCoinRisk(coin)}
                        priceIndicator={priceIndicator}
                        assetsLeangth={assetsLeangth}
                        currentCategory={currentCategory}
                        setData={setData}
                      />
                    )),
                    ...(showRiskCoins[label]
                      ? riskCoins.map((coin, index) => (
                          <CoinCard
                            key={`${coin.CoinGeckoID}-risk-${index}`}
                            coin={coin}
                            selected={checkCoinSelected(coin)}
                            risk={checkCoinRisk(coin)}
                            priceIndicator={priceIndicator}
                            assetsLeangth={assetsLeangth}
                            currentCategory={currentCategory}
                            setData={setData}
                          />
                        ))
                      : []),
                  ];
                })()}
          </Box>
          {categorizedData[label]?.some(checkCoinRisk) &&
            label !== "Favorites" &&
            label !== "Favoriten" && (
              <Button
                onClick={() => handleToggleRiskCoins(label)}
                sx={{
                  margin: "16px",
                  color: "#bbb",
                  fontSize: "13px",
                  padding: "5px 10px",
                  backgroundColor: "#ffffff22",
                  borderRadius: "4px",
                  transition: ".3s all",
                }}
              >
                {showRiskCoins[label] ? t("hideRiskCoins") : t("showRiskCoins")}
              </Button>
            )}
        </TabPanel>
      ))}
      {/*{loading && (*/}
      {/*  <Box*/}
      {/*    sx={{*/}
      {/*      position: "fixed",*/}
      {/*      top: 0,*/}
      {/*      left: 0,*/}
      {/*      width: "100vw",*/}
      {/*      height: "100vh",*/}
      {/*      display: "flex",*/}
      {/*      justifyContent: "center",*/}
      {/*      alignItems: "center",*/}
      {/*      backgroundColor: "rgba(0, 0, 0, 0.5)",*/}
      {/*      zIndex: 9999,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <CircularProgress color="inherit" />*/}
      {/*  </Box>*/}
      {/*)}*/}
    </>
  );
};

export default ScrollableKryptoTabs;
