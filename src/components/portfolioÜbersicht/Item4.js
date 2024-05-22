import * as React from "react";
import Box from "@mui/material/Box";
import { TextareaAutosize } from "@mui/base";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Item4() {
    const t = useTranslations("item4");

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
                defaultValue={`Hallo Big Daddy

Könntest du dir das mal bitte ansehen.
verfolge dich schon länger auf deinen Youtube Kanal .
würdest du hier das Portfolio ändern oder so lassen.
ich halte meine Coins schon länger aber so richtig in Schwung bin ich noch nicht gekommen.
Im November war ich auf 19.000€  
wäre cool wenn du mir da hälfen könntest 
dank dir.
Beste Grüße Jens  
        `}
                maxRows={7}
                style={{
                    width: "100%",
                    resize: "none",
                    marginTop: "15px",
                    backgroundColor: "#00000033",
                    borderRadius: "8px",
                    padding: "10px", // Added padding for better text appearance
                    color: "white", // Ensure text color is white
                    border: "1px solid #ffffff33", // Optional: Adding a border for better visibility
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
                }}
            />
        </Box>
    );
}
