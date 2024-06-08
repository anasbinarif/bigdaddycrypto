import * as React from "react";
import Box from "@mui/material/Box";
import { TextareaAutosize } from "@mui/base";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Item4({ msg, setMsg }) {
  const t = useTranslations("item4");

  console.log(msg);
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
        defaultValue={msg}
        maxRows={7}
        onChange={(e) => {
          setMsg(e.target.value);
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
        defaultValue={`Pullix (PLX) : 18312 coin gekauft um 1000€
        Loop: 66984 coin  
        `}
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
    </Box>
  );
}
