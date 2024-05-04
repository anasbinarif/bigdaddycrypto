// src/components/PortfolioComponent.js
import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { Box, Typography, Avatar, Card, CardContent, Grid, Tooltip, IconButton, styled } from '@mui/material';
import { portfolioAtom } from '@/app/stores/portfolioStore';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationDialog from '@/components/AlertDialog/AlertDialog';
import { sessionAtom } from "@/app/stores/sessionStore";
import { getCategoryColor, getUserPortfolio } from '@/lib/data';

const CategoryColorBar = styled(Box)(({ color }) => ({
    width: 4,
    height: '100%',
    backgroundColor: color,
    position: 'absolute',
    left: 0,
    top: 0,
}));

const PortfolioComponent = () => {
    const [sessionJotai] = useAtom(sessionAtom);
    const [portfolio, setPortfolio] = useAtom(portfolioAtom);
    const [deleteIconIndex, setDeleteIconIndex] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [loadingPortfolio, setLoadingPortfolio] = useState(false)

    const handleDeleteClick = (asset) => {
        setSelectedAsset(asset);
    };

    const handleDeleteConfirm = () => {
        // Perform delete action here
        console.log({ selectedAsset });
        handleCloseDialog();
    };

    const handleCloseDialog = () => {
        setSelectedAsset(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (sessionJotai?.user) {
                const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
                setPortfolio(userPortfolio.data.data)
            }

        };
        fetchData();
    }, [sessionJotai?.user.id]);

    useEffect(() => {
        if (portfolio.userId) {
            setLoadingPortfolio(true)
        }
    }, [portfolio])

    const handleMouseEnter = (index) => {
        setDeleteIconIndex(index);
    };

    const handleMouseLeave = () => {
        setDeleteIconIndex(null);
    };


    return (
        <Box sx={{ width: '100%', backgroundColor: '#202530', p: 2, display: "flex", borderRadius: "2px", position: "sticky", top: "92px" }}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Portfolio ({portfolio?.assets?.length ? portfolio.assets.length : 0})
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Passe die Gewichtung der Assets an, um ihren tatsächlichen Anteil im Portfolio besser wiederzuspiegeln.
                </Typography>
                {loadingPortfolio && <Grid sx={{
                    borderRadius: "4px", overflow: 'auto',
                    scrollbarColor: '#555559 #333339',
                    maxHeight: '300px',
                }}>
                    {loadingPortfolio && portfolio.assets.map((asset, index) => (
                        <Grid item key={index} xs={12} sm={6} md={15}>
                            <Card onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={() => handleMouseLeave()}
                                sx={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                    alignItems: 'center',
                                    p: 2,
                                    cursor: "pointer",
                                    borderRadius: 0,
                                    backgroundColor: "#23252b",
                                    '&:hover': { backgroundColor: '#00000099' },
                                    position: 'relative',
                                }}>
                                {deleteIconIndex === index && (
                                    <CategoryColorBar color={getCategoryColor(asset.Category)} />)}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar src={asset.cgImageURL} sx={{ width: 28, height: 28, mr: 1 }} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" sx={{ color: "#fff", fontSize: "14px" }}>{asset.Ticker}</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" sx={{ color: "#fff" }}>{asset?.Price ? asset?.Price.toFixed(6) : 0} €</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: "row" }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: "column" }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ color: "#fff" }}>
                                            {asset.UserHolding ? asset.UserHolding : 0} €                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ color: "gray" }}>0 {asset.Ticker}</Typography>
                                    </Box>
                                    {deleteIconIndex === index && (
                                        <Tooltip title="Delete" onClick={() => handleDeleteClick(asset)}>
                                            <IconButton sx={{ color: 'gray', '&:hover': { color: 'red' } }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>}
            </Box>
            <DeleteConfirmationDialog
                open={Boolean(selectedAsset)}
                handleClose={handleCloseDialog}
                handleDeleteConfirm={handleDeleteConfirm}
                asset={selectedAsset}
            />
        </Box>
    );
};

export default PortfolioComponent;
