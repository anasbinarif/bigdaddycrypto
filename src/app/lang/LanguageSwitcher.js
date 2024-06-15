import { MenuItem, Menu, Button, Box } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";

const LanguageSwitcher = () => {
  const t = useTranslations("Index");
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changeLanguage = (locale) => {
    const currentPathname = pathname || "";
    const newPathname = currentPathname.replace(/^\/[a-z]{2}/, `/${locale}`);
    const newUrl = `${newPathname}${searchParams ? `?${searchParams}` : ""}`;

    router.push(newUrl);
    handleClose();
  };

  return (
    <Box>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          color: "var(--color-secondary)",
          fontSize: "15px",
          width: "100%",
          padding: 0,
          justifyContent: "flex-start",
          // ml: 2,
        }}
      >
        {t("selectLanguage")}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#111826",
            color: "#ffffff",
          },
        }}
      >
        <MenuItem onClick={() => changeLanguage("en")}>
          <a style={{ textDecoration: "none", color: "inherit" }}>English</a>
        </MenuItem>
        <MenuItem onClick={() => changeLanguage("de")}>
          <a style={{ textDecoration: "none", color: "inherit" }}>Deutsch</a>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
