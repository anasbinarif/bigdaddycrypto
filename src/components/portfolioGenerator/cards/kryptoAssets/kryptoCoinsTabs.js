import React, { useState, useEffect } from 'react';
import { Tabs, Tab, SvgIcon, Box, Typography } from '@mui/material';
import { categoryColors, getCoinData } from "@/lib/data";
import CoinCard from '../coinCard/CoinCard';
import CoinCardSkeleton from "@/components/portfolioGenerator/cards/coinCard/CoinCardSkeleton";

const ColorCircle = ({ color }) => (
    <SvgIcon>
        <circle cx="12" cy="12" r="6" fill={color} />
    </SvgIcon>
);

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
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

const ScrollableKryptoTabs = () => {
    const [value, setValue] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const tabLabels = [
        "AI", "Web3/Anonymität", "DeFi", "Grüne Coins", "Gaming/Metaverse",
        "BTC-Zusammenhang", "CBDC-Netzwerke", "ECommerce", "Tokenisierung/RWA", "Kein Hype-Thema"
    ];
    const categoryMapping = {
        "AI": "ai",
        "Web3/Anonymität": "web3",
        "DeFi": "defi",
        "Grüne Coins": "green",
        "Gaming/Metaverse": "metaverse",
        "BTC-Zusammenhang": "btc",
        "CBDC-Netzwerke": "cbdc",
        "ECommerce": "ecommerce",
        "Tokenisierung/RWA": "nft",
        "Kein Hype-Thema": "none"
    };

    useEffect(() => {
        setLoading(true); // Set loading true while fetching
        getCoinData().then(data => {
            setData(data.data); // Assuming the data structure is as shown earlier
            setLoading(false); // Set loading false after fetching
            console.log("debugging 101", data.data)
        }).catch(error => {
            console.error("Error fetching data:", error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const apiKey = 'CG-XAPzMYbZ8Q8KoqGdwscqrr6f';
        const url = `https://pro-api.coingecko.com/api/v3/coins/bitcoin?x_cg_pro_api_key=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const priceEUR = data.market_data.current_price.eur;
                const marketCapEUR = data.market_data.market_cap.eur;
                const volumeEUR = data.market_data.total_volume.eur;

                console.log('Bitcoin data:', data);
                console.log('Price in EUR:', priceEUR);
                console.log('Market cap in EUR:', marketCapEUR);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Mapping categories to their respective data entries
    const categorizedData = tabLabels.reduce((acc, label) => {
        const categoryName = categoryMapping[label]; // Direct mapping to category
        acc[label] = data.filter(item => item && item.Category === categoryName);
        return acc;
    }, {});

    return (
        <>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="scrollable auto tabs example"
            >
                {tabLabels.map((label) => (
                    <Tab
                        key={label}
                        icon={<ColorCircle color={categoryColors[label]} />}
                        iconPosition="start"
                        label={label}
                        sx={{
                            color: 'white',
                        }}
                    />
                ))}
            </Tabs>
            {tabLabels.map((label, index) => (
                <TabPanel key={index} value={value} index={index}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {loading ? (
                            Array.from(new Array(15)).map((_, idx) => <CoinCardSkeleton key={idx} />)
                        ) : (
                            categorizedData[label].map((coin, index) => (
                                <CoinCard key={`${coin.CoinGeckoID}-${index}`} coin={coin} />
                            ))
                        )}
                    </Box>
                </TabPanel>
            ))}
        </>
    );
}

export default ScrollableKryptoTabs;
