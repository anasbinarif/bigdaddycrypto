"use client"
import * as React from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import {useEffect, useState} from "react";
import PortfolioDisplay from '@/components/portfolioGenerator/PortfolioDisplay';
import AssetManagerDisplay from "@/components/AssetManager/AssetManagerDisplay";
import PortfolioUbersicht from "@/components/portfolioÜbersicht/PortfolioÜbersicht";
import {useAtom} from "jotai/index";
import {sessionAtom} from "@/app/stores/sessionStore";
import {portfolioAtom} from "@/app/stores/portfolioStore";
import {getUserPortfolio} from "@/lib/data";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component="div">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function ColorTabs() {
    const [value, setValue] = useState('one');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [sessionJotai] = useAtom(sessionAtom);
    const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });
    const [loadingPortfolio, setLoadingPortfolio] = useState(false)
    const [assetsLeangth, setAssetsLeangth] = useState(0)


    useEffect(() => {
        const fetchData = async () => {
            if (sessionJotai?.user) {
                const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
                console.log("han bhai scene kiya hai", userPortfolio.data)
                setPortfolio(userPortfolio?.data)
            }

        };
        fetchData();
    }, [sessionJotai?.user.id]);

    useEffect(() => {
        if (portfolio?.assets && portfolio?.assets.length > 0) {
            setLoadingPortfolio(true)
            const len = portfolio?.assets.length;
            setAssetsLeangth(len);
            console.log("length of user assets", len);
        }
    }, [portfolio])

    return (
        <Box sx={{ width: '100%', bgcolor: '#111826', padding: '2%', marginTop: "65px" }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="primary"
                indicatorColor="primary"
                aria-label="secondary tabs example"
                sx={{
                    '.MuiTabs-flexContainer': {
                        justifyContent: 'flex-start',
                        gap: '15px',
                    },
                    '.Mui-selected': {
                        color: '#fff',
                        backgroundColor: '#fff3'
                    },
                    '.MuiTab-root': {
                        backgroundColor: '#202530',
                        color: '#fff',
                        transition: '0.3s',
                        '&:not(.Mui-selected):hover': {
                            backgroundColor: '#1188ff',
                            opacity: 1
                        },
                        border: 0,
                        borderRadius: '4px',
                        marginRight: '4px',
                    },
                    '.MuiTabs-indicator': {
                        backgroundColor: '#1188ff',
                    }
                }}
            >
                <Tab value="one" label="Portfolio Generator" />
                <Tab value="two" label="Asset Manager" />
                <Tab value="three" label="Portfolio Übersicht" />
            </Tabs>
            <TabPanel value={value} index="one">
                <PortfolioDisplay portfolio={portfolio}
                                  setPortfolio={setPortfolio}
                                  loadingPortfolio={loadingPortfolio}
                                  assetsLeangth={assetsLeangth}/>
            </TabPanel>
            <TabPanel value={value} index="two">
                <AssetManagerDisplay portfolio={portfolio}
                                     setPortfolio={setPortfolio}
                                     loadingPortfolio={loadingPortfolio}
                                     assetsLeangth={assetsLeangth}/>
            </TabPanel>
            <TabPanel value={value} index="three">
                <PortfolioUbersicht/>
            </TabPanel>
        </Box>
    );
}


