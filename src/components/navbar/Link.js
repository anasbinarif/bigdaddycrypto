"use client"
import { Box, IconButton, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { sessionAtom } from "@/app/stores/sessionStore";
import { useEffect } from "react";
import Link from "next/link";

const NavbarLink = () => {
    const { data: session, status } = useSession();
    const [sessionJotai, setSession] = useAtom(sessionAtom);
    useEffect(() => {
        if (session) {
            setSession(session)
        }
        console.log("session for admin", session);
    }, [status])

    const handleLogoutFun = async () => {
        await signOut({ redirect: true, callbackUrl: '/login' });
        console.log("Logged out successfully");
    };
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            {session && !session.user.isAdmin && <Link
                style={{ marginRight: "15px", fontFamily: "inherit" }}
                href={"/admin"}
            > <Typography variant="body1" sx={{ marginRight: "15px" }}>Admin</Typography></Link>}
            <Typography variant="body1">Portfolio-ID: {session?.user.username}</Typography>
            <IconButton onClick={handleLogoutFun} color="inherit" sx={{ ml: 2 }}>
                <Box sx={{ display: "flex", bgcolor: "#202530", p: "10px 10px", borderRadius: "5px", '&:hover': { backgroundColor: '#1188ff' } }}>
                    <LogoutIcon />
                    <Typography >Logout</Typography>
                </Box>
            </IconButton>
        </Box>
    );
};

export default NavbarLink;