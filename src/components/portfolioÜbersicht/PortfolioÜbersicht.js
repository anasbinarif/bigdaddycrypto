import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { DonutCard } from "@/components/portfolioGenerator/cards/donutCard/DonutCard";
import Item1 from "./Item1";
import Item4 from "./Item4";
import BewertungCard from "@/components/portfolioGenerator/cards/Bewertung";
import GridExample from "@/components/portfolioÜbersicht/portfolioTable/Table";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function PortfolioUbersicht({loadingPortfolio}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* Left column for detailed assets information */}
        <Grid item xs={12} md={8}>
          <GridExample />
          {/*<Item>Portfolio details here</Item>*/}
        </Grid>
        {/* Right column for portfolio overview and scoring */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              padding: "15px",
              backgroundColor: "#1188ff",
              cursor: "pointer",
              display: "flex", // Makes the card flex container
              alignItems: "center", // Centers the content vertically
              justifyContent: "center", // Centers the content horizontally
            }}
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://bigdaddycrypto.de/portfolio/comment/index.php"
            >
              <Typography sx={{ backgroundColor: "#1188ff", color: "white" }}>
                Jetzt Kommentar von BigDaddy anfragen
              </Typography>
            </a>
          </Card>
          <Grid container spacing={2} sx={{ marginTop: "10px" }}>
            <Grid item xs={6} md={12}>
              <Item1 loadingPortfolio={loadingPortfolio}/>
            </Grid>
            <Grid item xs={6} md={12}>
              <DonutCard />
            </Grid>
            <Grid item xs={6} md={12}>
              <BewertungCard />
            </Grid>
            <Grid item xs={6} md={12}>
              <Item4 />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
