import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const categoriesDisplay = {
    "ai": 'AI',
    "web3": 'Web3/ Anonymität',
    "defi": 'DeFi',
    "green": 'Grüne Coins',
    "metaverse": 'Gaming/ Metaverse',
    "btc": 'BTC- Zusammenhang',
    "cbdc": 'CBDC- Netzwerke',
    "ecommerce": 'eCommerce',
    "nft": 'Tokenisierung/ RWA',
};

const categoryColors = {
    'AI': '#FFD700',
    'metaverse': '#00BFFF',
    'DEFI': '#1155bb',
    'WEB3': '#DC143C',
    'GREEN': '#00aa66',
    'BTC': '#FF9900',
    'CBDC': '#667788',
    'ECOMMERCE': '#8833bb',
    'NFT': '#ff5aac',
};

const DonutLegend = ({portfolioCalculations}) => {

    const theme = useTheme();
    const categories = Object.entries(portfolioCalculations.percentages || {})
        .filter(([key]) => key.toLowerCase() !== 'none')
        .map(([key, value]) => ({
            name: key.toUpperCase(),
            percentage: value,
            color: categoryColors[key.toUpperCase()] || '#CCCCCC',
            count: portfolioCalculations.counts[key.toLowerCase()] || 0,
        }));

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
                        {categoriesDisplay[category.name.toLowerCase()]}
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

export default DonutLegend;