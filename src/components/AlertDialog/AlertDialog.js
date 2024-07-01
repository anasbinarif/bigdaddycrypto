import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

const DeleteConfirmationDialog = ({
  open,
  handleClose,
  handleDeleteConfirm,
  asset,
}) => {
  const t = useTranslations("deleteDialog");
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      sx={{
        "& .MuiPaper-root": {
          color: "#ffffff",
          backgroundColor: "rgb(32, 37, 48)",
          maxWidth: "none",
          padding: "2rem 2.5rem",
        },
      }}
    >
      <DialogTitle
        id="delete-dialog-title"
        sx={{ fontWeight: "bold", padding: 0, mb: "1rem" }}
      >
        {t("heading")}
      </DialogTitle>
      <DialogContent
        sx={{
          padding: 0,
          mb: "1.5rem",
          "& .MuiTypography-root": {
            color: "#ffffff",
          },
          "& .MuiDialogContent-root": {},
        }}
      >
        <DialogContentText id="delete-dialog-description" sx={{ padding: 0 }}>
          {t("text1")} <strong>{asset?.Ticker || "All assets"}</strong>{" "}
          {t("text2")}{" "}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: 0 }}>
        <Button onClick={handleClose} sx={{ color: "var(--color-secondary)" }}>
          {t("cancel")}
        </Button>
        <Button
          onClick={handleDeleteConfirm}
          autoFocus
          sx={{ backgroundColor: "var(--color-secondary-2)", color: "#000" }}
        >
          {t("confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
