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
  const [value, setValue] = useState("one");
  const [selectedCoin, setSelectedCoin] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTabSelector(newValue);
  };

  const { data: session, status } = useSession();
  const [sessionJotai, setSession] = useAtom(sessionAtom);
  const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [assetsLeangth, setAssetsLeangth] = useState(0);

  useEffect(() => {
    // if (session) {
    //   setSession(session);
    // }
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
    if (portfolio?.assets && portfolio?.assets.length > 0) {
      setLoadingPortfolio(true);
      const len = portfolio?.assets.length;
      setAssetsLeangth(len);
    }
  }, [portfolio]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#111826",
          padding: "1.25% 1%",
          marginTop: "65px",
          // margin: "32px 24px",
        }}
      >
        <Tabs
          value={value}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="secondary tabs example"
          sx={{
            paddingLeft: "24px",
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
            ".MuiTabs-indicator": {
              backgroundColor: "#1188ff",
            },
          }}
        >
          <Tab
            value="one"
            label={t("portfolioGenerator")}
            sx={{
              textTransform: "capitalize",
              // "&.Mui-selected": {
              //   borderBottomColor: "var(--color-secondary)",
              //   color: "var(--color-secondary)",
              // },
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
            value="two"
            label={t("assetManager")}
            sx={{
              textTransform: "capitalize",
              // "&.Mui-selected": {
              //   borderBottomColor: "var(--color-secondary)",
              //   color: "var(--color-secondary)",
              // },
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
              // "&.Mui-selected": {
              //   borderBottomColor: "var(--color-secondary)",
              //   color: "var(--color-secondary)",
              // },
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
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            loadingPortfolio={loadingPortfolio}
            assetsLeangth={assetsLeangth}
            setSelectedCoin={setSelectedCoin}
            setTabSelector={setValue}
          />
        </TabPanel>
        <TabPanel value={value} index="two">
          <AssetManagerDisplay
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            loadingPortfolio={loadingPortfolio}
            assetsLeangth={assetsLeangth}
            selectedCoin={selectedCoin}
            setSelectedCoin={setSelectedCoin}
          />
        </TabPanel>
        <TabPanel value={value} index="three">
          <PortfolioUbersicht loadingPortfolio={loadingPortfolio} />
        </TabPanel>
      </Box>
      {/* <Typography variant="body1">
        {t("portfolioId")}: {session?.user.username}
        Hello
      </Typography> */}
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
}
