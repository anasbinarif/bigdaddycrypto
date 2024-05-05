import { Grid, Paper, styled } from "@mui/material";
import BitpandaCard from "./cards/Bitpanda";
import BewertungCard from "./cards/Bewertung";
import KryptoAssets from "./cards/kryptoAssets/KryptoAssets";
import PortfolioComponent from "./cards/PortfolioComponent";
import { DonutCard } from "./cards/donutCard/DonutCard";
styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
const PortfolioDisplay = () => {
    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={2} sm={4} md={4}>
                <BitpandaCard />
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <BewertungCard />
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <DonutCard/>
            </Grid>
            <Grid item xs={8} sm={8} md={8}>
                 <KryptoAssets />
                {/*<NuclearEnergyProduction/>*/}
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
                <PortfolioComponent/>
            </Grid>
        </Grid>

    )
}

export default PortfolioDisplay;
