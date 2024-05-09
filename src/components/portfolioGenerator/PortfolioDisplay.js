import { Grid } from "@mui/material";
import BitpandaCard from "./cards/Bitpanda";
import BewertungCard from "./cards/Bewertung";
import KryptoAssets from "./cards/kryptoAssets/KryptoAssets";
import PortfolioComponent from "./cards/PortfolioComponent";
import { DonutCard } from "./cards/donutCard/DonutCard";

const PortfolioDisplay = ({portfolio, setPortfolio, loadingPortfolio, assetsLeangth}) => {
    // const [sessionJotai] = useAtom(sessionAtom);
    // const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });
    // const [loadingPortfolio, setLoadingPortfolio] = useState(false)
    // const [assetsLeangth, setAssetsLeangth] = useState(0)
    //
    //
    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (sessionJotai?.user) {
    //             const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
    //             setPortfolio(userPortfolio.data.data)
    //         }
    //
    //     };
    //     fetchData();
    // }, [sessionJotai?.user.id]);
    //
    // useEffect(() => {
    //     if (portfolio.userId && portfolio?.assets.length > 0) {
    //         setLoadingPortfolio(true)
    //         const len = portfolio?.assets.length;
    //         setAssetsLeangth(len);
    //         console.log("length of user assets", len);
    //     }
    // }, [portfolio])
    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={2} sm={4} md={4}>
                <BitpandaCard />
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <BewertungCard />
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
                <DonutCard />
            </Grid>
            <Grid item xs={8} sm={8} md={8}>
                <KryptoAssets portfolio={portfolio} loadingPortfolio={loadingPortfolio} userID={portfolio.userId} />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
                <PortfolioComponent
                    portfolio={portfolio}
                    setPortfolio={setPortfolio}
                    loadingPortfolio={loadingPortfolio}
                    assetsLeangth={assetsLeangth}
                />
            </Grid>
        </Grid>

    )
}

export default PortfolioDisplay;
