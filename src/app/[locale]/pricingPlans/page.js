"use client"
import PricingPlans from "../../../components/PricingPlans/PricingPlans";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import {Box, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useTranslations} from "next-intl";

const UserPricingPlan = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
    const t = useTranslations("userPricingPlan");
    return (
        <>
            <Navbar />
            <Box sx={{ marginTop: isSmallScreen ? "5rem" : "9rem", backgroundColor: "#111826", overflowX: "hidden" }}>
                <PricingPlans/>
            </Box>
            <Footer />
        </>
    )
}

export default UserPricingPlan;