"use client";
import {
  Box,
  IconButton,
  Typography,
  MenuItem,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  useMediaQuery,
  useTheme,
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
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter, usePathname } from "next/navigation";
import useEnhancedEffect from "@mui/utils/useEnhancedEffect";

const NavbarLink = ({ mobileView, handleClose }) => {
  const router = useRouter();
  const path = usePathname();
  const { data: session, status } = useSession();
  const [sessionJotai, setSession] = useAtom(sessionAtom);
  const t = useTranslations("navbar");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [alert, setAlert] = useState("");
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  // Change Password logic
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const generateLink = async () => {
    try {
      const res = await fetch("/api/makeShareLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: sessionJotai?.user.id }),
      });

      const resData = await res.json();
      console.log(resData, window.location.hostname);
      const str = `${window.location.hostname}${
        window.location.hostname === "localhost" ? ":3000" : ""
      }/en/shared?id=${sessionJotai?.user.id}&key=${resData.data}`;

      console.log(str);
      await navigator.clipboard.writeText(str);
      setAlert("link copied");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let timeoutId;

    if (alert) {
      timeoutId = setTimeout(() => {
        setAlert("");
      }, 1200);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [alert]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
        {alert && (
          <Box
            sx={{
              position: "absolute",
              top: 60,
              right: 0,
              padding: "5px",
              borderRadius: "4px",
              backgroundColor: "var(--color-secondary-2)",
              color: "#000",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon
              icon={faExclamationCircle}
              style={{ marginRight: "5px" }}
            />
            {alert}
          </Box>
        )}
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
          <>
            <Box
              sx={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                minWidth: "150px",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Typography variant="body1">
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
              <Button
                onClick={generateLink}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  whiteSpace: "nowrap",
                  color: "var(--color-secondary)",
                  padding: 0,
                  fontSize: "15px",
                }}
              >
                <FontAwesomeIcon
                  icon={faShareAlt}
                  style={{ marginRight: "10px" }}
                />
                Share
              </Button>
              <Button
                onClick={handleOpenDialog}
                sx={{
                  whiteSpace: "nowrap",
                  color: "var(--color-secondary)",
                  padding: 0,
                  fontSize: "15px",
                }}
              >
                {t("changePassword")}
              </Button>
              <IconButton
                onClick={handleLogoutFun}
                color="inherit"
                sx={{
                  p: 0,
                  justifyContent: "flex-start",
                  "& .MuiBox-root": {
                    flexDirection: "row !important",
                  },
                }}
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
          </>
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
              onClick={generateLink}
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
                  backgroundColor: "#000000",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  // alignItems: "center",
                  gap: "10px",
                  minWidth: "150px",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "clamp(0.625rem, -0.1563rem + 1.25vw, 0.9375rem)",
                    textAlign: "center",
                  }}
                >
                  {t("portfolioId")}: {session?.user?.username}
                </Typography>
                <Typography
                  sx={{
                    color: "var(--color-secondary)",
                    textTransform: "uppercase",
                    textAlign: "center",
                    // ml: "10px",
                  }}
                >
                  {sessionJotai?.user?.subscriptionPlan}
                </Typography>
                <LanguageSwitcher />
                <CurrencySwitcher />
                <Button
                  onClick={handleOpenDialog}
                  sx={{
                    whiteSpace: "nowrap",
                    color: "var(--color-secondary)",
                    justifyContent: "flex-start",
                    padding: "4px 8px",
                    fontSize: 15,
                    // fontWeight: 700,
                    "&:hover": {
                      backgroundColor: "#ffffff20",
                    },
                  }}
                >
                  {t("changePassword")}
                </Button>
                <IconButton
                  onClick={handleLogoutFun}
                  color="inherit"
                  sx={{ p: 0, justifyContent: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen={fullScreen}
        PaperProps={{
          component: "form",
          sx: {
            width: { xs: "100%", sm: "90%", md: "70%" },
            maxWidth: "600px",
            backgroundColor: "#111826",
            color: "white",
            // padding: "1rem",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {t("changePassword")}
        </DialogTitle>
        <DialogContent
          sx={{
            "& .MuiTypography-root": { color: "white" },
            "& .MuiFormControl-root": {
              mb: 2,
              "& .MuiFormHelperText-root": {
                color: "#ffffff", // Helper text color
              },
              "& .MuiFilledInput-input": {
                color: "#fff",
                "&::placeholder": {
                  color: "#fff",
                },
              },
              "& .MuiInputBase-root": {
                "&.MuiFilledInput-root": {
                  "&::after": {
                    borderBottom: "2px solid var(--color-secondary)",
                  },
                },
              },
              "& .MuiInputBase-input": {
                height: "1.6em",
              },
              "& .MuiFormLabel-root": {
                color: "#ffffff80",
                "&.MuiInputLabel-root.Mui-focused": {
                  color: "var(--color-secondary)",
                },
              },
              "& .MuiFilledInput-root": {
                borderRadius: "8px",
                backgroundColor: "#202530",
                border: "1px solid #ffffff80",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                "&.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffffff",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ffffff",
                },
              },
            },
          }}
        >
          {/* <DialogContentText>{t("changeText")}</DialogContentText> */}
          <TextField
            autoFocus
            required
            margin="dense"
            id="Name"
            name="Name"
            label={t("confirm")}
            type="text"
            fullWidth
            variant="filled"
            sx={{ mb: "1rem" }}
          />
          <TextField
            required
            margin="dense"
            id="EditPIN"
            name="EditPIN"
            label={t("new")}
            type="password"
            fullWidth
            variant="filled"
          />
        </DialogContent>
        <DialogActions
          sx={{
            "& .MuiButtonBase-root": {
              backgroundColor: "var(--color-secondary-2)",
              color: "#111826",
              margin: "1rem",
            },
          }}
        >
          <Button>{t("changePassword")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavbarLink;
