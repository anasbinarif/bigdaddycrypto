"use client";
import { Box, IconButton, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { sessionAtom } from "../../app/stores/sessionStore";
import { useEffect } from "react";
import Link from "next/link";
import LanguageSwitcher from "../../app/lang/LanguageSwitcher";
import { useTranslations } from "next-intl";

const NavbarLink = () => {
  const { data: session, status } = useSession();
  const [sessionJotai, setSession] = useAtom(sessionAtom);
  const t = useTranslations("navbar");

  useEffect(() => {
    if (session) {
      setSession(session);
    }
    if (status === "unauthenticated") {
      handleLogoutFun();
    }
    console.log("session for admin", session, status);
  }, [status, session]);

  const handleLogoutFun = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
    console.log("Logged out successfully");
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {session && session.user.isAdmin && (
        <Link
          // style={{ marginRight: "15px", fontFamily: "inherit" }}
          href={"/admin"}
        >
          <Typography variant="body1" sx={{ marginRight: "15px" }}>
            {t("admin")}
          </Typography>
        </Link>
      )}
      <Typography variant="body1">
        {t("portfolioId")}: {session?.user.username}
      </Typography>
      <LanguageSwitcher />
      <IconButton onClick={handleLogoutFun} color="inherit" sx={{ ml: 2 }}>
        <Box
          sx={{
            display: "flex",
            // bgcolor: "#202530",
            border: "1px solid var(--color-secondary)",
            borderRadius: "50px",
            p: "16px 30px",
            // borderRadius: "5px",
            "&:hover": {
              backgroundColor: "var(--color-secondary-2)",
              "& .MuiTypography-root, & .MuiSvgIcon-root": {
                color: "#000000",
              },
            },
          }}
        >
          <LogoutIcon
            className="logout__icon"
            sx={{ marginRight: "8px", color: "var(--color-secondary)" }}
          />
          <Typography
            sx={{
              color: "var(--color-secondary)",
            }}
          >
            {t("logout")}
          </Typography>
        </Box>
      </IconButton>
    </Box>
  );
};

export default NavbarLink;
