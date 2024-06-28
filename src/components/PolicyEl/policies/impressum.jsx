import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Impressum = () => {
  return (
    <>
      <Typography sx={{ fontSize: "2.5rem" }}>Impressum</Typography>
      <List>
        <ListItem
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mb: "2rem",
          }}
        >
          <ListItemText
            sx={{
              mb: "1.5rem",
              "& .MuiTypography-root": {
                fontWeight: "bold",
                fontSize: "1.5rem",
              },
            }}
          >
            Angaben gemäß § 5 TMG
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Cryptoverse Solutions GbR
              <br style={{ marginBottom: "1rem" }}></br>
              Kirchhuchtinger Landstr. 144A,
              <br />
              28259 Bremen,
              <br />
              Deutschland
            </Typography>
          </Box>

          <Box sx={{ mb: "2rem" }}>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Vertreten durch:
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Ebrahim Gholamhosseinnejad
            </Typography>
          </Box>
          <Box sx={{ mb: "2rem" }}>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Kontakt:
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Telefon: +49 177 924294
              <br />
              E-Mail: info@koinfolio.com
            </Typography>
          </Box>
        </ListItem>
        <ListItem
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mb: "2rem",
          }}
        >
          <ListItemText
            sx={{
              mb: "1.5rem",
              "& .MuiTypography-root": {
                fontWeight: "bold",
                fontSize: "1.5rem",
              },
            }}
          >
            Haftung für Inhalte
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Ebrahim Gholamhosseinnejad haftet als alleiniger Geschäftsführer
              für die Inhalte auf dieser Webseite. Trotz sorgfältiger Erstellung
              der Inhalte übernehmen wir keine Gewähr für die Richtigkeit,
              Vollständigkeit und Aktualität der Inhalte. Als Diensteanbieter
              sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG
              sind wir als Diensteanbieter jedoch nicht verpflichtet,
              übermittelte oder gespeicherte fremde Informationen zu überwachen
              oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung
              der Nutzung von Informationen nach den allgemeinen Gesetzen
              bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
              erst ab dem Zeitpunkt der Kenntnis einer konkreten
              Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
              Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </Typography>
          </Box>
        </ListItem>
        <ListItem
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mb: "2rem",
          }}
        >
          <ListItemText
            sx={{
              mb: "1.5rem",
              "& .MuiTypography-root": {
                fontWeight: "bold",
                fontSize: "1.5rem",
              },
            }}
          >
            Haftung für Links
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Unser Angebot enthält Links zu externen Websites Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
              wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
              überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle
              der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
              Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
              Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </Typography>
          </Box>
        </ListItem>
        <ListItem
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mb: "2rem",
          }}
        >
          <ListItemText
            sx={{
              mb: "1.5rem",
              "& .MuiTypography-root": {
                fontWeight: "bold",
                fontSize: "1.5rem",
              },
            }}
          >
            Urheberrecht
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht
              kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser
              Seite nicht vom Betreiber erstellt wurden, werden die
              Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
              Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
              Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
              entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
              werden wir derartige Inhalte umgehend entfernen.
            </Typography>
          </Box>
        </ListItem>
        <ListItem
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mb: "2rem",
          }}
        >
          <ListItemText
            sx={{
              mb: "1.5rem",
              "& .MuiTypography-root": {
                fontWeight: "bold",
                fontSize: "1.5rem",
              },
            }}
          >
            Streitschlichtung
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:
              https://ec.europa.eu/consumers/odr. Unsere E-Mail-Adresse finden
              Sie oben im Impressum.
              <br style={{ marginBottom: "1rem" }}></br>
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </Typography>
          </Box>
        </ListItem>
      </List>
    </>
  );
};

export default Impressum;
