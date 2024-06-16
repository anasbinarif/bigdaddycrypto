"use client";
import {
  Box,
  IconButton,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { sessionAtom } from "../../app/stores/sessionStore";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "../../app/lang/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { fetchUserSubscriptionPlan } from "../../lib/data";
import styles from "./navbar.module.css";
import CurrencySwitcher from "../../app/currency/CurrencySwitcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareAlt,
  faShareSquare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";

const NavbarLink = ({ mobileView, handleClose }) => {
  const { data: session, status } = useSession();
  const [sessionJotai, setSession] = useAtom(sessionAtom);
  const t = useTranslations("navbar");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const updateSessionWithSubscription = async () => {
      try {
        if (session) {
          const subscriptionData = await fetchUserSubscriptionPlan(
            session.user?.id
          );
          console.log("subscriptionData", subscriptionData, session);
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
    setLoading(true);
    await signOut({ redirect: true, callbackUrl: "/login" });
    setLoading(false);
    // handleClose();
  };
  // console.log(sessionJotai.user);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {session &&
          session.user?.isAdmin &&
          (mobileView ? (
            <MenuItem onClick={handleClose}>
              <Link href="/admin" style={{ marginBottom: "1rem" }}>
                {t("admin")}
              </Link>
              <LanguageSwitcher />
              <CurrencySwitcher />
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
              {t("pricing")}
            </Link>
            <Box
              sx={{
                border: "1px solid white",
                padding: "0.75rem 0.9rem",
                borderRadius: "50px",
                cursor: "pointer",
                ml: "1rem",
                "&:hover": {
                  backgroundColor: "var(--color-secondary-2)",
                },
              }}
            >
              <FontAwesomeIcon icon={faShareAlt} />
            </Box>
            {/* <IconButton
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
            </IconButton> */}
          </>
        )}
        {!mobileView && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              ml: "1rem",
            }}
          >
            <Box
              sx={{
                border: "1px solid white",
                padding: "0.75rem 0.9rem",
                borderRadius: "50px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "var(--color-secondary-2)",
                },
              }}
              onClick={() => setOpen(!open)}
            >
              <FontAwesomeIcon icon={faUser} />
            </Box>
            {open && (
              <Box
                sx={{
                  position: "absolute",
                  top: "110%",
                  right: 0,
                  backgroundColor: "#00000033",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  minWidth: "150px",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "clamp(0.625rem, -0.1563rem + 1.25vw, 0.9375rem)",
                  }}
                >
                  {t("portfolioId")}: {session?.user?.username}
                </Typography>
                <Typography
                  sx={{
                    color: "var(--color-secondary)",
                    textTransform: "uppercase",
                    // ml: "10px",
                  }}
                >
                  {sessionJotai?.user?.subscriptionPlan}
                </Typography>
                <LanguageSwitcher />
                <CurrencySwitcher />
                <IconButton
                  onClick={handleLogoutFun}
                  color="inherit"
                  sx={{ p: 0, justifyContent: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      bgcolor: "#202530",
                      p: "0.25em 0.7em",
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
              </Box>
            )}
          </Box>
        )}
      </Box>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </>
  );
};

export default NavbarLink;
