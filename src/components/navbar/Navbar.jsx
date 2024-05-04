"use client"
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Link from "@/components/navbar/Link";
import { SessionProvider } from "next-auth/react";

const Navbar = async () => {

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "#111826",
                borderBottom: "1px solid #444444",
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton color="inherit">
                        <HomeIcon />
                    </IconButton>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                        Portfolio Generator 2.1
                    </Typography>
                </Box>
                <SessionProvider>
                    <Link />
                </SessionProvider>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;