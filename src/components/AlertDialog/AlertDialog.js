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

const DeleteConfirmationDialog = ({
  open,
  handleClose,
  handleDeleteConfirm,
  asset,
}) => {
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
        Asset löschen
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
          Bist du dir sicher, dass du dieses Asset{" "}
          <strong>{asset?.Ticker}</strong> aus deinem Portfolio löschen
          möchtest?{" "}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: 0 }}>
        <Button onClick={handleClose} sx={{ color: "var(--color-secondary)" }}>
          Abbrechen
        </Button>
        <Button
          onClick={handleDeleteConfirm}
          autoFocus
          sx={{ backgroundColor: "var(--color-secondary-2)", color: "#000" }}
        >
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
