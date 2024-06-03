import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from "@mui/material";
import { sessionAtom } from "../../app/stores/sessionStore";
import { useAtom } from "jotai";

const Checkout = ({ open, handleClose, price, confirmOneTimePayment }) => {
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [orderID, setOrderID] = useState(false);
    const [sessionJotai, setSession] = useAtom(sessionAtom);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: "One Time Payment for Review Portfolio",
                    amount: {
                        currency_code: "USD",
                        value: price,
                    },
                },
            ],
        }).then((orderID) => {
            setOrderID(orderID);
            return orderID;
        });
    };

    // check Approval
    const onApprove = async (data, actions) => {
        return actions.order.capture().then(async function (details) {
            const { payer } = details;
            const userId = sessionJotai?.user.id;
            setSuccess(true);

            // Call API to save payment data
            const response = await fetch('/api/saveOneTimePayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, price, status: "Paid" }),
            });

            if (response.ok) {
                console.log('Payment data saved successfully');
                confirmOneTimePayment()
            } else {
                console.error('Failed to save payment data');
            }
        });
    };

    //capture likely error
    const onError = (data, actions) => {
        setErrorMessage("An Error occured with your payment ");
    };

    useEffect(() => {
        if (success) {
            handleClose()
            console.log('Order successful . Your order id is--', orderID);
        }
    }, [success]);

    const client_id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""

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
                <PayPalScriptProvider options={{
                    "client-id": client_id
                }}>
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                    />
                </PayPalScriptProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default Checkout
