import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Snackbar,
    Typography,
    useMediaQuery,
    useTheme,
    Slide,
    Alert,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import CoinbaseIcon from '../iconSvgs/CoinbaseIcon';
import { useAtom } from 'jotai';
import { sessionAtom } from '../../app/stores/sessionStore';
import { portfolioAtom } from '../../app/stores/portfolioStore';
import { useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';

const plans = [
    { name: 'Pro', description: 'Pro plan description' },
    { name: 'Premium', description: 'Premium plan description' },
];

const copecartUrls = {
    Pro: {
        monthly: 'https://www.copecart.com/products/5482940f/checkout',
        yearly: 'https://www.copecart.com/products/51a7b8e7/checkout',
    },
    Premium: {
        monthly: 'https://www.copecart.com/products/c96211b6/checkout',
        yearly: 'https://www.copecart.com/products/568b77e7/checkout',
    },
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SubscribeDialog = ({ open, handleClose }) => {
    const t = useTranslations('SubscribeDialog');
    const [, setPortfolio] = useAtom(portfolioAtom);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedPlan, setSelectedPlan] = useState('Pro');
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [sessionJotai, setSession] = useAtom(sessionAtom);
    const [openLogin, setOpenLogin] = useState(false);

    const handleLogoutFun = async () => {
        await signOut({ redirect: true, callbackUrl: '/login' });
        handleClose();
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSubscribe = () => {
        const userId = sessionJotai?.user.id;
        const url = `${copecartUrls[selectedPlan][billingCycle]}?user_id=${userId}`;
        window.open(url, '_blank');
        handleClose();
        setOpenLogin(true);
    };

    const handleCoinbasePurchase = async () => {
        try {
            const userId = sessionJotai?.user.id;
            const response = await fetch('/api/createCoinbaseCheckout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
                body: JSON.stringify({
                    name: selectedPlan,
                    billingCycle,
                    userId
                }),
            });

            const data = await response.json();
            if (response.ok && data?.data?.data.hosted_url) {
                window.open(data.data.data.hosted_url, '_blank');
                handleClose();
                setOpenLogin(true);
            } else {
                setSnackbarMessage('Failed to initiate Coinbase transaction');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Error initiating Coinbase transaction');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <Box>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: '90%', md: '70%' },
                        maxWidth: '600px',
                    },
                }}
            >
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>Select a Plan and Billing Cycle</DialogContentText>
                    <Grid container spacing={2}>
                        {plans.map((plan) => (
                            <Grid item xs={12} sm={6} key={plan.name}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        border: selectedPlan === plan.name ? '2px solid blue' : 'none',
                                    }}
                                    onClick={() => setSelectedPlan(plan.name)}
                                >
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {plan.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {plan.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box mt={2}>
                        <RadioGroup
                            aria-label="billingCycle"
                            value={billingCycle}
                            onChange={(e) => setBillingCycle(e.target.value)}
                        >
                            <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                            <FormControlLabel value="yearly" control={<Radio />} label="Yearly" />
                        </RadioGroup>
                    </Box>
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button variant="contained" color="primary" onClick={handleSubscribe} startIcon={<SubscriptionsIcon />}>
                            Subscribe via CopeCart
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCoinbasePurchase} startIcon={<SubscriptionsIcon />}>
                            Purchase via Coinbase
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Dialog
                open={openLogin}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpenLogin(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{'Subscription Confirmation'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        If you have completed the subscription process, please log out and log back in to reflect the changes.
                        If you have not subscribed, you can close this dialog.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogoutFun} color="primary">
                        Logout Now
                    </Button>
                    <Button onClick={() => setOpenLogin(false)} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SubscribeDialog;
