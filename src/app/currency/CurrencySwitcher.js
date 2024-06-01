import { MenuItem, Menu, Button, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";

const CurrencySwitcher = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [currency, setCurrency] = useState("EUR");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Get the current currency from the URL search parameters if available
        const currentCurrency = searchParams.get('currency');
        if (currentCurrency) {
            setCurrency(currentCurrency);
        }
    }, [searchParams]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeCurrency = (newCurrency) => {
        setCurrency(newCurrency);

        const params = new URLSearchParams(searchParams);
        params.set('currency', newCurrency); // Set the new currency, replacing any existing one

        const currentPathname = pathname || "";
        const newUrl = `${currentPathname}?${params.toString()}`;

        router.push(newUrl);
        handleClose();
    };

    return (
        <Box>
            <Button
                aria-controls="currency-menu"
                aria-haspopup="true"
                onClick={handleClick}
                sx={{ mx: 0, color: "var(--color-secondary)" }}
            >
                {currency}
            </Button>
            <Menu
                id="currency-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => changeCurrency("USD")}>
                    <a style={{ textDecoration: "none", color: "inherit" }}>USD</a>
                </MenuItem>
                <MenuItem onClick={() => changeCurrency("EUR")}>
                    <a style={{ textDecoration: "none", color: "inherit" }}>EUR</a>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default CurrencySwitcher;
