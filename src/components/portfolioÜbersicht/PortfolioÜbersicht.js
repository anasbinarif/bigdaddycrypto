import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { DonutCard } from "../portfolioGenerator/cards/donutCard/DonutCard";
import Item1 from "./Item1";
import Item4 from "./Item4";
import BewertungCard from "../portfolioGenerator/cards/Bewertung";
import GridExample from "./portfolioTable/Table";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { portfolioAtom } from "../../app/stores/portfolioStore";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function PortfolioUbersicht({ loadingPortfolio }) {
  const [portfolio] = useAtom(portfolioAtom);
  const [msg, setMsg] = useState({
    UserComment: "",
    MissingCoins: ""
  });
  useEffect(() => {
    if (portfolio?.assetsCalculations?.Notizen) {
      setMsg({
        UserComment: portfolio.assetsCalculations.Notizen.UserComment,
        MissingCoins: portfolio.assetsCalculations.Notizen.MissingCoins
      });
    }
  }, [portfolio]);
  const t = useTranslations("Overview");
  const [width, setWidth] = useState(0);

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={width > 1100 ? 8 : 12}>
          <GridExample />
        </Grid>
        <Grid item xs={12} md={width > 1100 ? 4 : 12}>
          <Card
            sx={{
              backgroundColor: "#1188ff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 2,
            }}
          >
            <Link
              href={`/portfolioOverview?msg=${msg}`}
              style={{ width: "100%", textAlign: "center", padding: "15px 0" }}
            >
              <Typography sx={{ backgroundColor: "#1188ff", color: "white" }}>
                {t("buttonText")}
              </Typography>
            </Link>
          </Card>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Item1 loadingPortfolio={loadingPortfolio} />
            </Grid>
            <Grid item xs={12}>
              <DonutCard />
            </Grid>
            <Grid item xs={12}>
              <BewertungCard />
            </Grid>
            <Grid item xs={12}>
              <Item4 msg={msg} setMsg={setMsg} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
