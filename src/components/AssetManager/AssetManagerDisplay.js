import { Grid, Paper, styled } from "@mui/material";
import BitpandaCard from "@/components/portfolioGenerator/cards/Bitpanda";
import PortfolioComponent from "@/components/portfolioGenerator/cards/PortfolioComponent";

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const AssetManagerDisplay = ({portfolio, setPortfolio, loadingPortfolio, assetsLeangth}) => {
    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={2} sm={4} md={4}>
                <BitpandaCard />
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item >second</Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <Item>thrid</Item>
            </Grid>

            <Grid item xs={4} sm={4} md={4}>
                <PortfolioComponent
                    portfolio={portfolio}
                    setPortfolio={setPortfolio}
                    loadingPortfolio={loadingPortfolio}
                    assetsLeangth={assetsLeangth}
                />
            </Grid>
            <Grid item xs={8} sm={8} md={8}>
                <Item >fourth</Item>
            </Grid>
        </Grid>

    )
}

export default AssetManagerDisplay;
