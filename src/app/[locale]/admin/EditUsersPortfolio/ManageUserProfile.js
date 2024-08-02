import React, { useState } from 'react';
import { Box, Grid, TextField, MenuItem, Button, Snackbar, Alert, Typography, Card, CardContent, Divider } from '@mui/material';

const paymentPlans = [
    { value: 'Pro', label: 'Pro' },
    { value: 'Premium', label: 'Premium' }
];

const periods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
];

const ManageUserProfile = () => {
    const [email, setEmail] = useState("");
    const [paymentPlan, setPaymentPlan] = useState("");
    const [period, setPeriod] = useState("");
    const [alert, setAlert] = useState({ type: '', message: '', visible: false });
    const [existingSubscription, setExistingSubscription] = useState(null);

    const handleSubmit = async () => {
        setAlert({ type: '', message: '', visible: false });
        setExistingSubscription(null);

        const response = await fetch('/api/updateUserProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, paymentPlan, period }),
        });

        const data = await response.json();

        if (response.status === 200) {
            if (data.subscription) {
                setExistingSubscription(data.subscription);
                setAlert({ type: 'info', message: 'User already has an active subscription.', visible: true });
            } else {
                setAlert({ type: 'success', message: 'User profile updated successfully.', visible: true });
            }
        } else {
            setAlert({ type: 'error', message: data.message, visible: true });
        }
    };

    const handleCloseSnackbar = () => {
        setAlert({ type: '', message: '', visible: false });
    };

    return (
        <Box
            sx={{
                backgroundColor: '#1e293b',
                padding: '20px',
                borderRadius: '10px',
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4" sx={{ color: 'white' }}>Manage User Profile</Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="User Email"
                        variant="outlined"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ backgroundColor: '#374151', input: { color: 'white' }, label: { color: 'white' } }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        label="Payment Plan"
                        variant="outlined"
                        fullWidth
                        required
                        value={paymentPlan}
                        onChange={(e) => setPaymentPlan(e.target.value)}
                        sx={{ backgroundColor: '#374151', input: { color: 'white' }, label: { color: 'white' } }}
                    >
                        {paymentPlans.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        label="Period"
                        variant="outlined"
                        fullWidth
                        required
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        sx={{ backgroundColor: '#374151', input: { color: 'white' }, label: { color: 'white' } }}
                    >
                        {periods.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                        Update Profile
                    </Button>
                </Grid>
                {existingSubscription && (
                    <Grid item xs={12} sx={{ marginTop: '20px' }}>
                        <Card sx={{ backgroundColor: '#374151', color: 'white' }}>
                            <CardContent>
                                <Typography variant="h5">Existing Subscription</Typography>
                                <Divider sx={{ backgroundColor: 'white', marginBottom: '10px', marginTop: '10px' }} />
                                <Typography variant="body1"><strong>Plan:</strong> {existingSubscription.plan}</Typography>
                                <Typography variant="body1"><strong>Billing Cycle:</strong> {existingSubscription.billingCycle}</Typography>
                                <Typography variant="body1"><strong>Next Billed At:</strong> {new Date(existingSubscription.nextBilledAt).toLocaleDateString()}</Typography>
                                <Typography variant="body1"><strong>Status:</strong> {existingSubscription.status}</Typography>
                                <Typography variant="body1"><strong>Payment Method:</strong> {existingSubscription.paymentMethod}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
            <Snackbar
                open={alert.visible}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={alert.type} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ManageUserProfile;
