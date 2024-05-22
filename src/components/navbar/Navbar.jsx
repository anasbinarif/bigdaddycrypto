"use client";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import NavbarLink from "../navbar/Link";
import Link from "next/link";
import Image from "next/image";
import HomeIcon from "../../../public/assets/svg/bdc.svg";
import FormDialog from "../importPreviousDataDialog/FormDialog";
import { useTranslations } from "next-intl";
import styles from "./navbar.module.css";
import { useRouter } from "next/navigation";

const Navbar = ({ tabSelector, setTabSelector }) => {
  const t = useTranslations("navbar");
  const router = useRouter();
  // const path = router;
  // console.log(path);

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
            // marginRight: "15px",
            fontFamily: "sans-serif",
          }}
        >
          <Link className={styles.nav__link} href={"/"}>
            {t("home")}
          </Link>
          <Link className={styles.nav__link} href={"/faq"}>
            {t("faq")}
          </Link>
          <Link className={styles.nav__link} href={"/media"}>
            {t("media")}
          </Link>
          <Link className={styles.nav__link} href={"/assetsGraph"}>
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
