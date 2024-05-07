"use client"
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import NavbarLink from "@/components/navbar/Link";
import Link from "next/link";
import Image from "next/image";
import HomeIcon from "../../../public/assets/svg/bdc.svg"

const Navbar = () => {

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "#111826",
                borderBottom: "1px solid #444444",
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Link style={{ display: "flex", alignItems: "center" }} href="/" >
                    <IconButton color="inherit">
                        <Image src={HomeIcon} alt="Home Icon"
                               style={{ width: "auto", height: "35px", cursor: "pointer",
                                   backgroundColor: "white", borderRadius: "50%", padding: "2px" }}/>
                    </IconButton>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                        Portfolio Generator 2.1
                    </Typography>
                </Link>
                <SessionProvider>
                    <NavbarLink />
                </SessionProvider>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;