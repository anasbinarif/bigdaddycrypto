"use client";
import { useEffect, useState, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Popper,
} from "@mui/material";
import { SessionProvider } from "next-auth/react";
import NavbarLink from "../navbar/Link";
import Link from "next/link";
import Image from "next/image";
import HomeIcon from "../../../public/assets/svg/Logo-03.svg";
import FormDialog from "../importPreviousDataDialog/FormDialog";
import { useTranslations } from "next-intl";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import styles from "./navbar.module.css";
import SubscribeDialog from "../../components/subscribeDialog/SubscribeDialog";
import { useAtom } from "jotai/index";
import { sessionAtom } from "../../app/stores/sessionStore";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = ({ tabSelector, setTabSelector }) => {
  const t = useTranslations("navbar");
  const [sessionJotai, setSession] = useAtom(sessionAtom);
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const isMobile = width < 992;
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState("nope");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const PopperMy = useCallback((props) => {
    const anchorEl = document.getElementById("hamMenu");

    return (
      <Popper
        {...props}
        anchorEl={anchorEl}
        style={{
          width: anchorEl.clientWidth,
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
        sx={{
          "& > .MuiPaper-root": {
            backgroundColor: "#1d1d1d",
          },
        }}
        placement="bottom-end"
      />
    );
  }, []);

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (sessionJotai) {
      setIsSubscribed(sessionJotai?.user?.subscribed ? "true" : "false");
    }
  }, [sessionJotai]);

  const handleAccountClick = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
    setAccountAnchorEl(null);
  };

  const handleGraphClick = (event) => {
    if (
      !sessionJotai?.user?.subscriptionPlan ||
      sessionJotai?.user?.subscriptionPlan === "free" ||
      sessionJotai?.user?.subscriptionPlan === "free+"
    ) {
      setAlertMessage(t("alertGraph"));
      setAlertOpen(true);
      event.preventDefault();
    }
  };

  const handleMediaClick = (event) => {
    if (
      !sessionJotai?.user?.subscriptionPlan ||
      sessionJotai?.user?.subscriptionPlan === "free" ||
      sessionJotai?.user?.subscriptionPlan === "free+"
    ) {
      setAlertMessage(
        "To access the Mediathek tab, please subscribe to one of our plans"
      );
      setAlertOpen(true);
      event.preventDefault();
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#111826",
          borderBottom: "1px solid #444444",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "clamp(0.625rem, -0.1563rem + 1.25vw, 0.9375rem)",
          }}
        >
          <Link style={{ display: "flex", alignItems: "center" }} href="/">
            <IconButton color="inherit">
              <Image
                src={HomeIcon}
                alt="Home Icon"
                style={{
                  width: "auto",
                  height: "35px",
                  cursor: "pointer",
                  padding: "2px",
                }}
              />
            </IconButton>
            {/* {!isMobile && (
              <Typography variant="body1" sx={{ ml: 1 }}>
                {t("companyName")}
              </Typography>
            )} */}
          </Link>
          {isSubscribed === "false" && <SubscribeDialog />}
          <SessionProvider>
            <FormDialog />
          </SessionProvider>
          {isMobile ? (
            <Box
              sx={{
                "& a": {
                  "@media only screen and (max-width:450px)": {
                    padding: "0.5rem !important",
                  },
                },
              }}
            >
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
              <IconButton color="inherit" onClick={handleMenuClick}>
                <MenuIcon />
              </IconButton>
              <Menu
                id="hamMenu"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(menuAnchorEl)}
                onClose={handleClose}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "rgb(32, 37, 48)",
                    color: "#ffffff",
                  },
                  fontSize: "clamp(0.625rem, -0.1563rem + 1.25vw, 0.9375rem)",
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Link href="/" className={styles.nav__link}>
                    {t("home")}
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link href="/faq" className={styles.nav__link}>
                    {t("faq")}
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    href="/media"
                    className={styles.nav__link}
                    onClick={handleGraphClick}
                  >
                    {t("media")}
                    <FontAwesomeIcon
                      icon={faCrown}
                      style={{
                        paddingLeft: "10px",
                        opacity: "0.5",
                        fontSize: "0.9rem",
                        marginRight: "15px",
                      }}
                      color={
                        sessionJotai?.user?.subscriptionPlan &&
                        sessionJotai?.user?.subscriptionPlan !== "free" &&
                        sessionJotai?.user?.subscriptionPlan !== "free+"
                          ? "gold"
                          : "grey"
                      }
                    />
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    href="/dashboard"
                    className={styles.nav__link}
                    // onClick={handleDashboardClick}
                  >
                    Dashboard
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    href="/assetsGraph"
                    onClick={handleGraphClick}
                    className={styles.nav__link}
                  >
                    {t("graph")}
                    <FontAwesomeIcon
                      icon={faCrown}
                      style={{
                        paddingLeft: "10px",
                        opacity: "0.5",
                        fontSize: "0.9rem",
                      }}
                      color={
                        sessionJotai?.user?.subscriptionPlan &&
                        sessionJotai?.user?.subscriptionPlan !== "free" &&
                        sessionJotai?.user?.subscriptionPlan !== "free+"
                          ? "gold"
                          : "grey"
                      }
                    />
                  </Link>
                </MenuItem>
              </Menu>
              <SessionProvider>
                <IconButton color="inherit" onClick={handleAccountClick}>
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(accountAnchorEl)}
                  onClose={handleClose}
                  sx={{
                    "& .MuiPaper-root": {
                      backgroundColor: "rgb(32, 37, 48)",
                      color: "#ffffff",
                    },
                    "& .MuiBox-root": {
                      display: "flex",
                      flexDirection: "column",

                      "& .MuiMenuItem-root": {
                        display: "flex",
                        flexDirection: "column",
                      },
                    },
                    fontSize: "clamp(0.625rem, -0.1563rem + 1.25vw, 0.9375rem)",
                  }}
                >
                  <NavbarLink mobileView={true} handleClose={handleClose} />
                </Menu>
              </SessionProvider>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "clamp(0.625rem, -0.1563rem + 1.25vw, 0.9375rem)",
              }}
            >
              <Link
                style={{ marginRight: "15px", fontFamily: "inherit" }}
                href="/"
                className={styles.nav__link}
              >
                {t("home")}
              </Link>
              <Link
                style={{ marginRight: "15px", fontFamily: "inherit" }}
                href="/faq"
                className={styles.nav__link}
              >
                {t("faq")}
              </Link>
              <Link
                style={{ marginRight: "15px", fontFamily: "inherit" }}
                href="/media"
                className={styles.nav__link}
                onClick={handleMediaClick}
              >
                {t("media")}
                <FontAwesomeIcon
                  icon={faCrown}
                  style={{
                    paddingLeft: "2px",
                    opacity: "0.5",
                    fontSize: "0.9rem",
                    // marginRight: "15px",
                  }}
                  color={
                    sessionJotai?.user?.subscriptionPlan &&
                    sessionJotai?.user?.subscriptionPlan !== "free" &&
                    sessionJotai?.user?.subscriptionPlan !== "free+"
                      ? "gold"
                      : "grey"
                  }
                />
              </Link>
              <Link
                style={{ marginRight: "15px", fontFamily: "inherit" }}
                href="/dashboard"
                // onClick={handleDashboardClick}
                className={styles.nav__link}
              >
                Dashboards
              </Link>

              <Box>
                <Link
                  style={{ marginRight: "0px", fontFamily: "inherit" }}
                  href="/assetsGraph"
                  onClick={handleGraphClick}
                  className={styles.nav__link}
                >
                  {t("graph")}
                </Link>
                <FontAwesomeIcon
                  icon={faCrown}
                  style={{
                    paddingLeft: "2px",
                    opacity: "0.5",
                    fontSize: "0.9rem",
                    marginRight: "15px",
                  }}
                  color={
                    sessionJotai?.user?.subscriptionPlan &&
                    sessionJotai?.user?.subscriptionPlan !== "free" &&
                    sessionJotai?.user?.subscriptionPlan !== "free+"
                      ? "gold"
                      : "grey"
                  }
                />
              </Box>
              <SessionProvider>
                <NavbarLink />
              </SessionProvider>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
