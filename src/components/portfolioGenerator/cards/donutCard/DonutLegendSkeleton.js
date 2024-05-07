import React from 'react';
import {Box, Typography, useTheme} from '@mui/material';
import DoneAllIcon from "@mui/icons-material/DoneAll";

const DonutLegendSkeleton = () => {
    const theme = useTheme();
    const categories = [
        { name: 'AI', color: '#FFD700', count: 0, percentage: 0 },
        { name: 'Gaming/ Metaverse', color: '#00BFFF', count: 0, percentage: 0 },
        { name: 'DeFi', color: '#1155bb', count: 0, percentage: 0 },
        { name: 'Web3/ Anonymität', color: '#DC143C', count: 0, percentage: 0 },
        { name: 'Grüne Coins', color: '#00aa66', count: 0, percentage: 0 },
        { name: 'BTC- Zusammenhang', color: '#FF9900', count: 0, percentage: 0 },
        { name: 'CBDC- Netzwerke', color: '#667788', count: 0, percentage: 0 },
        { name: 'eCommerce', color: '#8833bb', count: 0, percentage: 0 },
        { name: 'Tokenisierung/ RWA', color: '#ff5aac', count: 0, percentage: 0 },
    ];


    return (
        <Box sx={{ background: '#202530' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 'bold' }} gutterBottom>
                Score und Allocation
            </Typography>
            {categories.map((category, index) => (
                <Box key={index} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: `${category.count > 0 ? "#00aa6620": ""}`,
                    borderRadius: "20px",
                    padding: "2px 7px 2px 5px",
                    marginBottom: "4px"
                }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: category.color, marginRight: theme.spacing(2) }} />
                    <Typography sx={{ flexGrow: 1, color: '#fff', fontSize: '11px' }}>
                        {category.name}
                    </Typography>
                    {category.count > 0 && <Typography sx={{ color: '#fff', fontSize: '11px', marginRight: theme.spacing(1) }}>
                        {category.percentage}
                    </Typography>}
                    {category.count > 0 && <DoneAllIcon sx={{ color: '#00e676', fontSize: "medium" }} />}
                </Box>
            ))}
        </Box>
    );
};

export default DonutLegendSkeleton;
