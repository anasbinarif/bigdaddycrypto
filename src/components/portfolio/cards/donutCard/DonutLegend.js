import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const DonutLegend = () => {
    const theme = useTheme();
    const categories = [
        { name: 'AI', percentage: '5.1%', color: '#FFD700' },
        { name: 'Web3/ Anonymität', percentage: '18.2%', color: '#DC143C' },
        { name: 'DeFi', percentage: '6.1%', color: '#1155bb' },
        { name: 'Grüne Coins', percentage: '11.5%', color: '#00aa66' },
        { name: 'Gaming/ Metaverse', percentage: '4.6%', color: '#00BFFF' },
        { name: 'BTC- Zusammenhang', percentage: '17.2%', color: '#FF9900' },
        { name: 'CBDC- Netzwerke', percentage: '18.3%', color: '#667788' },
        { name: 'eCommerce', percentage: '4.5%', color: '#8833bb' },
        { name: 'Tokenisierung/ RWA', percentage: '14.5%', color: '#ff5aac' },
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
                    backgroundColor: "#00aa6620",
                    borderRadius: "20px",
                    padding: "2px 7px 2px 5px",
                    marginBottom: "4px"
                }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: category.color, marginRight: theme.spacing(2) }} />
                    <Typography sx={{ flexGrow: 1, color: '#fff', fontSize: '11px' }}>
                        {category.name}
                    </Typography>
                    <Typography sx={{ color: '#fff', fontSize: '11px', marginRight: theme.spacing(1) }}>
                        {category.percentage}
                    </Typography>
                    <DoneAllIcon sx={{ color: '#00e676', fontSize: "medium" }} />
                </Box>
            ))}
        </Box>
    );
};

export default DonutLegend;
