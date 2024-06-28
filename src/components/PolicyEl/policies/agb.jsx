import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Agb = () => {
  return (
    <>
      <Typography sx={{ fontSize: "2.5rem" }}>
        Allgemeine Geschäftsbedingungen (AGB)
      </Typography>
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
            § 1 Geltungsbereich
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Diese AGB gelten für alle Verträge, die über die Webseite der
              Cryptoverse Solutions GbR mit Kunden abgeschlossen werden.
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
            § 2 Vertragspartner
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Der Vertrag kommt zustande mit der Cryptoverse Solutions GbR,
              vertreten durch Ebrahim Gholamhosseinnejad.
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
            § 3 Vertragsabschluss
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Die Darstellung der Dienstleistungen auf der Webseite stellt kein
              rechtlich bindendes Angebot, sondern eine Aufforderung zur
              Bestellung dar.
              <br style={{ marginBottom: "1rem" }}></br>
              Durch Anklicken des Buttons "Bestellen" geben Sie eine
              verbindliche Bestellung der im Warenkorb enthaltenen
              Dienstleistungen ab. Der Vertrag kommt zustande, wenn wir Ihre
              Bestellung durch eine Auftragsbestätigung per E-Mail unmittelbar
              nach dem Erhalt Ihrer Bestellung annehmen.
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
            § 4 Widerrufsrecht
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Verbraucher haben ein vierzehntägiges Widerrufsrecht.
              <br style={{ marginBottom: "1rem" }}></br>
              Nähere Informationen zum Widerrufsrecht finden Sie in unserer
              Widerrufsbelehrung.
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
            § 5 Preise und Zahlungsbedingungen
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Die auf der Webseite genannten Preise enthalten die gesetzliche
              Mehrwertsteuer und sonstige Preisbestandteile.
              <br style={{ marginBottom: "1rem" }}></br>
              Die Zahlung erfolgt wahlweise per Kreditkarte, PayPal oder
              Sofortüberweisung.
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
            § 6 Erbringung der Dienstleistungen
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Die Erbringung der Dienstleistungen erfolgt digital. Videos und
              andere digitale Inhalte werden nach individueller Absprache mit
              dem Kunden erstellt.
              <br style={{ marginBottom: "1rem" }}></br>
              Die Lieferzeit hängt von der Auftragslage und der spezifischen
              Vereinbarung mit dem Kunden ab. Wir setzen uns mit Ihnen in
              Verbindung, um den Liefertermin abzustimmen.
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
            § 7 Abonnements
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Bei Abschluss eines Abonnements wird der Vertrag auf unbestimmte
              Zeit geschlossen und kann von beiden Parteien mit einer Frist von
              einem Monat zum Ende der Mindestlaufzeit schriftlich gekündigt
              werden.
              <br style={{ marginBottom: "1rem" }}></br>
              Die Kündigung des Abonnements kann schriftlich oder per E-Mail
              erfolgen.
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
            § 8 Gewährleistung und Haftung
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              <List sx={{ m: "2rem 0 0" }}>
                <ListItem>
                  Die Cryptoverse Solutions GbR haftet unbeschränkt für Schäden,
                  die auf einer vorsätzlichen oder grob fahrlässigen
                  Pflichtverletzung durch die Gesellschaft oder ihre
                  gesetzlichen Vertreter oder Erfüllungsgehilfen beruhen.
                </ListItem>
                <ListItem>
                  Bei leicht fahrlässigen Pflichtverletzungen haften wir nur für
                  den vorhersehbaren, vertragstypischen Schaden, sofern eine
                  Pflicht verletzt wird, deren Einhaltung für die Erreichung des
                  Vertragszwecks von besonderer Bedeutung ist (Kardinalpflicht).
                </ListItem>
                <ListItem>
                  Eine weitergehende Haftung ist ausgeschlossen. Insbesondere
                  haften die anderen Gesellschafter der Cryptoverse Solutions
                  GbR nicht persönlich für Verbindlichkeiten der Gesellschaft,
                  außer bei Vorsatz und grober Fahrlässigkeit.
                </ListItem>
                <ListItem>
                  Die vorstehenden Haftungsbeschränkungen gelten nicht bei
                  Verletzung von Leben, Körper und Gesundheit.
                </ListItem>
              </List>
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
            § 9 Freistellung
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              <List sx={{ m: "2rem 0 0" }}>
                <ListItem>
                  brahim Gholamhosseinnejad stellt die übrigen Gesellschafter
                  von allen Forderungen, Kosten und Aufwendungen frei, die im
                  Zusammenhang mit der Gesellschaft entstehen.
                </ListItem>
                <ListItem>
                  Sollte ein Gesellschafter aufgrund externer Ansprüche in
                  Anspruch genommen werden, hat dieser das Recht, die
                  entstandenen Kosten von Ebrahim Gholamhosseinnejad
                  zurückzufordern. Ebrahim Gholamhosseinnejad verpflichtet sich,
                  diese Kosten unverzüglich zu erstatten.
                </ListItem>
              </List>
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
            § 10 Datenschutz
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Informationen zur Verarbeitung personenbezogener Daten finden Sie
              in unserer Datenschutzerklärung.
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
            § 11 Nutzungsbedingungen der Webseite
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Die Nutzung unserer Webseite ist nur für rechtmäßige Zwecke
              gestattet.
              <br style={{ marginBottom: "1rem" }}></br>
              Es ist untersagt, die Webseite in einer Weise zu nutzen, die die
              Webseite beschädigen oder beeinträchtigen könnte.
              <br style={{ marginBottom: "1rem" }}></br>
              Nutzer dürfen keine Inhalte hochladen, die gegen geltendes Recht
              verstoßen.
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
            § 12 Lizenzierung und Urheberrecht
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Alle Inhalte und Werke auf dieser Webseite unterliegen dem
              deutschen Urheberrecht.
              <br style={{ marginBottom: "1rem" }}></br>
              Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung bedürfen der schriftlichen Zustimmung des jeweiligen
              Autors.
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
            § 13 Streitbeilegung
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:
              https://ec.europa.eu/consumers/odr.
              <br style={{ marginBottom: "1rem" }}></br>
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
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
            § 14 Änderungen der AGB
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Wir behalten uns vor, diese AGB jederzeit zu ändern.
              <br style={{ marginBottom: "1rem" }}></br>
              Änderungen werden auf unserer Webseite veröffentlicht und treten
              mit Veröffentlichung in Kraft.
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
            § 15 Schlussbestimmungen
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Änderungen oder Ergänzungen dieser AGB bedürfen der Schriftform.
              <br style={{ marginBottom: "1rem" }}></br>
              Sollte eine Bestimmung dieser AGB unwirksam sein, so bleibt der
              Vertrag im Übrigen wirksam.
            </Typography>
          </Box>
        </ListItem>
      </List>
    </>
  );
};

export default Agb;
