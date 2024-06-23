import { useRef, useState } from "react";

import {
  IconButton,
  Box,
  List,
  alpha,
  ListItem,
  Divider,
  Typography,
  ListItemText,
  Popover,
  styled,
  Button,
} from "@mui/material";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/navigation";
import { useTheme } from "@mui/material";

const SectionHeading = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.colors.textColor};
        display: block;
        padding: ${theme.spacing(2, 2, 0)};
        background: ${theme.colors.lightBackgroundColor};
`
);

function LanguageSwitcher() {
  const t = useTranslations();

  const theme = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (value) => {
    router.push(pathname, { locale: value });
  };

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        ref={ref}
        onClick={handleOpen}
        sx={{
          background: "#2bb982",
          color: "#232423",
          "&:hover": {
            background: "#41c397",
          },
        }}
      >
        {locale === "de" ? "DEUTSCH" : "ENGLISH"}
      </Button>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            maxWidth: 240,
          }}
        >
          <SectionHeading variant="body2">{t("selectLanguage")}</SectionHeading>
          <List
            sx={{
              p: 1,
              background: theme.colors.lightBackgroundColor,
              color: theme.colors.textColor,
            }}
            disablePadding={true}
            component="nav"
          >
            <ListItem
              className={locale === "en" || locale === "en-US" ? "active" : ""}
              button
              onClick={() => {
                onSelectChange("en");
                handleClose();
              }}
            >
              <ListItemText
                sx={{
                  pl: 1,
                }}
                primary="English"
              />
            </ListItem>
            <ListItem
              className={locale === "de" ? "active" : ""}
              onClick={() => {
                onSelectChange("de");
                handleClose();
              }}
              sx={{
                background: theme.colors.lightBackgroundColor,
              }}
            >
              <ListItemText
                sx={{
                  pl: 1,
                }}
                primary="Deutsch"
              />
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Popover>
    </>
  );
}

export default LanguageSwitcher;
