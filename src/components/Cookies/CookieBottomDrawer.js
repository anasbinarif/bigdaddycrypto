import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Divider, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { sessionAtom } from "../../app/stores/sessionStore";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function CookieBottomDrawer({ setLoading }) {
  const [open, setOpen] = React.useState(true);
  const [sessionJotai] = useAtom(sessionAtom);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const handleAcceptAll = () => {
    console.log("Accepted all cookies");
    const userID = sessionJotai?.user.id;
    const res = fetch("/api/acceptCookies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID }),
    });
    setOpen(false);
  };

  const handleRejectAll = async () => {
    console.log("Rejected all cookies");
    setOpen(false);
    setLoading(true);
    await signOut({ redirect: true, callbackUrl: "/login" });
    setLoading(false);
  };

  const drawerContent = (
    <Box
      sx={{
        width: "auto",
        padding: 2,
        backgroundColor: "#111826",
        color: "white",
      }}
      role="presentation"
      //   onKeyDown={toggleDrawer(false)}
    >
      {/* <IconButton
        sx={{ position: "absolute", right: 8, top: 8 }}
        onClick={toggleDrawer(false)}
      >
        <CloseIcon />
      </IconButton> */}
      <Box sx={{ marginTop: 4, marginBottom: 2, padding: "0 2rem" }}>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold", mb: "1rem" }}>
          Cookies Hinweis
        </Typography>
        <Typography sx={{ mb: "2rem" }}>
          Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern,
          personalisierter Content oder Inhalte bereitzustellen und unseren
          Datenverkehr zu analysieren. Durch Klicken auf "Alle akzeptieren"
          stimmen Sie der Verwendung von Cookies zu.
        </Typography>
        <Typography sx={{ "& a:hover": { textDecoration: "underline" } }}>
          Weitere Informationen finden Sie unter{" "}
          <Link
            href="/en/policy/datenschutz"
            style={{ color: "var(--color-secondary)" }}
            target="_blank"
          >
            Datenschutz.
          </Link>
        </Typography>
      </Box>
      {/* <Divider /> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          padding: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAcceptAll}
          sx={{
            backgroundColor: "var(--color-secondary)",
            color: "black",
            "&:hover": { backgroundColor: "var(--color-secondary-2)" },
          }}
        >
          Accept All
        </Button>
        <Button
          //   variant="contained"
          //   color="secondary"
          onClick={handleRejectAll}
          sx={{ color: "var(--color-secondary)" }}
        >
          Reject
        </Button>
      </Box>
    </Box>
  );

  return (
    <div>
      <Drawer anchor="bottom" open={open} sx={{ zIndex: "1500" }}>
        {drawerContent}
      </Drawer>
    </div>
  );
}
