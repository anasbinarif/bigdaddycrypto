import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { DonutCard } from "@/components/portfolioGenerator/cards/donutCard/DonutCard";
import BewertungCard from "@/components/portfolioGenerator/cards/Bewertung";
import GridExample from "@/components/portfolioÜbersicht/portfolioTable/Table";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Item1() {
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#202530",
        color: "white",
        height: "100%",
        borderRadius: "2px",
        padding: "25px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#202530",
          color: "white",
          height: "100%",
          width: "50%",
          borderRadius: "2px",
          //   padding: "25px",
        }}
      >
        <Box sx={{ fontSize: "120%", fontWeight: "bold" }}>
          Portfolio-Überblick
          <FontAwesomeIcon
            icon={faCrown}
            style={{ paddingLeft: "10px", opacity: "0.25", fontSize: "0.9rem" }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            //   alignItems: "center",
            backgroundColor: "#00000033",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>Gesamtwert</Typography>
          <Typography sx={{ fontSize: "2rem", fontWeight: "bold" }}>
            0,00 €
          </Typography>
          <Typography
            className="down"
            sx={{
              "&.down": {
                color: "red",
              },

              "&.up": {
                color: "green",
              },

              "&.down:before": {
                content: '"▼ "',
                fontSize: "80%",
                marginRight: "3px",
              },

              "&.up:before": {
                content: '"▲ "',
                fontSize: "80%",
                marginRight: "3px",
              },
            }}
          >
            -100.0%
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#00000033",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: "0.9rem", opacity: "0.5" }}>
              Gesamt Invest
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
              17.000,00 €
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: "0.9rem", opacity: "0.5" }}>
              Gesamt Invest
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
              17.000,00 €
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: "2rem", fontWeight: "bold" }}>0</Typography>
        <Typography sx={{ fontSize: "1rem" }}>assets</Typography>
      </Box>
    </Box>
  );
}
