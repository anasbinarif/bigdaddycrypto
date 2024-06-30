"use client";
import * as React from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import PortfolioDisplay from "../../components/portfolioGenerator/PortfolioDisplay";
import AssetManagerDisplay from "../../components/AssetManager/AssetManagerDisplay";
import PortfolioUbersicht from "../../components/portfolioÜbersicht/PortfolioÜbersicht";
import { useAtom } from "jotai/index";
import { useSession } from "next-auth/react";
import { sessionAtom } from "../../app/stores/sessionStore";
import { portfolioAtom } from "../../app/stores/portfolioStore";
import { getUserPortfolio } from "../../lib/data";
import { useTranslations } from "next-intl";
import PricingPlans from "../../components/PricingPlans/PricingPlans";
import CookieBottomDrawer from "../Cookies/CookieBottomDrawer";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

export default function ColorTabs({ tabSelector, setTabSelector }) {
  const t = useTranslations("colorTabs");
  const [width, setWidth] = useState(0);
  const [value, setValue] = useState("one");
  const [selectedCoin, setSelectedCoin] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCookieDrawer, setShowCookieDrawer] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTabSelector(newValue);
  };
  const { data: session, status } = useSession();
  const [sessionJotai, setSession] = useAtom(sessionAtom);
  const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [assetsLeangth, setAssetsLeangth] = useState(0);

  // const theme = useTheme();

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
    const fetchData = async () => {
      if (sessionJotai?.user) {
        const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
        setPortfolio(userPortfolio?.data);
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionJotai?.user.id]);

  useEffect(() => {
    if (portfolio?.assets) {
      setLoadingPortfolio(true);
      const len = portfolio?.assets.length;
      setAssetsLeangth(len);
    }
  }, [portfolio]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchCookies = async () => {
        // const userID = sessionJotai?.user.id;
        // const res = await fetch("/api/checkUserCookiesStatus", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ userID }),
        // });

        // const cookie = await res.json();
        // if (!cookie?.CookiesPrompt) {
        //   setShowCookieDrawer(true);
        // }
        setShowCookieDrawer(true);
      };
  
      fetchCookies();
    }, 5000);
  
    return () => clearTimeout(timer);
  }, [sessionJotai]);

  console.log("showCookieDrawer", showCookieDrawer);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#111826",
          padding: width < 500 ? "0" : "1.25% 1%",
          marginTop: "80px",
          "& > #simple-tabpanel-one > .MuiBox-root": {
            "@media only screen and (max-width: 500px)": {
              padding: "10px",
            },
          },
          "& > #simple-tabpanel-three > .MuiBox-root": {
            "@media only screen and (max-width: 500px)": {
              padding: "10px",
            },
          },
        }}
      >
        <Tabs
          value={value}
          variant="scrollable"
          scrollButtons={width < 500}
          allowScrollButtonsMobile
          onChange={handleChange}
          textColor="primary"
          aria-label="secondary tabs example"
          sx={{
            paddingLeft: width < 500 ? 0 : "24px",
            ".MuiTabs-flexContainer": {
              justifyContent: "flex-start",
              gap: "15px",
            },
            ".Mui-selected": {
              color: "#fff",
              backgroundColor: "#fff3",
            },
            ".MuiTab-root": {
              backgroundColor: "#202530",
              color: "#fff",
              transition: "0.3s",
              "&:not(.Mui-selected):hover": {
                backgroundColor: "#1188ff",
                opacity: 1,
              },
              border: 0,
              borderRadius: "4px",
              marginRight: "4px",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--color-secondary-2)",
            },
            "& .MuiTab-root:not(.Mui-selected):hover": {
              backgroundColor: "var(--color-secondary-2)",
            },
            "& .Mui-selected": {
              color: "var(--color-secondary)",
            },
          }}
        >
          <Tab
            value="one"
            label={t("portfolioGenerator")}
            sx={{
              textTransform: "capitalize",
              "&.Mui-selected": {
                borderBottomColor: "var(--color-secondary)",
                color: "var(--color-secondary)",
              },
              "@media only screen and (max-width: 600px)": {
                fontSize: "0.8rem",
                padding: "0.5rem",
              },
            }}
          />
          <Tab
            value="two"
            label={t("assetManager")}
            sx={{
              textTransform: "capitalize",
              "&.Mui-selected": {
                borderBottomColor: "var(--color-secondary)",
                color: "var(--color-secondary)",
              },
              "&.MuiTab-root:not(.Mui-selected):hover": {
                backgroundColor: "var(--color-secondary-2)",
              },
              "@media only screen and (max-width: 600px)": {
                fontSize: "0.8rem",
                padding: "0.5rem",
              },
            }}
          />
          <Tab
            value="three"
            label={t("portfolioOverview")}
            sx={{
              textTransform: "capitalize",
              "&.Mui-selected": {
                borderBottomColor: "var(--color-secondary)",
                color: "var(--color-secondary)",
              },
              "&.MuiTab-root:not(.Mui-selected):hover": {
                backgroundColor: "var(--color-secondary-2)",
              },
              "@media only screen and (max-width: 600px)": {
                fontSize: "0.8rem",
                padding: "0.5rem",
              },
            }}
          />
        </Tabs>
        <TabPanel value={value} index="one">
          <PortfolioDisplay
            loadingPortfolio={loadingPortfolio}
            assetsLeangth={assetsLeangth}
            setSelectedCoin={setSelectedCoin}
            setTabSelector={setValue}
          />
        </TabPanel>
        <TabPanel value={value} index="two">
          <AssetManagerDisplay
            loadingPortfolio={loadingPortfolio}
            assetsLeangth={assetsLeangth}
            selectedCoin={selectedCoin}
            setSelectedCoin={setSelectedCoin}
            setTabSelector={setValue}
          />
        </TabPanel>
        <TabPanel value={value} index="three">
          <PortfolioUbersicht loadingPortfolio={loadingPortfolio} />
        </TabPanel>
      </Box>
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
      {showCookieDrawer && <CookieBottomDrawer setLoading={setLoading} />}
    </>
  );
}
