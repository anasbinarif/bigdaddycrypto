"use client";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import NavbarLink from "../navbar/Link";
import Link from "next/link";
import Image from "next/image";
import HomeIcon from "../../../public/assets/svg/bdc.svg";
import FormDialog from "../importPreviousDataDialog/FormDialog";
import { useTranslations } from "next-intl";

const Navbar = ({ tabSelector, setTabSelector }) => {
  const t = useTranslations("navbar");

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
          <Typography variant="body1" sx={{ ml: 1 }}>
            {t("companyName")}
          </Typography>
        </Link>
        <FormDialog />
        <Box
          style={{
            marginLeft: "auto",
            marginRight: "15px",
            fontFamily: "sans-serif",
          }}
        >
          <Link
            style={{ marginRight: "15px", fontFamily: "inherit" }}
            href={"/"}
          >
            {t("home")}
          </Link>
          <Link
            style={{ marginRight: "15px", fontFamily: "inherit" }}
            href={"/faq"}
          >
            {t("faq")}
          </Link>
          <Link
            style={{ marginRight: "15px", fontFamily: "inherit" }}
            href={"/media"}
          >
            {t("media")}
          </Link>
          <Link
            style={{ marginRight: "15px", fontFamily: "inherit" }}
            href={"/assetsGraph"}
          >
            {t("graph")}
          </Link>
        </Box>
        <SessionProvider>
          <NavbarLink />
        </SessionProvider>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
