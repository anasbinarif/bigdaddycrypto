import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, styled } from '@mui/material';
import { getUserPortfolio, storeUserPortfolioCoin } from '@/lib/data';
import { portfolioAtom } from '@/app/stores/portfolioStore';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/app/stores/sessionStore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Styled components to align with your design
const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: '#333', // Dark background
    color: '#fff', // White text
    width: 160,
    margin: theme.spacing(1),
    position: 'relative', // To position the category color bar
    borderRadius: theme.shape.borderRadius,
    userSelect: "none",
}));

const CategoryColorBar = styled(Box)(({ color, selected }) => ({
    width: 4,
    height: '100%',
    backgroundColor: color,
    position: 'absolute',
    left: 0,
    top: 0,
    display: `${selected ? "none": "block"}`
}));

const CoinCard = ({ coin, selected }) => {
    const { Name, cgImageURL, Ticker, Potential, Sicherheit, Category } = coin;


    // const { data: session, status } = useSession();
    const [sessionJotai] = useAtom(sessionAtom);
    const [, setPortfolio] = useAtom(portfolioAtom);

    const getCategoryColor = (category) => {
        switch (category.toLowerCase()) {
            case 'ai': return '#FFD700';
            case 'metaverse': return '#00BFFF';
            case 'defi': return '#1155bb';
            case 'web3': return '#DC143C';
            case 'green': return '#00aa66';
            case 'btc': return '#FF9900';
            case 'cbdc': return '#667788';
            case 'ecommerce': return '#8833bb';
            case 'nft': return '#ff5aac';
            case 'none': return '#00BFFF';
            default: return '#ffffff';
        }
    };

    const checkCalculation = (Potential, Sicherheit) => {
        return !!Potential && !!Sicherheit;
    }


    const handleDoubleClick = async () => {
        const userId = sessionJotai?.user.id;
        console.log("double clicked", userId, coin)
        const res = await storeUserPortfolioCoin(userId, coin);
        console.log("Server response:", res);


        if (res.ok) {
            const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
            setPortfolio(userPortfolio.data.data)
        } else {
            console.error('Error handling the portfolioGenerator update:', res.message);
        }
    };


    return (
        <StyledCard onDoubleClick={handleDoubleClick} sx={{
            cursor: "pointer",
            border: `${selected ? "1px solid #00aa66aa": "none"}`,
            backgroundColor: `${selected ? "#00aa6633" : "none"}`
        }}>
            <CategoryColorBar color={getCategoryColor(Category)} selected={selected} />
            <CardContent>
                <CheckCircleIcon sx={{
                    color: "#00aa66",
                    display: `${selected ? "block" : "none"}`,
                    position: "absolute",
                    zIndex: 1,
                    top: "5px",
                }}/>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, pl: 1 }}>
                    <Avatar src={cgImageURL} sx={{ width: 35, height: 35, marginRight: 1 }} />
                    <Typography variant="subtitle2" noWrap>{Ticker}</Typography>
                </Box>
                <Box sx={{ paddingLeft: 1 }}>
                    <Typography component="div" variant="body2" noWrap>{Name}</Typography>
                </Box>
                {checkCalculation(Potential, Sicherheit) && <Box sx={{
                    position: "absolute",
                    right: "0",
                    bottom: "0",
                    bgcolor: "red",
                    borderBottomRightRadius: "4px",
                    borderTopLeftRadius: "4px",
                    padding: "1px 6px 0"
                }}>
                    <Typography
                        component="div"
                        variant="body2"
                        sx={{
                            fontSize: 13,
                            display: 'flex',
                            gap: "2px",
                        }}
                    >
                        <span>{Potential}</span>
                        <span>|</span> {/* Corrected typo from `<snan>` to `<span>` */}
                        <span>{Sicherheit}</span>
                    </Typography>
                </Box>}
            </CardContent>
        </StyledCard>
    );
};

export default CoinCard;
