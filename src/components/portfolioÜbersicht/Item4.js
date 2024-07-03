import * as React from "react";
import Box from "@mui/material/Box";
import { TextareaAutosize } from "@mui/base";
import { Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { portfolioAtom } from "../../app/stores/portfolioStore";
import { getUserPortfolio } from "../../lib/data";
import { sessionAtom } from "../../app/stores/sessionStore";

function desanitizeString(sanitizedString = "") {
  // Regular expression to match encoded characters in the sanitized string
  const encodedRegex = /%[0-9A-F]{2}/g;

  // Replace encoded characters with their original counterparts
  const originalString = sanitizedString.replace(
    encodedRegex,
    function (match) {
      // Extract the hexadecimal code from the match (e.g., "%3C" -> "3C")
      const hexCode = match.substring(1); // Remove the "%"

      // Convert hexadecimal code to character and return
      return String.fromCharCode(parseInt(hexCode, 16));
    }
  );

  return originalString;
}

export default function Item4({ preCalcComment, msg, setMsg }) {
  const t = useTranslations("item4");
  const [sessionJotai] = useAtom(sessionAtom);
  const [portfolio, setPortfolio] = useAtom(portfolioAtom, { assets: [] });

  console.log(preCalcComment);

  const handleNotesSave = async () => {
    const userId = portfolio?.assetsCalculations.userId;
    console.log("msgmsg", msg);
    const res = await fetch("/api/savePortfolioNotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, msg }),
    });
    if (res.ok) {
      const userPortfolio = await getUserPortfolio(sessionJotai?.user.id);
      setPortfolio(userPortfolio?.data);
    }
  };
  console.log(1);

  const handleUserCommentChange = (e) => {
    const disallowedRegex = /[<>&"'\/\\:;|`~\x00-\x1F]/g;
    const sanitizedString = e.target.value.replace(
      disallowedRegex,
      function (match) {
        return "%" + match.charCodeAt(0).toString(16).toUpperCase();
      }
    );
    setMsg((prevMsg) => ({ ...prevMsg, UserComment: sanitizedString }));
  };

  const handleMissingCoinsChange = (e) => {
    // const disallowedRegex = /[<>&"'\/\\:;|`~\x00-\x1F]/g;
    // const sanitizedString = e.target.value.replace(
    //   disallowedRegex,
    //   function (match) {
    //     return "%" + match.charCodeAt(0).toString(16).toUpperCase();
    //   }
    // );
    setMsg((prevMsg) => ({ ...prevMsg, MissingCoins: e.target.value }));
  };

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
        aria-label="user comment textarea"
        placeholder={t("placeholder")}
        value={preCalcComment?.UserComment || msg?.UserComment}
        maxRows={7}
        onChange={(e) => {
          if (preCalcComment?.MissingCoins) return;
          handleUserCommentChange(e);
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
        aria-label="missing coins textarea"
        placeholder={t("placeholder")}
        value={
          desanitizeString(preCalcComment?.MissingCoins) ||
          desanitizeString(msg?.MissingCoins)
        }
        minRows={7}
        onChange={(e) => {
          if (preCalcComment?.MissingCoins) return;
          handleMissingCoinsChange(e);
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
      {!preCalcComment && (
        <Button
          sx={{
            marginTop: "20px",
            backgroundColor: "#1188ff",
            color: "white",
            fontSize: "0.8rem",
            "&:hover": { backgroundColor: "#0a549f" },
          }}
          onClick={handleNotesSave}
        >
          Save
        </Button>
      )}
    </Box>
  );
}
