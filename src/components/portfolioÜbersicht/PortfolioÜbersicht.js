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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function PortfolioUbersicht({ loadingPortfolio }) {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <GridExample />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              padding: "15px",
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
              href="/portfolioOverview"
            >
              <Typography sx={{ backgroundColor: "#1188ff", color: "white" }}>
                Jetzt Kommentar von BigDaddy anfragen
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
              <Item4 />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
