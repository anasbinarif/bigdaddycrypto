import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Datenschutz = () => {
  return (
    <>
      <Typography
        sx={{
          fontSize: "2.5rem",
          "@media only screen and (max-width: 600px)": {
            fontSize: "1.5rem",
          },
        }}
      >
        Datenschutz
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

                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            1. Datenschutz auf einen Blick
          </ListItemText>
          <Box sx={{ mb: "2rem" }}>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                mb: "1rem",
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              }}
            >
              Allgemeine Hinweise
            </Typography>
            <Typography
              sx={{
                fontSize: "1.3rem",
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1rem",
                },
              }}
            >
              Die folgenden Hinweise geben einen einfachen Überblick darüber,
              was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
              Website besuchen. Personenbezogene Daten sind alle Daten, mit
              denen Sie persönlich identifiziert werden können. Ausführliche
              Informationen zum Thema Datenschutz entnehmen Sie unserer unter
              diesem Text aufgeführten Datenschutzerklärung.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                mb: "1rem",
              }}
            >
              Datenerfassung auf dieser Website
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Wer ist verantwortlich für die Datenerfassung auf dieser Website?
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Die Datenverarbeitung auf dieser Website erfolgt durch den
              Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt
              „Hinweis zur verantwortlichen Stelle“ in dieser
              Datenschutzerklärung entnehmen.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Wie erfassen wir Ihre Daten?
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
              mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in
              ein Kontaktformular eingeben.
              <br style={{ marginBottom: "1rem" }}></br>
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim
              Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
              allem technische Daten (z. B. Internetbrowser, Betriebssystem oder
              Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt
              automatisch, sobald Sie diese Website betreten.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Wofür nutzen wir Ihre Daten?
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Ein Teil der Daten wird erhoben, um eine fehlerfreie
              Bereitstellung der Website zu gewährleisten. Andere Daten können
              zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Welche Rechte haben Sie bezüglich Ihrer Daten?
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über
              Herkunft, Empfänger und Zweck Ihrer gespeicherten
              personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht,
              die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie
              eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie
              diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem
              haben Sie das Recht, unter bestimmten Umständen die Einschränkung
              der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des
              Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen
              Aufsichtsbehörde zu.
              <br style={{ marginBottom: "1rem" }}></br>
              Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie
              sich jederzeit an uns wenden.
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

                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            2. Hosting
          </ListItemText>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Render
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Anbieter ist Render (nachfolgend „Render“). Wenn Sie unsere
              Website besuchen, erfasst Render verschiedene Logfiles inklusive
              Ihrer IP-Adressen. Details entnehmen Sie der Datenschutzerklärung
              von Render: https://render.com/privacy.
              <br style={{ marginBottom: "1rem" }}></br>
              Die Verwendung von Render erfolgt auf Grundlage von Art. 6 Abs. 1
              lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer
              möglichst zuverlässigen Darstellung unserer Website. Sofern eine
              entsprechende Einwilligung abgefragt wurde, erfolgt die
              Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a
              DSGVO und § 25 Abs. 1 TTDSG, soweit die Einwilligung die
              Speicherung von Cookies oder den Zugriff auf Informationen im
              Endgerät des Nutzers (z. B. Device-Fingerprinting) im Sinne des
              TTDSG umfasst. Die Einwilligung ist jederzeit widerrufbar.
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

                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            3. Allgemeine Hinweise und Pflichtinformationen
          </ListItemText>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Datenschutz
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen
              Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
              vertraulich und entsprechend den gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              <br style={{ marginBottom: "1rem" }}></br>
              Wenn Sie diese Website benutzen, werden verschiedene
              personenbezogene Daten erhoben. Personenbezogene Daten sind Daten,
              mit denen Sie persönlich identifiziert werden können. Die
              vorliegende Datenschutzerklärung erläutert, welche Daten wir
              erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu
              welchem Zweck das geschieht.
              <br style={{ marginBottom: "1rem" }}></br>
              Wir weisen darauf hin, dass die Datenübertragung im Internet (z.
              B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen
              kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch
              Dritte ist nicht möglich.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Hinweis zur verantwortlichen Stelle
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser
              Website ist:
              <br style={{ marginBottom: "1rem" }}></br>
              Ebrahim Gholamhosseinnejad
              <br /> Kirchhuchtinger Landstr.
              <br /> 144A 28259 Bremen
              <br style={{ marginBottom: "1rem" }}></br>
              Telefon: [Telefonnummer einfügen] <br />
              E-Mail: [E-Mail-Adresse einfügen]
              <br style={{ marginBottom: "1rem" }}></br>
              Verantwortliche Stelle ist die natürliche oder juristische Person,
              die allein oder gemeinsam mit anderen über die Zwecke und Mittel
              der Verarbeitung von personenbezogenen Daten (z. B. Namen,
              E-Mail-Adressen o. Ä.) entscheidet.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Speicherdauer
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Soweit innerhalb dieser Datenschutzerklärung keine speziellere
              Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen
              Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
              Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine
              Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten
              gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für
              die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer-
              oder handelsrechtliche Aufbewahrungsfristen); im letztgenannten
              Fall erfolgt die Löschung nach Fortfall dieser Gründe.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung
              auf dieser Website
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Sofern Sie in die Datenverarbeitung eingewilligt haben,
              verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von
              Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO, sofern
              besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO verarbeitet
              werden. Im Falle einer ausdrücklichen Einwilligung in die
              Übertragung personenbezogener Daten in Drittstaaten erfolgt die
              Datenverarbeitung außerdem auf Grundlage von Art. 49 Abs. 1 lit. a
              DSGVO. Sofern Sie in die Speicherung von Cookies oder in den
              Zugriff auf Informationen in Ihr Endgerät (z. B. via
              Device-Fingerprinting) eingewilligt haben, erfolgt die
              Datenverarbeitung zusätzlich auf Grundlage von § 25 Abs. 1 TTDSG.
              Die Einwilligung ist jederzeit widerrufbar. Sind Ihre Daten zur
              Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen
              erforderlich, verarbeiten wir Ihre Daten auf Grundlage des Art. 6
              Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir Ihre Daten,
              sofern diese zur Erfüllung einer rechtlichen Verpflichtung
              erforderlich sind auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO.
              Die Datenverarbeitung kann ferner auf Grundlage unseres
              berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen.
              Über die jeweils im Einzelfall einschlägigen Rechtsgrundlagen wird
              in den folgenden Absätzen dieser Datenschutzerklärung informiert.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Hinweis zur Datenweitergabe in datenschutzrechtlich nicht sichere
              Drittstaaten sowie die Weitergabe an US-Unternehmen, die nicht
              DPF-zertifiziert sind
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Wir verwenden unter anderem Tools von Unternehmen mit Sitz in
              datenschutzrechtlich nicht sicheren Drittstaaten sowie US-Tools,
              deren Anbieter nicht nach dem EU-US-Data Privacy Framework (DPF)
              zertifiziert sind. Wenn diese Tools aktiv sind, können Ihre
              personenbezogene Daten in diese Staaten übertragen und dort
              verarbeitet werden. Wir weisen darauf hin, dass in
              datenschutzrechtlich unsicheren Drittstaaten kein mit der EU
              vergleichbares Datenschutzniveau garantiert werden kann.
              <br style={{ marginBottom: "1rem" }}></br>
              Wir weisen darauf hin, dass die USA als sicherer Drittstaat
              grundsätzlich ein mit der EU vergleichbares Datenschutzniveau
              aufweisen. Eine Datenübertragung in die USA ist danach zulässig,
              wenn der Empfänger eine Zertifizierung unter dem „EU-US Data
              Privacy Framework“ (DPF) besitzt oder über geeignete zusätzliche
              Garantien verfügt. Informationen zu Übermittlungen an Drittstaaten
              einschließlich der Datenempfänger finden Sie in dieser
              Datenschutzerklärung.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Empfänger von personenbezogenen Daten
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Im Rahmen unserer Geschäftstätigkeit arbeiten wir mit
              verschiedenen externen Stellen zusammen. Dabei ist teilweise auch
              eine Übermittlung von personenbezogenen Daten an diese externen
              Stellen erforderlich. Wir geben personenbezogene Daten nur dann an
              externe Stellen weiter, wenn dies im Rahmen einer
              Vertragserfüllung erforderlich ist, wenn wir gesetzlich hierzu
              verpflichtet sind (z. B. Weitergabe von Daten an Steuerbehörden),
              wenn wir ein berechtigtes Interesse nach Art. 6 Abs. 1 lit. f
              DSGVO an der Weitergabe haben oder wenn eine sonstige
              Rechtsgrundlage die Datenweitergabe erlaubt. Beim Einsatz von
              Auftragsverarbeitern geben wir personenbezogene Daten unserer
              Kunden nur auf Grundlage eines gültigen Vertrags über
              Auftragsverarbeitung weiter. Im Falle einer gemeinsamen
              Verarbeitung wird ein Vertrag über gemeinsame Verarbeitung
              geschlossen.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Widerruf Ihrer Einwilligung zur Datenverarbeitung
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen
              Einwilligung möglich. Sie können eine bereits erteilte
              Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum
              Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf
              unberührt.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen
              sowie gegen Direktwerbung (Art. 21 DSGVO)
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E
              ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN,
              DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIE
              VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH EINZULEGEN;
              DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN GESTÜTZTES
              PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF DENEN EINE
              VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER DATENSCHUTZERKLÄRUNG.
              WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE BETROFFENEN
              PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR
              KÖNNEN ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG
              NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN ÜBERWIEGEN
              ODER DIE VERARBEITUNG DIENT DER GELTENDMACHUNG, AUSÜBUNG ODER
              VERTEIDIGUNG VON RECHTSANSPRÜCHEN (WIDERSPRUCH NACH ART. 21 ABS. 1
              DSGVO).
              <br style={{ marginBottom: "1rem" }}></br>
              WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG
              ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN
              DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM
              ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH FÜR DAS
              PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG
              STEHT. WENN SIE WIDERSPRECHEN, WERDEN IHRE PERSONENBEZOGENEN DATEN
              ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER DIREKTWERBUNG VERWENDET
              (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Beschwerderecht bei der zuständigen Aufsichtsbehörde
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein
              Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem
              Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes
              oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht
              besteht unbeschadet anderweitiger verwaltungsrechtlicher oder
              gerichtlicher Rechtsbehelfe.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Recht auf Datenübertragbarkeit
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Sie haben das Recht, Daten, die wir auf Grundlage Ihrer
              Einwilligung oder in Erfüllung eines Vertrags automatisiert
              verarbeiten, an sich oder an einen Dritten in einem gängigen,
              maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die
              direkte Übertragung der Daten an einen anderen Verantwortlichen
              verlangen, erfolgt dies nur, soweit es technisch machbar ist.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Auskunft, Berichtigung und Löschung
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen
              jederzeit das Recht auf unentgeltliche Auskunft über Ihre
              gespeicherten personenbezogenen Daten, deren Herkunft und
              Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht
              auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu
              weiteren Fragen zum Thema personenbezogene Daten können Sie sich
              jederzeit an uns wenden.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Recht auf Einschränkung der Verarbeitung
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer
              personenbezogenen Daten zu verlangen. Hierzu können Sie sich
              jederzeit an uns wenden. Das Recht auf Einschränkung der
              Verarbeitung besteht in folgenden Fällen:
              <List sx={{ m: "2rem 0" }}>
                <ListItem>
                  Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten
                  personenbezogenen Daten bestreiten, benötigen wir in der Regel
                  Zeit, um dies zu überprüfen. Für die Dauer der Prüfung haben
                  Sie das Recht, die Einschränkung der Verarbeitung Ihrer
                  personenbezogenen Daten zu verlangen.
                </ListItem>
                <ListItem>
                  Wenn die Verarbeitung Ihrer personenbezogenen Daten
                  unrechtmäßig geschah/geschieht, können Sie statt der Löschung
                  die Einschränkung der Datenverarbeitung verlangen.
                </ListItem>
                <ListItem>
                  Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen,
                  Sie sie jedoch zur Ausübung, Verteidigung oder Geltendmachung
                  von Rechtsansprüchen benötigen, haben Sie das Recht, statt der
                  Löschung die Einschränkung der Verarbeitung Ihrer
                  personenbezogenen Daten zu verlangen.
                </ListItem>
                <ListItem>
                  Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt
                  haben, muss eine Abwägung zwischen Ihren und unseren
                  Interessen vorgenommen werden. Solange noch nicht feststeht,
                  wessen Interessen überwiegen, haben Sie das Recht, die
                  Einschränkung der Verarbeitung Ihrer personenbezogenen Daten
                  zu verlangen.
                </ListItem>
              </List>
              Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten
              eingeschränkt haben, dürfen diese Daten – von ihrer Speicherung
              abgesehen – nur mit Ihrer Einwilligung oder zur Geltendmachung,
              Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz
              der Rechte einer anderen natürlichen oder juristischen Person oder
              aus Gründen eines wichtigen öffentlichen Interesses der
              Europäischen Union oder eines Mitgliedstaats verarbeitet werden.
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

                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            4. Datenerfassung auf dieser Website
          </ListItemText>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Cookies
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Unsere Internetseiten verwenden so genannte „Cookies“. Cookies
              sind kleine Datenpakete und richten auf Ihrem Endgerät keinen
              Schaden an. Sie werden entweder vorübergehend für die Dauer einer
              Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf
              Ihrem Endgerät gespeichert. Session-Cookies werden nach Ende Ihres
              Besuchs automatisch gelöscht. Permanente Cookies bleiben auf Ihrem
              Endgerät gespeichert, bis Sie diese selbst löschen oder eine
              automatische Löschung durch Ihren Webbrowser erfolgt.
              <br style={{ marginBottom: "1rem" }}></br>
              Cookies können von uns (First-Party-Cookies) oder von
              Drittunternehmen stammen (sog. Third-Party-Cookies).
              Third-Party-Cookies ermöglichen die Einbindung bestimmter
              Dienstleistungen von Drittunternehmen innerhalb von Webseiten (z.
              B. Cookies zur Abwicklung von Zahlungsdienstleistungen).
              <br style={{ marginBottom: "1rem" }}></br>
              Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind
              technisch notwendig, da bestimmte Webseitenfunktionen ohne diese
              nicht funktionieren würden (z. B. die Warenkorbfunktion oder die
              Anzeige von Videos). Andere Cookies können zur Auswertung des
              Nutzerverhaltens oder zu Werbezwecken verwendet werden.
              <br style={{ marginBottom: "1rem" }}></br>
              Cookies, die zur Durchführung des elektronischen
              Kommunikationsvorgangs, zur Bereitstellung bestimmter, von Ihnen
              erwünschter Funktionen (z. B. für die Warenkorbfunktion) oder zur
              Optimierung der Website (z. B. Cookies zur Messung des
              Webpublikums) erforderlich sind (notwendige Cookies), werden auf
              Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert, sofern keine
              andere Rechtsgrundlage angegeben wird. Der Websitebetreiber hat
              ein berechtigtes Interesse an der Speicherung von notwendigen
              Cookies zur technisch fehlerfreien und optimierten Bereitstellung
              seiner Dienste. Sofern eine Einwilligung zur Speicherung von
              Cookies und vergleichbaren Wiedererkennungstechnologien abgefragt
              wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage
              dieser Einwilligung (Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1
              TTDSG); die Einwilligung ist jederzeit widerrufbar.
              <br style={{ marginBottom: "1rem" }}></br>
              Sie können Ihren Browser so einstellen, dass Sie über das Setzen
              von Cookies informiert werden und Cookies nur im Einzelfall
              erlauben, die Annahme von Cookies für bestimmte Fälle oder
              generell ausschließen sowie das automatische Löschen der Cookies
              beim Schließen des Browsers aktivieren. Bei der Deaktivierung von
              Cookies kann die Funktionalität dieser Website eingeschränkt sein.
              <br style={{ marginBottom: "1rem" }}></br>
              Welche Cookies und Dienste auf dieser Website eingesetzt werden,
              können Sie dieser Datenschutzerklärung entnehmen.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Kontaktformular
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden
              Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort
              angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für
              den Fall von Anschlussfragen bei uns gespeichert. Diese Daten
              geben wir nicht ohne Ihre Einwilligung weiter.
              <br style={{ marginBottom: "1rem" }}></br>
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6
              Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines
              Vertrags zusammenhängt oder zur Durchführung vorvertraglicher
              Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die
              Verarbeitung auf unserem berechtigten Interesse an der effektiven
              Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f
              DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
              sofern diese abgefragt wurde; die Einwilligung ist jederzeit
              widerrufbar.
              <br style={{ marginBottom: "1rem" }}></br>
              Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei
              uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur
              Speicherung widerrufen oder der Zweck für die Datenspeicherung
              entfällt (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage).
              Zwingende gesetzliche Bestimmungen – insbesondere
              Aufbewahrungsfristen – bleiben unberührt.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Anfrage per E-Mail, Telefon oder Telefax
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird
              Ihre Anfrage inklusive aller daraus hervorgehenden
              personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung
              Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten
              geben wir nicht ohne Ihre Einwilligung weiter.
              <br style={{ marginBottom: "1rem" }}></br>
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6
              Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines
              Vertrags zusammenhängt oder zur Durchführung vorvertraglicher
              Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die
              Verarbeitung auf unserem berechtigten Interesse an der effektiven
              Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f
              DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
              sofern diese abgefragt wurde; die Einwilligung ist jederzeit
              widerrufbar.
              <br style={{ marginBottom: "1rem" }}></br>
              Die von Ihnen an uns per Kontaktanfragen übersandten Daten
              verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre
              Einwilligung zur Speicherung widerrufen oder der Zweck für die
              Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung
              Ihres Anliegens). Zwingende gesetzliche Bestimmungen –
              insbesondere gesetzliche Aufbewahrungsfristen – bleiben unberührt.
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

                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            5. Analyse-Tools und Werbung
          </ListItemText>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Google Analytics
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Diese Website nutzt die Funktionen des Webanalysedienstes Google
              Analytics. Anbieter ist die Google Ireland Limited („Google“),
              Gordon House, Barrow Street, Dublin 4, Irland.
              <br style={{ marginBottom: "1rem" }}></br>
              Google Analytics verwendet so genannte „Cookies“. Das sind
              Textdateien, die auf Ihrem Computer gespeichert werden und die
              eine Analyse der Benutzung der Website durch Sie ermöglichen. Die
              durch den Cookie erzeugten Informationen über Ihre Benutzung
              dieser Website werden in der Regel an einen Server von Google in
              den USA übertragen und dort gespeichert.
              <br style={{ marginBottom: "1rem" }}></br>
              Die Speicherung von Google-Analytics-Cookies und die Nutzung
              dieses Analyse-Tools erfolgen auf Grundlage von Art. 6 Abs. 1 lit.
              f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an
              der Analyse des Nutzerverhaltens, um sowohl sein Webangebot als
              auch seine Werbung zu optimieren. Sofern eine entsprechende
              Einwilligung abgefragt wurde (z. B. eine Einwilligung zur
              Speicherung von Cookies), erfolgt die Verarbeitung ausschließlich
              auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1
              TTDSG; die Einwilligung ist jederzeit widerrufbar.
              <br style={{ marginBottom: "1rem" }}></br>
              IP-Anonymisierung
              <br style={{ marginBottom: "1rem" }}></br>
              Wir haben auf dieser Website die Funktion IP-Anonymisierung
              aktiviert. Dadurch wird Ihre IP-Adresse von Google innerhalb von
              Mitgliedstaaten der Europäischen Union oder in anderen
              Vertragsstaaten des Abkommens über den Europäischen
              Wirtschaftsraum vor der Übermittlung in die USA gekürzt. Nur in
              Ausnahmefällen wird die volle IP-Adresse an einen Server von
              Google in den USA übertragen und dort gekürzt. Im Auftrag des
              Betreibers dieser Website wird Google diese Informationen
              benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über
              die Websiteaktivitäten zusammenzustellen und um weitere mit der
              Websitenutzung und der Internetnutzung verbundene Dienstleistungen
              gegenüber dem Websitebetreiber zu erbringen. Die im Rahmen von
              Google Analytics von Ihrem Browser übermittelte IP-Adresse wird
              nicht mit anderen Daten von Google zusammengeführt.
              <br style={{ marginBottom: "1rem" }}></br>
              Browser Plugin
              <br style={{ marginBottom: "1rem" }}></br>
              Sie können die Speicherung der Cookies durch eine entsprechende
              Einstellung Ihrer Browser-Software verhindern; wir weisen Sie
              jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht
              sämtliche Funktionen dieser Website vollumfänglich werden nutzen
              können. Sie können darüber hinaus die Erfassung der durch den
              Cookie erzeugten und auf Ihre Nutzung der Website bezogenen Daten
              (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser
              Daten durch Google verhindern, indem Sie das unter dem folgenden
              Link verfügbare Browser-Plugin herunterladen und installieren:
              https://tools.google.com/dlpage/gaoptout?hl=de.
              <br style={{ marginBottom: "1rem" }}></br>
              Widerspruch gegen Datenerfassung
              <br style={{ marginBottom: "1rem" }}></br>
              Sie können die Erfassung Ihrer Daten durch Google Analytics
              verhindern, indem Sie auf folgenden Link klicken. Es wird ein
              Opt-Out-Cookie gesetzt, der die Erfassung Ihrer Daten bei
              zukünftigen Besuchen dieser Website verhindert: Google Analytics
              deaktivieren.
              <br style={{ marginBottom: "1rem" }}></br>
              Mehr Informationen zum Umgang mit Nutzerdaten bei Google Analytics
              finden Sie in der Datenschutzerklärung von Google:
              https://support.google.com/analytics/answer/6004245?hl=de.
              <br style={{ marginBottom: "1rem" }}></br>
              Auftragsverarbeitung
              <br style={{ marginBottom: "1rem" }}></br>
              Wir haben mit Google einen Vertrag zur Auftragsverarbeitung
              abgeschlossen und setzen die strengen Vorgaben der deutschen
              Datenschutzbehörden bei der Nutzung von Google Analytics
              vollständig um.
              <br style={{ marginBottom: "1rem" }}></br>
              Demografische Merkmale bei Google Analytics
              <br style={{ marginBottom: "1rem" }}></br>
              Diese Website nutzt die Funktion „demografische Merkmale“ von
              Google Analytics. Dadurch können Berichte erstellt werden, die
              Aussagen zu Alter, Geschlecht und Interessen der Seitenbesucher
              enthalten. Diese Daten stammen aus interessenbezogener Werbung von
              Google sowie aus Besucherdaten von Drittanbietern. Diese Daten
              können keiner bestimmten Person zugeordnet werden. Sie können
              diese Funktion jederzeit über die Anzeigeneinstellungen in Ihrem
              Google-Konto deaktivieren oder die Erfassung Ihrer Daten durch
              Google Analytics wie im Punkt „Widerspruch gegen Datenerfassung“
              dargestellt generell untersagen.
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

                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            6. Newsletter
          </ListItemText>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Newsletterdaten
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Wenn Sie den auf der Website angebotenen Newsletter beziehen
              möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie
              Informationen, welche uns die Überprüfung gestatten, dass Sie der
              Inhaber der angegebenen E-Mail-Adresse sind und mit dem Empfang
              des Newsletters einverstanden sind. Weitere Daten werden nicht
              bzw. nur auf freiwilliger Basis erhoben. Diese Daten verwenden wir
              ausschließlich für den Versand der angeforderten Informationen und
              geben diese nicht an Dritte weiter.
              <br style={{ marginBottom: "1rem" }}></br>
              Die Verarbeitung der in das Newsletteranmeldeformular eingegebenen
              Daten erfolgt ausschließlich auf Grundlage Ihrer Einwilligung
              (Art. 6 Abs. 1 lit. a DSGVO). Die erteilte Einwilligung zur
              Speicherung der Daten, der E-Mail-Adresse sowie deren Nutzung zum
              Versand des Newsletters können Sie jederzeit widerrufen, etwa über
              den „Austragen“-Link im Newsletter. Die Rechtmäßigkeit der bereits
              erfolgten Datenverarbeitungsvorgänge bleibt vom Widerruf
              unberührt.
              <br style={{ marginBottom: "1rem" }}></br>
              Die von Ihnen zum Zwecke des Newsletter-Bezugs bei uns
              hinterlegten Daten werden von uns bis zu Ihrer Austragung aus dem
              Newsletter bei uns bzw. dem Newsletterdiensteanbieter gespeichert
              und nach der Abbestellung des Newsletters oder nach Zweckfortfall
              aus der Newsletterverteilerliste gelöscht. Wir behalten uns vor,
              E-Mail-Adressen aus unserem Newsletterverteiler nach eigenem
              Ermessen im Rahmen unseres berechtigten Interesses nach Art. 6
              Abs. 1 lit. f DSGVO zu löschen oder zu sperren.
              <br style={{ marginBottom: "1rem" }}></br>
              Daten, die zu anderen Zwecken bei uns gespeichert wurden, bleiben
              hiervon unberührt.
              <br style={{ marginBottom: "1rem" }}></br>
              Nach Ihrer Austragung aus der Newsletterverteilerliste wird Ihre
              E-Mail-Adresse bei uns bzw. dem Newsletterdiensteanbieter ggf. in
              einer Blacklist gespeichert, sofern dies zur Verhinderung
              künftiger Mailings erforderlich ist. Die Daten aus der Blacklist
              werden nur für diesen Zweck verwendet und nicht mit anderen Daten
              zusammengeführt. Dies dient sowohl Ihrem Interesse als auch
              unserem Interesse an der Einhaltung der gesetzlichen Vorgaben beim
              Versand von Newslettern (berechtigtes Interesse im Sinne des Art.
              6 Abs. 1 lit. f DSGVO). Die Speicherung in der Blacklist ist
              zeitlich nicht befristet. Sie können der Speicherung
              widersprechen, sofern Ihre Interessen unser berechtigtes Interesse
              überwiegen.
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

                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            7. Plugins und Tools
          </ListItemText>
          <Box
            sx={{
              mb: "2rem",
              "& .MuiTypography-root": {
                "@media only screen and (max-width: 600px)": {
                  fontSize: "1.2rem",
                },
              },
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "1.5rem", mb: "1rem" }}
            >
              Font Awesome
            </Typography>
            <Typography sx={{ fontSize: "1.3rem" }}>
              Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten
              und Symbolen Font Awesome. Anbieter ist die Fonticons, Inc., 6
              Porter Road Apartment 3R, Cambridge, Massachusetts, USA.
              <br style={{ marginBottom: "1rem" }}></br>
              Beim Aufruf einer Seite lädt Ihr Browser die benötigten Fonts in
              ihren Browsercache, um Texte, Schriftarten und Symbole korrekt
              anzuzeigen. Zu diesem Zweck muss der von Ihnen verwendete Browser
              Verbindung zu den Servern von Font Awesome aufnehmen. Hierdurch
              erlangt Font Awesome Kenntnis darüber, dass über Ihre IP-Adresse
              diese Website aufgerufen wurde. Die Nutzung von Font Awesome
              erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben
              ein berechtigtes Interesse an der einheitlichen Darstellung des
              Schriftbildes auf unserer Website. Sofern eine entsprechende
              Einwilligung abgefragt wurde, erfolgt die Verarbeitung
              ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO und §
              25 Abs. 1 TTDSG, soweit die Einwilligung die Speicherung von
              Cookies oder den Zugriff auf Informationen im Endgerät des Nutzers
              (z. B. Device-Fingerprinting) im Sinne des TTDSG umfasst. Die
              Einwilligung ist jederzeit widerrufbar.s
              <br style={{ marginBottom: "1rem" }}></br>
              Wenn Ihr Browser Font Awesome nicht unterstützt, wird eine
              Standardschrift von Ihrem Computer genutzt.
              <br style={{ marginBottom: "1rem" }}></br>
              Weitere Informationen zu Font Awesome finden Sie und in der
              Datenschutzerklärung von Font Awesome unter:
              https://fontawesome.com/privacy.
            </Typography>
          </Box>
        </ListItem>
      </List>
    </>
  );
};

export default Datenschutz;
