import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAtom } from "jotai/index";
import { sessionAtom } from "../../app/stores/sessionStore";
import { getUserPortfolio } from "../../lib/data";
import { portfolioAtom } from "../../app/stores/portfolioStore";
import { useTranslations } from "next-intl";

const FormDialog = () => {
  const t = useTranslations("formDialog");
  const [open, setOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [sessionJotai] = useAtom(sessionAtom);
  const [, setPortfolio] = useAtom(portfolioAtom);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setConfirmClose(true);
    setOpen(false);
  };

  const handleConfirmClose = async () => {
    setOpen(false);
    setConfirmClose(false);
    const userID = sessionJotai?.user.id;
    await fetch("/api/importPastUserDataCancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID }),
    });
  };

  useEffect(() => {
    console.log("sessionJotai-=-", sessionJotai);
  }, [sessionJotai]);

  const handleCancelClose = () => {
    setConfirmClose(false);
    setOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (sessionJotai) {
        const userID = sessionJotai?.user.id;
        const response = await fetch("/api/checkUserImportCancelState", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("hhhhhhhhhhhhhhhh", data);
          if (!data.pastUserCheck) {
            handleClickOpen();
          }
        }
      }
    };

    fetchData();
  }, [sessionJotai]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const { Name, EditPIN } = formJson;
    const userID = sessionJotai?.user.id;

    try {
      const response = await fetch("/api/importPastUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Name, EditPIN, userID }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data imported successfully", data.userPortfolios);
        handleConfirmClose();
        const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
        setPortfolio(userPortfolio.data);
      } else {
        handleConfirmClose();
        throw new Error("Failed to import data");
      }
    } catch (error) {
      handleConfirmClose();
      console.error("Error importing data:", error);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setConfirmClose(true)}
        fullScreen={fullScreen}
        PaperProps={{
          component: "form",
          onSubmit: handleFormSubmit,
          sx: {
            width: { xs: "100%", sm: "90%", md: "70%" },
            maxWidth: "600px",
          },
        }}
      >
        <DialogTitle>{t("importUserData")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("importInstructions")}</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="Name"
            name="Name"
            label={t("name")}
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="EditPIN"
            name="EditPIN"
            label={t("pin")}
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button type="submit">{t("import")}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmClose} onClose={handleCancelClose} fullScreen={fullScreen}>
        <DialogTitle>{t("confirmAction")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("confirmCloseMessage")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>{t("yes")}</Button>
          <Button onClick={handleCancelClose}>{t("no")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FormDialog;
