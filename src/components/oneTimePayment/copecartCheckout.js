import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from "@mui/material";
import { sessionAtom } from "../../app/stores/sessionStore";
import { useAtom } from "jotai";

const CopecartCheckout = ({ open, handleClose, price, confirmOneTimePayment }) => {
    const [sessionJotai, setSession] = useAtom(sessionAtom);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

        // Optionally, you can implement a mechanism to confirm the payment was successful
        confirmOneTimePayment();
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
                <Button variant="contained" color="primary" onClick={handleCopeCartCheckout}>
                    Pay {price} EUR via CopeCart
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CopecartCheckout;
