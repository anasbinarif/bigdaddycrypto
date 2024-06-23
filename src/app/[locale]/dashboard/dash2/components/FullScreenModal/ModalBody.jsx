import { styled, Modal as MuiModal, Box } from "@mui/material";

export const Modal = styled(MuiModal)(() => ({}));

export const ModalBody = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  padding: "50px",

  backgroundColor: theme.colors.lightBackgroundColor,
  borderRadius: 15,
  overflowY: "auto",
  maxHeight: "calc(100% - 64px)",

  [theme.breakpoints.down("sm")]: {
    width: "95%",
  },

  [theme.breakpoints.between("sm", "md")]: {
    width: "70%",
  },

  [theme.breakpoints.between("md", "lg")]: {
    width: "40%",
  },

  [theme.breakpoints.between("lg", "xl")]: {
    width: "40%",
  },

  [theme.breakpoints.up("xl")]: {
    width: "40%",
  },

  // custom scrollbar styles
  "::-webkit-scrollbar": {
    width: "10px",
  },
  "::-webkit-scrollbar-track": {
    backgroundColor: theme.colors.lightBackgroundColor,
    borderRadius: 5,
    margin: theme.spacing(3, 0),
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: theme.colors.lightBackgroundColor,
    borderRadius: 5,
  },
}));

export const ModalFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
}));
