import React, { useEffect, useRef, useState } from 'react';

const PayPalButtonRenderer = ({ selectedPlan, billingCycle }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const paypalButtonContainerRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=Afd8OQlf1i4kxnaqUYjTbyqNnjQCV2_wuhVdzDUx3-VhEN47rJBbK4kvQOLqwfehgjE_UZP90mKsPbkm&vault=true&intent=subscription`;
        script.onload = () => setScriptLoaded(true);
        script.onerror = () => {
            console.error('PayPal SDK could not be loaded.');
        };
        document.body.appendChild(script);

        // Cleanup to avoid duplicating script loads
        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (scriptLoaded && paypalButtonContainerRef.current) {
            paypalButtonContainerRef.current.innerHTML = ''; // Clear previous button

            window.paypal.Buttons({
                style: {
                    shape: 'rect',
                    color: 'gold',
                    layout: 'vertical',
                    label: 'subscribe'
                },
                createSubscription: function (data, actions) {
                    let plan_id = '';
                    if (selectedPlan === "Pro" && billingCycle === "monthly") {
                        plan_id = 'P-3KM72035UG134911JMZJH7SY';
                    } else if (selectedPlan === "Pro" && billingCycle === "yearly") {
                        plan_id = 'P-45151746FH789922JMZIK4RI';
                    } else if (selectedPlan === "Premium" && billingCycle === "monthly") {
                        plan_id = 'P-2CC43775MC688690GMZILCLY';
                    } else if (selectedPlan === "Premium" && billingCycle === "yearly") {
                        plan_id = 'P-33B4415503159863NMZILCZA';
                    }
                    return actions.subscription.create({
                        plan_id
                    });
                },
                onApprove: function (data, actions) {
                    alert(data.subscriptionID); // Optional success message for the subscriber
                }
            }).render(paypalButtonContainerRef.current);
        }
    }, [scriptLoaded, selectedPlan, billingCycle]);

    return <div id="paypal-button-container" ref={paypalButtonContainerRef}></div>;
};

export default PayPalButtonRenderer;
