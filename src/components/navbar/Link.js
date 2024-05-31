"use client";
import { Box, IconButton, Typography, MenuItem } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { sessionAtom } from "../../app/stores/sessionStore";
import { useEffect } from "react";
import Link from "next/link";
import LanguageSwitcher from "../../app/lang/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { fetchUserSubscriptionPlan } from "../../lib/data";

const NavbarLink = ({ mobileView, handleClose }) => {
  const { data: session, status } = useSession();
  const [sessionJotai, setSession] = useAtom(sessionAtom);
  const t = useTranslations("navbar");

  useEffect(() => {
    const updateSessionWithSubscription = async () => {
      try {
        if (session) {
          const subscriptionData = await fetchUserSubscriptionPlan(session.user?.id);
          console.log("subscriptionData", subscriptionData);
          setSession({
            ...session,
            user: {
              ...session.user,
              subscriptionPlan: subscriptionData.plan,
              paymentDetails: subscriptionData.payment,
              subscribed: subscriptionData.plan !== "free",
            },
          });
        }
        if (status === "unauthenticated") {
          handleLogoutFun();
        }
        // console.log("session for admin", session, status);
      } catch (error) {
        console.error('Error updating session with subscription:', error);
      }
    };

    updateSessionWithSubscription();
  }, [status, session]);


  const handleLogoutFun = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
    console.log("Logged out successfully");
    handleClose();
  };

  return (
      <>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {session &&
        session.user.isAdmin &&
        (mobileView ? (
          <MenuItem onClick={handleClose}>
            <Link href="/admin">{t("admin")}</Link>
            <LanguageSwitcher />
          </MenuItem>
        ) : (
          <Link
            style={{ marginRight: "15px", fontFamily: "inherit" }}
            href="/admin"
          >
            <Typography variant="body1" sx={{ marginRight: "15px" }}>
              {t("admin")}
            </Typography>
          </Link>
        ))}
      {!mobileView && (
        <>
          <Typography variant="body1">
            {t("portfolioId")}: {session?.user.username}
          </Typography>
          <LanguageSwitcher />
        </>
      )}
      {mobileView ? (
        <MenuItem onClick={handleLogoutFun}>
          <LogoutIcon />
          <Typography>{t("logout")}</Typography>
        </MenuItem>
      ) : (
        <IconButton onClick={handleLogoutFun} color="inherit" sx={{ ml: 2 }}>
          <Box
            sx={{
              display: "flex",
              bgcolor: "#202530",
              p: "10px 10px",
              borderRadius: "5px",
              "&:hover": {
                backgroundColor: "var(--color-secondary-2)",
                "& .MuiTypography-root, & .MuiSvgIcon-root": {
                  color: "#000000",
                },
              },
            }}
          >
            <LogoutIcon />
            <Typography>{t("logout")}</Typography>
          </Box>
        </IconButton>
      )}
    </Box>
      </>
  );
};

export default NavbarLink;
