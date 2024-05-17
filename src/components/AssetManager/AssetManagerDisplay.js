import { Grid, Paper, styled } from "@mui/material";
import BitpandaCard from "@/components/portfolioGenerator/cards/Bitpanda";
import PortfolioComponent from "@/components/portfolioGenerator/cards/PortfolioComponent";
import Second from "./cards/Second";
import Third from "./cards/Third";
import CoinDetails from "./cards/coinDetails/CoinDetails";
import { useState, useEffect } from "react";
import { getUserPortfolio } from "@/lib/data";
import { useAtom } from "jotai/index";
import { sessionAtom } from "@/app/stores/sessionStore";
import { portfolioAtom } from "@/app/stores/portfolioStore";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const AssetManagerDisplay = ({selectedCoin, setSelectedCoin, portfolio, setPortfolio, loadingPortfolio, assetsLeangth}) => {
    return (
        <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
        >
            <Grid item xs={2} sm={4} md={4}>
                <BitpandaCard />
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Second />
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Third />
            </Grid>

            <Grid item xs={4} sm={4} md={4}>
                <PortfolioComponent
                    portfolio={portfolio}
                    setPortfolio={setPortfolio}
                    loadingPortfolio={loadingPortfolio}
                    assetsLeangth={assetsLeangth}
                    setSelectedCoin={setSelectedCoin}
                />
            </Grid>
            <Grid item xs={8} sm={8} md={8}>
                <CoinDetails
                    coin={portfolio?.assets[selectedCoin]}
                    index={selectedCoin}
                />
            </Grid>
        </Grid>
  );
};

export default AssetManagerDisplay;
