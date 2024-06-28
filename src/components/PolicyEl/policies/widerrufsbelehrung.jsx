import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Widerrufsbelehrung = () => {
  return (
    <>
      <Typography sx={{ fontSize: "2.5rem" }}>Widerrufsbelehrung</Typography>
      <List>
        <ListItem
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mb: "2rem",
          }}
        >
          <Box sx={{ mb: "2rem" }}>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Widerrufsrecht
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
              diesen Vertrag zu widerrufen.
            </Typography>
          </Box>
          <Box sx={{ mb: "2rem" }}>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Widerrufsfrist
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des
              Vertragsabschlusses.
            </Typography>
          </Box>
          <Box sx={{ mb: "2rem" }}>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Ausschluss des Widerrufsrechts
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Das Widerrufsrecht besteht nicht bei folgenden Verträgen:
              <List sx={{ m: "2rem 0" }}>
                <ListItem>
                  Verträge zur Lieferung von Waren, die nicht vorgefertigt sind
                  und für deren Herstellung eine individuelle Auswahl oder
                  Bestimmung durch den Verbraucher maßgeblich ist oder die
                  eindeutig auf die persönlichen Bedürfnisse des Verbrauchers
                  zugeschnitten sind.
                </ListItem>
                <ListItem>
                  Verträge zur Lieferung von digitalen Inhalten (Downloads), die
                  nicht auf einem körperlichen Datenträger geliefert werden,
                  wenn der Verbraucher ausdrücklich zugestimmt hat, dass mit der
                  Ausführung des Vertrags vor Ablauf der Widerrufsfrist begonnen
                  wird, und er seine Kenntnis davon bestätigt hat, dass er
                  dadurch sein Widerrufsrecht verliert.
                </ListItem>
                <ListItem>
                  Verträge über Abonnements, die den Zugang zu digitalen
                  Inhalten beinhalten, wenn der Verbraucher ausdrücklich
                  zugestimmt hat, dass mit der Ausführung des Vertrags vor
                  Ablauf der Widerrufsfrist begonnen wird, und er seine Kenntnis
                  davon bestätigt hat, dass er dadurch sein Widerrufsrecht
                  verliert.
                </ListItem>
              </List>
            </Typography>
          </Box>
        </ListItem>
      </List>
    </>
  );
};

export default Widerrufsbelehrung;
