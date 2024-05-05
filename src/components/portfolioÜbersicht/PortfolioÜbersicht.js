import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {DonutCard} from "@/components/portfolioGenerator/cards/donutCard/DonutCard";
import BewertungCard from "@/components/portfolioGenerator/cards/Bewertung";
import GridExample from "@/components/portfolioÜbersicht/portfolioTable/Table";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function PortfolioUbersicht() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {/* Left column for detailed assets information */}
                <Grid item xs={12} md={8}>
                    <GridExample/>
                    {/*<Item>Portfolio details here</Item>*/}
                </Grid>
                {/* Right column for portfolio overview and scoring */}
                <Grid item xs={12} md={4}>
                    <Item sx={{backgroundColor: "#1188ff", cursor: "pointer", color: "white"}}>Jetzt Kommentar von BigDaddy anfragen</Item>
                    <Grid container spacing={2} sx={{marginTop: "10px"}}>
                        <Grid item xs={6} md={12}>
                            <Item>Overview item 1</Item>
                        </Grid>
                        <Grid item xs={6} md={12}>
                            <DonutCard/>
                        </Grid>
                        <Grid item xs={6} md={12}>
                            <BewertungCard />
                        </Grid>
                        <Grid item xs={6} md={12}>
                            <Item>Overview item 4</Item>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}
