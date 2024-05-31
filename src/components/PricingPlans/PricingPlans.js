"use client"
import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Grid, Card, CardContent, IconButton, Switch } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { fetchUserSubscriptionPlan } from "../../lib/data";
import { useAtom } from "jotai";
import { sessionAtom } from "../../app/stores/sessionStore";
import CurrentPlan from "./CurrentPlan";
import SubscribeDialog from "../../components/subscribeDialog/SubscribeDialog";

const plans = [
    {
        title: 'Free',
        price: '€0.00',
        features: [
            'max. 10 Coins in portfolio',
            'FAQ',
            'Mediathek 1 day after the others – Info Prompt (which signals the user to go for paid plans)',
            'Google Ads',
        ],
    },
    {
        title: 'Pro',
        priceMonthly: '€29.95',
        priceYearly: '€24.95',
        yearlySavings: '€60.00',
        features: [
            'Unlimited Coins',
            'Mediathek 1 day access / updates before free users',
            'Add to Favorites',
            'Access to Graph',
            'Import / Export CSV',
            'All small Dashboards / (PDFs) - only in yearly subscription',
            'Blocklist',
            'all Livestreams (Integrated later)',
        ],
    },
    {
        title: 'Premium',
        priceMonthly: '€59.95',
        priceYearly: '€49.95',
        yearlySavings: '€120.00',
        features: [
            'Unlimited Coins',
            'Mediathek 1 day access/updates before free users',
            'Add to Favorites',
            'Access to Graph',
            'Import / Export CSV - Later separately for each Sub Portfolio',
            'Indicators on Portfolio Generator',
            'Add New Coins to Portfolio that were not added by us on their own (asset manager)',
            '3 Sub Portfolios',
            'All Dashboards (small + Large) / PDFs - only in yearly subscription',
            'Blocklist',
            'all Livestreams (Integrated later)',
            'VIP discord Channel and Telegram (max. 1 Account per User) (Integrated later)',
        ],
    },
];

const PricingPlans = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [sessionJotai] = useAtom(sessionAtom);
    const [userSubscription, setUserSubscription] = useState(null);
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const handleBillingCycleChange = (event) => {
        setBillingCycle(event.target.checked ? 'yearly' : 'monthly');
    };

    useEffect(() => {
        const getUserSubscriptionPlan = async () => {
            const subscriptionData = await fetchUserSubscriptionPlan(sessionJotai?.user.id);
            setUserSubscription(subscriptionData);
        }
        getUserSubscriptionPlan();
    }, [sessionJotai]);

    useEffect(() => {
        console.log("userSubscriptionuserSubscriptionuserSubscription", userSubscription)
    }, [userSubscription]);

    function handelSubModal() {
        setOpen(true)
    }

    return (<>
        <SubscribeDialog open={open} handleClose={handleClose}/>
        <Container>
            {userSubscription && userSubscription?.plan !== 'free' && (
                <CurrentPlan planDetails={userSubscription?.payment?.Subscription} />
            )}
            <Box textAlign="center" my={4}>
                <Typography variant="h3" component="h1" gutterBottom style={{ color: 'white' }}>
                    Subscription Plans
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                    <Typography variant="body1" style={{ color: billingCycle === 'monthly' ? '#ffffff' : '#aaa', marginRight: '8px' }}>
                        Monthly
                    </Typography>
                    <Switch
                        checked={billingCycle === 'yearly'}
                        onChange={handleBillingCycleChange}
                        color="primary"
                        inputProps={{ 'aria-label': 'billing cycle switch' }}
                        sx={{
                            '.MuiSwitch-switchBase.Mui-checked': {
                                color: '#ffffff',
                            },
                            '.MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#4caf50',
                            },
                        }}
                    />
                    <Typography variant="body1" style={{ color: billingCycle === 'yearly' ? '#ffffff' : '#aaa', marginLeft: '8px' }}>
                        Annually
                    </Typography>
                    <Box display="flex" alignItems="center" ml={2} p={1} bgcolor="#2c2c2e" borderRadius="5px">
                        <Typography variant="body2" style={{ color: 'white' }}>
                            16% off. Its like 60 days free
                        </Typography>
                        <IconButton size="small" sx={{ color: 'white' }}>
                            😍
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Grid container spacing={4}>
                {plans.map((plan, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card style={{ backgroundColor: '#333', color: 'white', borderRadius: '10px', position: 'relative' }}>
                            {userSubscription?.plan === plan.title && (
                                <CheckCircleIcon sx={{ color: '#4caf50', position: 'absolute', top: '10px', right: '10px' }} />
                            )}
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom align="center">
                                    {plan.title}
                                </Typography>
                                <Typography variant="h4" component="p" gutterBottom align="center">
                                    {plan.title === 'Free'
                                        ? plan.price
                                        : billingCycle === 'monthly'
                                            ? plan.priceMonthly
                                            : plan.priceYearly}
                                    {plan.title !== 'Free' && (
                                        <Typography variant="body1" component="span">
                                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                                        </Typography>
                                    )}
                                </Typography>
                                {billingCycle === 'yearly' && plan.title !== 'Free' && (
                                    <Box display="flex" alignItems="center" justifyContent="center" mb={2} p={1} bgcolor="#444" borderRadius="5px">
                                        <Typography variant="body2" style={{ color: 'white' }}>
                                            You save {plan.yearlySavings} a year
                                        </Typography>
                                        <IconButton size="small" sx={{ color: 'white' }}>
                                            <InfoIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )}
                                {plan.title === 'Pro' && !['Pro', 'Premium'].includes(userSubscription?.plan) && (
                                    <Button variant="contained" color="secondary" fullWidth onClick={handelSubModal}>
                                        Subscribe
                                    </Button>
                                )}
                                {plan.title === 'Premium' && !['Pro', 'Premium'].includes(userSubscription?.plan) && (
                                    <Button variant="contained" color="secondary" fullWidth onClick={handelSubModal}>
                                        Subscribe
                                    </Button>
                                )}
                                <ul style={{ paddingLeft: '0', listStyleType: 'none', marginTop: "25px" }}>
                                    {plan.features.map((feature, index) => (
                                        <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                            <CheckCircleIcon sx={{ color: 'white', marginRight: '8px' }} />
                                            <Typography variant="body1" component="p" style={{ color: 'white' }}>
                                                {feature}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    </>
    );
};

export default PricingPlans;
