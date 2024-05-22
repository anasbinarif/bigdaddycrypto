"use client";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { SessionProvider } from "next-auth/react";
import NavbarLink from "../navbar/Link";
import Link from "next/link";
import Image from "next/image";
import HomeIcon from "../../../public/assets/svg/bdc.svg";
import FormDialog from "../importPreviousDataDialog/FormDialog";
import { useTranslations } from "next-intl";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import styles from "./navbar.module.css";

const Navbar = ({ tabSelector, setTabSelector }) => {
  const t = useTranslations("navbar");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleAccountClick = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
    setAccountAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#111826",
        borderBottom: "1px solid #444444",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link style={{ display: "flex", alignItems: "center" }} href="/">
          <IconButton color="inherit">
            <Image
              src={HomeIcon}
              alt="Home Icon"
              style={{
                width: "auto",
                height: "35px",
                cursor: "pointer",
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "2px",
              }}
            />
          </IconButton>
          {!isMobile && (
            <Typography variant="body1" sx={{ ml: 1 }}>
              {t("companyName")}
            </Typography>
          )}
        </Link>
        <FormDialog />
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={handleMenuClick}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
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
                <Link href="/media" className={styles.nav__link}>
                  {t("media")}
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/assetsGraph" className={styles.nav__link}>
                  {t("graph")}
                </Link>
              </MenuItem>
            </Menu>
            <SessionProvider>
              <IconButton color="inherit" onClick={handleAccountClick}>
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={accountAnchorEl}
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
              >
                <NavbarLink mobileView={true} handleClose={handleClose} />
              </Menu>
            </SessionProvider>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
            >
              {t("media")}
            </Link>
            <Link
              style={{ marginRight: "15px", fontFamily: "inherit" }}
              href="/assetsGraph"
              className={styles.nav__link}
            >
              {t("graph")}
            </Link>
            <SessionProvider>
              <NavbarLink />
            </SessionProvider>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
