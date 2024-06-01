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
import styles from "./navbar.module.css";
import CurrencySwitcher from "../../app/currency/CurrencySwitcher";

const NavbarLink = ({ mobileView, handleClose }) => {
  const { data: session, status } = useSession();
  const [sessionJotai, setSession] = useAtom(sessionAtom);
  const t = useTranslations("navbar");

  useEffect(() => {
    const updateSessionWithSubscription = async () => {
      try {
        if (session) {
          const subscriptionData = await fetchUserSubscriptionPlan(
            session.user?.id
          );
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
        console.error("Error updating session with subscription:", error);
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
              <CurrencySwitcher/>
            </MenuItem>
          ) : (
            <Link
              style={{ marginRight: "15px", fontFamily: "inherit" }}
              href="/admin"
            >
              <Typography
                variant="body1"
                sx={{
                  marginRight: "15px",
                  fontSize: "clamp(0.625rem, -0.1563rem + 1.25vw, 0.9375rem)",
                }}
              >
                {t("admin")}
              </Typography>
            </Link>
          ))}
        {!mobileView && (
          <>
            <Typography
              variant="body1"
              sx={{
                fontSize: "clamp(0.625rem, -0.1563rem + 1.25vw, 0.9375rem)",
              }}
            >
              {t("portfolioId")}: {session?.user.username}
            </Typography>
            <Typography sx={{
              color: "purple",
              ml: "10px"
            }}>{sessionJotai?.user?.subscriptionPlan}</Typography>
            <LanguageSwitcher />
            <CurrencySwitcher/>
          </>
        )}
        {mobileView ? (
          <MenuItem onClick={handleLogoutFun}>
            <LogoutIcon />
            <Typography>{t("logout")}</Typography>
          </MenuItem>
        ) : (
          <>
            <Link
              href="/pricingPlans"
              className={styles.nav__link}
              style={{
                marginRight: "0",
                fontFamily: "inherit",
                backgroundColor: "var(--color-secondary-2)",
                padding: "0.9em 1.2em",
                borderRadius: "50px",
                color: "black",
              }}
            >
              Member werden
            </Link>
            <IconButton
              onClick={handleLogoutFun}
              color="inherit"
              sx={{ ml: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  bgcolor: "#202530",
                  p: "0.35em 1em",
                  borderRadius: "50px",
                  border: "1px solid var(--color-secondary)",
                  "&:hover": {
                    backgroundColor: "var(--color-secondary-2)",
                    "& .MuiTypography-root, & .MuiSvgIcon-root": {
                      color: "#000000",
                    },
                  },

                  "& .MuiTypography-root, & .MuiSvgIcon-root": {
                    color: "var(--color-secondary)",
                  },
                }}
              >
                <LogoutIcon />
                <Typography>{t("logout")}</Typography>
              </Box>
            </IconButton>
          </>
        )}
      </Box>
    </>
  );
};

export default NavbarLink;
