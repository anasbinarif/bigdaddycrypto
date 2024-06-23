import React, { forwardRef } from "react";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Fullscreen } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRightAltSharp } from "@mui/icons-material";

export const StyleThemeButton = forwardRef(
  ({ text, extraStyles, ...props }, ref) => {
    const t = useTranslations();
    const StyledButton = styled(Button)(({ theme }) => ({
      background: theme.colors.lightBackgroundColor,
      width: "150px",
      fontSize: "9px",
      color: theme.colors.textColor,
      marginLeft: "auto",
      marginRight: "auto",
      "&:hover": {
        background: theme.colors.lightBackgroundColor,
      },
      position: "absolute",
      bottom: "1%",
      left: " 50%",
      transform: "translateX(-50%)",
      ...extraStyles, // Apply any extra styles passed through props
    }));

    return (
      <StyledButton
        variant="contained"
        size="small"
        endIcon={<ZoomOutIcon />}
        style={{ display: "none", alignItems: "center" }}
        ref={ref} // Forward the ref to the Button component
        {...props} // Pass additional props to the Button component
      >
        {/* {text} */}
        {t("Zoom zurücksetzen")}
      </StyledButton>
    );
  }
);

export const StylePDFButton = forwardRef(
  ({ text, extraStyles, ...props }, ref) => {
    const StyledButton = styled(Button)(({ theme }) => ({
      background: theme.colors.lightBackgroundColor,
      width: "150px",
      fontSize: "9px",
      m: 3,
      color: theme.colors.textColor,
      "&:hover": {
        background: theme.colors.lightBackgroundColor,
      },
      ...extraStyles, // Apply any extra styles passed through props
    }));

    return (
      <StyledButton
        variant="contained"
        size="medium"
        endIcon={<PictureAsPdfIcon />}
        style={{ display: "flex", alignItems: "center" }}
        ref={ref} // Forward the ref to the Button component
        {...props} // Pass additional props to the Button component
      >
        {text}
      </StyledButton>
    );
  }
);

export const StyleResetButton = forwardRef(
  ({ text, extraStyles, ...props }, ref) => {
    const t = useTranslations();
    const StyledButton = styled(Button)(({ theme }) => ({
      background: theme.colors.lightBackgroundColor,
      width: "150px",
      fontSize: "9px",
      color: theme.colors.textColor,
      // border: `1px dash ${theme.colors.textColor}`,
      "&:hover": {
        background: theme.colors.lightBackgroundColor,
      },
      ...extraStyles, // Apply any extra styles passed through props
    }));

    return (
      <StyledButton
        variant="contained"
        size="medium"
        endIcon={<RotateLeftIcon />}
        style={{ display: "flex", alignItems: "center" }}
        ref={ref} // Forward the ref to the Button component
        {...props} // Pass additional props to the Button component
      >
        {t("Sortierung zurücksetzen")}
      </StyledButton>
    );
  }
);

export const StyleExcelButton = forwardRef(
  ({ text, extraStyles, ...props }, ref) => {
    const StyledButton = styled(Button)(({ theme }) => ({
      background: theme.colors.lightBackgroundColor,
      width: "auto",
      fontSize: "9px",
      m: 3,
      color: theme.colors.textColor,
      "&:hover": {
        background: theme.colors.lightBackgroundColor,
      },
      ...extraStyles, // Apply any extra styles passed through props
    }));

    return (
      <StyledButton
        variant="contained"
        size="medium"
        endIcon={<FileDownloadIcon />}
        style={{ display: "flex", alignItems: "center" }}
        ref={ref} // Forward the ref to the Button component
        {...props} // Pass additional props to the Button component
      >
        {text}
      </StyledButton>
    );
  }
);

export const StyleFullScreen = forwardRef(({ extraStyles, ...props }, ref) => {
  const StyledButton = styled(IconButton)(({ theme }) => ({
    background: theme.colors.lightBackgroundColor,
    width: "min-content",
    fontSize: "9px",
    // m: 3,
    m: 0,
    p: 0,
    color: theme.colors.textColor,
    "&:hover": {
      background: theme.colors.lightBackgroundColor,
    },
    ...extraStyles, // Apply any extra styles passed through props
  }));

  return (
    <StyledButton
      variant="text"
      size="small"
      style={{ display: "flex", alignItems: "center", p: 0, m: 0 }}
      ref={ref} // Forward the ref to the Button component
      {...props} // Pass additional props to the Button component
    >
      <Fullscreen />
    </StyledButton>
  );
});

export const StyleExitFullScreen = forwardRef(
  ({ extraStyles, ...props }, ref) => {
    const StyledButton = styled(IconButton)(({ theme }) => ({
      background: theme.colors.lightBackgroundColor,
      width: "min-content",
      fontSize: "9px",
      // m: 3,
      m: 0,
      p: 0,
      color: theme.colors.textColor,
      "&:hover": {
        background: theme.colors.lightBackgroundColor,
      },
      ...extraStyles, // Apply any extra styles passed through props
    }));

    return (
      <StyledButton
        variant="text"
        size="small"
        style={{ display: "flex", alignItems: "center", p: 0, m: 0 }}
        ref={ref} // Forward the ref to the Button component
        {...props} // Pass additional props to the Button component
      >
        <CloseIcon />
      </StyledButton>
    );
  }
);

export const StyledNavigateButton = forwardRef(
  ({ text, extraStyles, href, ...props }, ref) => {
    const t = useTranslations();
    const StyledButton = styled(Button)(({ theme }) => ({
      background: theme.colors.lightBackgroundColor,
      width: "150px",
      fontSize: "9px",
      color: theme.colors.textColor,
      // border: `1px dash ${theme.colors.textColor}`,
      "&:hover": {
        background: theme.colors.lightBackgroundColor,
      },
      ...extraStyles, // Apply any extra styles passed through props
    }));

    return (
      <Link href={href}>
        <StyledButton
          variant="contained"
          size="medium"
          endIcon={<ArrowRightAltSharp />}
          style={{ display: "flex", alignItems: "center" }}
          ref={ref} // Forward the ref to the Button component
          {...props} // Pass additional props to the Button component
        >
          {text}
        </StyledButton>
      </Link>
    );
  }
);

StylePDFButton.displayName = "StylePDFButton";

StyleThemeButton.displayName = "StyleThemeButton";

StyleResetButton.displayName = "StyleResetButton";

StyleExcelButton.displayName = "StyleExcelButton";

StyleFullScreen.displayName = "StyleFullScreen";

StyleExitFullScreen.displayName = "StyleExitFullScreen";

StyledNavigateButton.displayName = "StyledNavigateButton";
