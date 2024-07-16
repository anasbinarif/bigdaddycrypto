import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    useTheme,
    Box,
    Typography,
} from "@mui/material";
import { sessionAtom } from "../../app/stores/sessionStore";
import { useAtom } from "jotai";

const OneTimePaymentCheckout = ({ open, handleClose, price, confirmOneTimePayment }) => {
    const [sessionJotai, setSession] = useAtom(sessionAtom);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const copecartUrls = {
        995: 'https://copecart.com/products/ba4fb51f/checkout',
        1195: 'https://copecart.com/products/ba4fb51f/checkout',
        1295: 'https://copecart.com/products/c5a64eaa/checkout',
        1495: 'https://copecart.com/products/dd118de8/checkout',
        1695: 'https://copecart.com/products/64fd9228/checkout',
        1895: 'https://copecart.com/products/3e31258b/checkout'
    };

    const handleCopeCartCheckout = () => {
        const userId = sessionJotai?.user.id;
        const url = `${copecartUrls[price]}?user_id=${userId}`;
        window.open(url, '_blank');
        confirmOneTimePayment();
    };

    const handleCoinbaseCheckout = async () => {
        setLoading(true);
        setError(null);
        const userId = sessionJotai?.user.id;

        try {
            const response = await fetch('/api/createOnetimeCoinbaseCheckout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ price, userId }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to initiate Coinbase transaction');
            }
            console.log("handleCoinbasePurchase", data.data);

            window.open(data.data.data.hosted_url, '_blank');
            // confirmOneTimePayment();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={fullScreen}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: "90%", md: "70%" },
                    maxWidth: "600px",
                    padding: theme.spacing(2),
                },
            }}
        >
            <DialogTitle>One Time Payment</DialogTitle>
            <DialogContent>
                {error && <Typography color="error">{error}</Typography>}
                <Box display="flex" flexDirection="column" gap={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCopeCartCheckout}
                        disabled={loading}
                    >
                        Pay {price} EUR via CopeCart
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCoinbaseCheckout}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : `Pay ${price} EUR via Coinbase`}
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading} color="inherit">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OneTimePaymentCheckout;
