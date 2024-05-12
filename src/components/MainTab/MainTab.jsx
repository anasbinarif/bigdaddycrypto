"use client"
import * as React from 'react';
// import {Link, useHistory, useLocation} from 'react-router-dom'
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { useState } from "react";
import PortfolioDisplay from '@/components/portfolioGenerator/PortfolioDisplay';
import AssetManagerDisplay from "@/components/AssetManager/AssetManagerDisplay";
import PortfolioUbersicht from "@/components/portfolioÜbersicht/PortfolioÜbersicht";
// import { useTabContext } from '../../TabContext';

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

export default function ColorTabs({tabSelector, setTabSelector}) {
//     const location = useLocation();
//   const history = useHistory();
    const [value, setValue] = useState('one');
    const [selectedCoin, setSelectedCoin] = useState(0);
    // const { setActiveTab } = useTabContext();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        // setActiveTab(newValue)
        setTabSelector(newValue);
    };

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
                <PortfolioDisplay setSelectedCoin={setSelectedCoin}/>
            </TabPanel>
            <TabPanel value={value} index="two">
                <AssetManagerDisplay selectedCoin={selectedCoin} setSelectedCoin={setSelectedCoin}/>
            </TabPanel>
            <TabPanel value={value} index="three">
                <PortfolioUbersicht/>
            </TabPanel>
        </Box>
    );
}


