import * as React from "react";
import Box from "@mui/material/Box";
import { TextareaAutosize } from "@mui/base";
import { Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { portfolioAtom } from "../../app/stores/portfolioStore";

export default function Item4({ msg, setMsg }) {
  const t = useTranslations("item4");
  const [portfolio] = useAtom(portfolioAtom);

  const handleNotesSave = async () => {
    const userId = portfolio?.assetsCalculations.userId;
    const res = await fetch("/api/savePortfolioNotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, msg }),
    });

  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#202530",
        color: "white",
        height: "100%",
        borderRadius: "8px",
        padding: { xs: "15px", md: "25px" }, // Responsive padding
      }}
    >
      <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>
        {t("notes")}
      </Typography>
      <TextareaAutosize
        aria-label="empty textarea"
        placeholder={t("placeholder")}
        defaultValue={msg?.UserComment}
        maxRows={7}
        onChange={(e) => {
          const disallowedRegex = /[<>&"'\/\\:;|`~\x00-\x1F]/g;
          const sanitizedString = e.target.value.replace(
            disallowedRegex,
            function (match) {
              return "%" + match.charCodeAt(0).toString(16).toUpperCase();
            }
          );
          setMsg(sanitizedString);
        }}
        style={{
          width: "100%",
          resize: "none",
          marginTop: "15px",
          backgroundColor: "#00000033",
          borderRadius: "8px",
          padding: "10px",
          color: "white",
          border: "1px solid #ffffff33",
          outline: "none",
        }}
      />
      <TextareaAutosize
        aria-label="empty textarea"
        placeholder={t("placeholder")}
        defaultValue={msg?.MissingCoins}
        minRows={7}
        style={{
          width: "100%",
          resize: "none",
          marginTop: "15px",
          backgroundColor: "#00000033",
          borderRadius: "8px",
          padding: "10px",
          color: "white",
          border: "1px solid #ffffff33",
          outline: "none",
        }}
      />
      <Button sx={{
        marginTop: "20px",
        backgroundColor: "#1188ff",
        color: "white",
        fontSize: "0.8rem",
        "&:hover": { backgroundColor: "#0a549f" },
      }}
        onClick={handleNotesSave}>
        Save
      </Button>
    </Box>
  );
}
