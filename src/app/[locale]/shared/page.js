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
  Button,
  Grid,
  Card,
} from "@mui/material";
import Image from "next/image";
import Graph from "../../../../public/assets/svg/BDC-Graph.svg";
import { getAssetTest } from "../../../lib/data";
import LayoutWrapper from "../../../components/LayoutWrapper";
import { SessionProvider } from "next-auth/react";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import {
  convertPrice,
  currencySign,
  getCurrencyAndRates,
  getUserPortfolio,
} from "../../../lib/data";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { DonutCard } from "../../../components/portfolioGenerator/cards/donutCard/DonutCard";
import Item1 from "../../../components/portfolioÜbersicht/Item1";
import Item4 from "../../../components/portfolioÜbersicht/Item4";
import BewertungCard from "../../../components/portfolioGenerator/cards/Bewertung";
import GridExample from "../../../components/portfolioÜbersicht/portfolioTable/Table";
import LoadingCircle from "../../../components/loading/Loading";

const SharedPage = () => {
  const t = useTranslations("Overview");
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = usePathname();

  const id = searchParams.get("id");
  const secretStr = searchParams.get("key");
  console.log(id, secretStr);

  const [width, setWidth] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("");
  const [open, setOpen] = useState(false);
  const [portfolio, setPortfolio] = useState({});
  const [portfolioCalculations, setPortfolioCalculations] = useState({});
  //   const [order, setOrder] = useState("asc");
  //   const [orderBy, setOrderBy] = useState("asset");
  const [sortedData, setSortedData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (path.split("/")[1] === "en") setCurrentLanguage("english");
    else setCurrentLanguage("deutsch");

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
    const validateIdAndKey = async (id, key) => {
      try {
        const res = await fetch("/api/validateShareLink", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, key }),
        });
        const resData = await res.json();
        console.log(resData);
        if (!res.ok) throw new Error("Invalid request");
        const dataResp = await getUserPortfolio(id);
        console.log(dataResp);
        setPortfolio(dataResp?.data);
        setPortfolioCalculations(dataResp?.calculation);
      } catch (err) {
        console.log(err);
        setError("Unauthorized Access");
      }
    };

    if (id && secretStr) {
      validateIdAndKey(id, secretStr);
    } else setError("No user found");
  }, [id, secretStr]);

  useEffect(() => {
    if (portfolio.assetsCalculations && portfolio.assets) {
      // console.log(portfolio, "meeeeee");
      const totalInvestment = portfolio.assetsCalculations.assets.reduce(
        (acc, curr) => acc + curr.totalInvest,
        0
      );

      const mergedData = portfolio.assets.map((asset) => {
        const calc =
          portfolio.assetsCalculations.assets.find(
            (ac) => ac.CoinGeckoID === asset.CoinGeckoID
          ) || {};
        const percentage = totalInvestment
          ? ((calc.totalInvest / totalInvestment) * 100).toFixed(2)
          : 0;
        const xValue = calc.totalInvest
          ? (calc.Holdings / calc.totalInvest).toFixed(2)
          : "NaN";
        const pricePercentage = calc.DCA
          ? (((asset.Price - calc.DCA) / calc.DCA) * 100).toFixed(2)
          : "Infinity";
        return {
          asset: asset.Ticker,
          ticker: asset.Ticker,
          imageUrl: asset.cgImageURL,
          bestand: calc.Holdings || 0,
          totalCoins: calc.totalCoins || 0,
          preisChange: asset.Price.toFixed(2),
          dcaPrice: calc.DCA || "n/a",
          investition: calc.totalInvest || 0,
          relevanz: calc.Relevanz || "n/a",
          dca: calc?.DCA_0 || "n/a",
          gewichtung: calc.Gewichtung || "n/a",
          category: asset.Category,
          percentage: `${percentage}%`,
          X: xValue,
          pricePercentage,
        };
      });
      console.log(mergedData);
      setSortedData(mergedData);
    }
  }, [portfolio]);
  console.log(portfolioCalculations);

  const switchLanguage = (lang) => {
    if (lang === "english") {
      router.push(`/en/shared?id=${id}&key=${secretStr}`);
    } else {
      router.push(`/de/shared?id=${id}&key=${secretStr}`);
    }
  };

  return (
    <>
      {error ? (
        <>
          <Box sx={{ height: "100vh", padding: "5rem" }}>
            <Typography
              component="h2"
              sx={{ fontSize: "4rem", fontWeight: "bold" }}
            >
              {error}
            </Typography>
            <Typography sx={{ fontSize: "2rem" }}>
              It looks like we ran into an issue :({" "}
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              margin: "1rem",
              padding: "0.75rem 1rem",
              width: "fit-content",
              backgroundColor: "#00000030",
              border: "2px solid var(--color-secondary-2)",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textTransform: "uppercase",
              position: "relative",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => setOpen(!open)}
          >
            {currentLanguage}
            <Box
              sx={{
                display: open ? "flex" : "none",
                flexDirection: "column",
                alignItems: "center",
                position: "absolute",
                top: "100%",
                left: 0,
                zIndex: 10,
                textTransform: "uppercase",
                borderRadius: "4px",
                overflow: "hidden",
                backgroundColor: "#00000030",
              }}
            >
              <Button
                sx={{
                  padding: "10px",
                  color: "white",
                  width: "100%",
                  borderRadius: "0",
                  fontSize: "inherit",
                }}
                onClick={() =>
                  currentLanguage !== "english" && switchLanguage("english")
                }
              >
                english
              </Button>
              <Button
                sx={{
                  padding: "10px",
                  backgroundColor: "#00000030",
                  color: "white",
                  width: "100%",
                  borderRadius: "none",
                  fontSize: "inherit",
                }}
                onClick={() =>
                  currentLanguage !== "deutsch" && switchLanguage("deutsch")
                }
              >
                Deutsch
              </Button>
            </Box>
          </Box>
          {!portfolio.assets ? (
            <Box>
              <LoadingCircle />
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1, mt: "5rem", mb: "5rem" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={width > 1100 ? 8 : 12}>
                  <GridExample preCalcPort={sortedData} />
                </Grid>
                <Grid item xs={12} md={width > 1100 ? 4 : 12}>
                  {/* <Card
                  sx={{
                    // padding: "15px",
                    backgroundColor: "#1188ff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 2,
                  }}
                >
                  <Link
                    // target="_blank"
                    // rel="noopener noreferrer"
                    href={`/portfolioOverview?msg=${msg}`}
                    style={{
                      width: "100%",
                      textAlign: "center",
                      padding: "15px 0",
                    }}
                  >
                    <Typography
                      sx={{ backgroundColor: "#1188ff", color: "white" }}
                    >
                      {t("buttonText")}
                    </Typography>
                  </Link>
                </Card> */}
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Item1 preCalcPort={portfolio} />
                    </Grid>
                    <Grid item xs={12}>
                      <DonutCard
                        preCalcPort={portfolio}
                        preCalcCalculations={portfolioCalculations}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <BewertungCard preCalcPort={portfolio} />
                    </Grid>
                    <Grid item xs={12}>
                      <Item4 />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
          {/* <Footer /> */}
        </>
      )}
    </>
  );
};

export default SharedPage;
