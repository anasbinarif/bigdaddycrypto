import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useLanguage } from "./LanguageContext";

const LanguageSwitcher = () => {
  const { currentLanguage, switchLanguage, languageData } = useLanguage();
  const [open, setOpen] = useState(false);

  console.log(languageData);

  return (
    <Box
      sx={{
        margin: "1rem",
        padding: "0.75rem 1rem",
        width: "fit-content",
        backgroundColor: "#00000030",
        border: "2px solid var(--color-secondary-2)",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textTransform: "uppercase",
        position: "relative",
        color: "white",
        cursor: "pointer",
      }}
      onClick={() => setOpen(!open)}
    >
      {currentLanguage}
      <Box
        sx={{
          display: open ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          top: "100%",
          left: 0,
          textTransform: "uppercase",
          borderRadius: "4px",
          overflow: "hidden",
          backgroundColor: "#00000030",
        }}
      >
        <Button
          sx={{
            padding: "10px",
            color: "white",
            width: "100%",
            borderRadius: "0",
          }}
          onClick={() =>
            currentLanguage !== "english" && switchLanguage("english")
          }
        >
          english
        </Button>
        <Button
          sx={{
            padding: "10px",
            backgroundColor: "#00000030",
            color: "white",
            width: "100%",
            borderRadius: "none",
          }}
          onClick={() =>
            currentLanguage !== "deutsch" && switchLanguage("deutsch")
          }
        >
          Deutsch
        </Button>
      </Box>
    </Box>
  );
};

export default LanguageSwitcher;
