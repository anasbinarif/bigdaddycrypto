import { Box } from "@mui/material"
import DonutLegend from "./DonutLegend"
import DonutChart from "./DonutChart"
import {useEffect, useState} from "react";
import { portfolioAtom } from "@/app/stores/portfolioStore";
import { useAtom } from "jotai";
import {getUserPortfolio} from "@/lib/data";
import {sessionAtom} from "@/app/stores/sessionStore";


export const DonutCard = () => {
    const [portfolio, setPortfolio] = useAtom(portfolioAtom);
    const [loadingPortfolio, setLoadingPortfolio] = useState(false)
    const [portfolioCalculations, setPortfolioCalculations] = useState({})
    const [sessionJotai] = useAtom(sessionAtom);

    useEffect(() => {
        const fetchData = async () => {
            if (sessionJotai?.user) {
                const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
                console.log("ya looo", userPortfolio.calculation);
                setPortfolioCalculations(userPortfolio.calculation)
                setLoadingPortfolio(true)
            }

        };
        fetchData();
    }, [sessionJotai?.user.id]);
    return (
        <Box sx={{ display: "flex", bgcolor: "#202530", color: 'white', height: "100%", borderRadius: 2, alignItems: "center", position: "relative", padding: "20px" }}>
            <DonutLegend />
            <DonutChart />
        </Box>
    )
}
