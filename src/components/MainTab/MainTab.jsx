"use client"
import * as React from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { useState } from "react";
import PortfolioDisplay from '../portfolio/PortfolioDisplay';

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

    return (
        <Box sx={{ width: '100%', bgcolor: '#111826', padding: '2%', }}>
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
                <PortfolioDisplay/>
            </TabPanel>
            <TabPanel value={value} index="two">
                Content for Asset Manager
            </TabPanel>
            <TabPanel value={value} index="three">
                Content for Portfolio Übersicht
            </TabPanel>
        </Box>
    );
}


