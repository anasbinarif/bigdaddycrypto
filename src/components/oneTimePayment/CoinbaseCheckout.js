import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { sessionAtom } from "../../app/stores/sessionStore";
import { useAtom } from "jotai";

const CoinbaseCheckout = ({ open, handleClose, price, confirmOneTimePayment }) => {
    const [sessionJotai, setSession] = useAtom(sessionAtom);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCoinbaseCheckout = async () => {
        setLoading(true);
        setError(null);
        const userId = sessionJotai?.user.id;

        try {
            const response = await fetch('/api/coinbase/create-one-time-checkout', {
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

            window.open(data.data.hosted_url, '_blank');
            confirmOneTimePayment();
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
                },
            }}
        >
            <DialogTitle>One Time Payment</DialogTitle>
            <DialogContent>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCoinbaseCheckout}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : `Pay ${price} EUR via Coinbase`}
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CoinbaseCheckout;
