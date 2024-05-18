import React, { useState, useEffect } from "react";
import {Tab, SvgIcon, Box, Typography, IconButton} from "@mui/material";
import { categoryColors, getAssets, getCoinData } from "@/lib/data";
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import CoinCard from "../coinCard/CoinCard";
import CoinCardSkeleton from "@/components/portfolioGenerator/cards/coinCard/CoinCardSkeleton";
import FavoriteIcon from "@mui/icons-material/Favorite";

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

const ScrollableKryptoTabs = ({ portfolio, loadingPortfolio, userID }) => {
  const [value, setValue] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const tabLabels = [
    "AI",
    "Web3/Anonymität",
    "DeFi",
    "Grüne Coins",
    "Gaming/Metaverse",
    "BTC-Zusammenhang",
    "CBDC-Netzwerke",
    "ECommerce",
    "Tokenisierung/RWA",
    "Kein Hype-Thema",
    "Favourite", // Added new category label here
  ];
  const categoryMapping = {
    AI: "ai",
    "Web3/Anonymität": "web3",
    DeFi: "defi",
    "Grüne Coins": "green",
    "Gaming/Metaverse": "metaverse",
    "BTC-Zusammenhang": "btc",
    "CBDC-Netzwerke": "cbdc",
    ECommerce: "ecommerce",
    "Tokenisierung/RWA": "nft",
    "Kein Hype-Thema": "none",
    Favourite: "favourite" // This will be used for conditional rendering
  };

  // const firstHalfCount = 6; // Specify 6 tabs for the first line
  // const firstHalfLabels = tabLabels.slice(0, firstHalfCount);
  // const secondHalfLabels = tabLabels.slice(firstHalfCount);
  const firstHalfCount = 6; // No change, first 6 tabs in the first line
  const firstHalfLabels = tabLabels.slice(0, firstHalfCount);
  const secondHalfLabels = tabLabels.slice(firstHalfCount);

  useEffect(() => {
    // console.log("hello bro whats up");
    setLoading(true);
    getAssets()
      .then((data) => {
        // console.log("tetsingwtfman", data);
        setData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [userID]);

  const checkCoinSelected = (coin) => {
    if (!portfolio.assets) return false;
    return portfolio?.assets.some(
      (asset) => asset.CoinGeckoID === coin.CoinGeckoID
    );
  };

  const handleChange = (event, newValue, line) => {
    if (line === 2) {
      newValue += 6; // Now adjusting by the first half count
    }
    setValue(newValue);
  };

  // const categorizedData = tabLabels.reduce((acc, label) => {
  //   const categoryName = categoryMapping[label]; // Direct mapping to category
  //   acc[label] = data.filter((item) => item && item.Category === categoryName);
  //   return acc;
  // }, {});
  const categorizedData = tabLabels.reduce((acc, label) => {
    if (label === "Favourite") {
      const favouriteAssetsIds = portfolio.assetsCalculations?.assets
          .filter(asset => asset.Favourite)
          .map(asset => asset.CoinGeckoID);
      acc[label] = portfolio.assets && portfolio?.assets.filter(asset => favouriteAssetsIds.includes(asset.CoinGeckoID));
    } else {
      const categoryName = categoryMapping[label];
      acc[label] = data.filter((item) => item && item.Category === categoryName);
    }
    return acc;
  }, {});

  useEffect(() => {
    console.log("portfolio======", portfolio)
  }, [portfolio]);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={(e, newValue) => handleChange(e, newValue, 1)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example 1"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}
        >
          {firstHalfLabels.map((label) => (
            <Tab
              key={label}
              icon={label === "Favourite" ? <FavoriteIcon color="red" /> : <ColorCircle color={categoryColors[label]} />}
              iconPosition="start"
              label={label}
              sx={{ color: 'white', whiteSpace: "nowrap" }}
            />
          ))}
        </Tabs>
        <Tabs
          value={value - firstHalfCount}
          onChange={(e, newValue) => handleChange(e, newValue, 2)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example 2"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}
        >
          {secondHalfLabels.map((label) => (
            <Tab
              key={label}
              icon={label === "Favourite" ? <IconButton sx={{ color: 'red' }}><FavoriteIcon color="red" /></IconButton> : <ColorCircle color={categoryColors[label]} />}
              iconPosition="start"
              label={label}
              sx={{ color: 'white', whiteSpace: "nowrap" }}
            />
          ))}
        </Tabs>
      </Box>
      {tabLabels.map((label, index) => (
        <TabPanel key={index} value={value} index={index}>
          <Box
            sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
          >
            {loading
              ? Array.from(new Array(15)).map((_, idx) => (
                <CoinCardSkeleton key={idx} />
              ))
              : categorizedData[label]?.map((coin, index) => (
                <CoinCard
                  key={`${coin.CoinGeckoID}-${index}`}
                  coin={coin}
                  selected={checkCoinSelected(coin)}
                />
              ))}
          </Box>
        </TabPanel>
      ))}
    </>
  );
};

export default ScrollableKryptoTabs;
