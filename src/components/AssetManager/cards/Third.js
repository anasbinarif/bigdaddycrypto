import { Box, Divider, Typography } from "@mui/material";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Third = ({ portfolio, loadingPortfolio }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#202530",
        color: "white",
        height: "100%",
        borderRadius: "8px",
        padding: "25px",
      }}
    >
      <Box sx={{ fontSize: "120%", fontWeight: "bold" }}>
        Portfolio-Überblick
        <FontAwesomeIcon
          icon={faCrown}
          style={{ paddingLeft: "10px", opacity: "0.25", fontSize: "0.9rem" }}
        />
      </Box>
      <Divider />
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
            Aktueller Profit
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
            17.000,00 €
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "0.9rem", opacity: "0.5" }}>
            Bisher realisiert
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
            17.000,00 €
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "0.9rem", opacity: "0.5" }}>
            Gesamtpotenzial
            <FontAwesomeIcon
              icon={faQuestionCircle}
              style={{ opacity: "0.5", marginLeft: "0.5rem" }}
            />
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
            17.000,00 €
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Third;
