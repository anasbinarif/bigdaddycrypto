"use client";
import { useState, useEffect } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Card,
  CardMedia,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import { useTranslations } from "next-intl";

const videos = [
  {
    title: "#001 Wieso ist das Hypethema «DEFI» so wichtig?",
    url: "https://www.youtube.com/embed/Bd1yxZF8-_k",
    thumbnail: "https://img.youtube.com/vi/Bd1yxZF8-_k/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#002 Lohnt es sich noch die alten OG Projekte zu halten oder lieber in die neuen investieren?",
    url: "https://www.youtube.com/embed/S0MXVx_utMA",
    thumbnail: "https://img.youtube.com/vi/S0MXVx_utMA/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title: "#003 Denkst du es gibt noch einen Crash vor dem Halving?",
    url: "https://www.youtube.com/embed/vuFrXsQ69rU",
    thumbnail: "https://img.youtube.com/vi/vuFrXsQ69rU/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title: "#004 Wie wahrscheinlich siehst du ein Bitcoin/Bullrun Top 2024?",
    url: "https://www.youtube.com/embed/d5s0pyBIMXE",
    thumbnail: "https://img.youtube.com/vi/d5s0pyBIMXE/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#005 Kann es überhaupt wieder eine so starke Altcoin Season geben, obwohl das ganze Kapital von den Institutionellen in die Bitcoin ETF’s fliesst?",
    url: "https://www.youtube.com/embed/KFJgvNotr9g",
    thumbnail: "https://img.youtube.com/vi/KFJgvNotr9g/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#006 Wie wichtig sind die Hypethemen im Bullrun und wieviele gibt es normalerweise in einem Zyklus?",
    url: "https://www.youtube.com/embed/GypsHkeEUHE",
    thumbnail: "https://img.youtube.com/vi/GypsHkeEUHE/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#007 Werden CBDC’s Projekte einen Hype im Bullrun erleben? Warum steigen diese Projekte nicht?",
    url: "https://www.youtube.com/embed/OUS2ePpp1Nk",
    thumbnail: "https://img.youtube.com/vi/OUS2ePpp1Nk/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#008 Wie kann man bei über 30 Projekten im Portfolio den Überblick behalten? Wie kann man die Überforderung überwinden?",
    url: "https://www.youtube.com/embed/5BZ3OJQmoKc",
    thumbnail: "https://img.youtube.com/vi/5BZ3OJQmoKc/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#009 Ab wann hört man auf Projekte zu akkumulieren um die Steuerfreiheit einzuhalten?",
    url: "https://www.youtube.com/embed/ITP57KG4PLk",
    thumbnail: "https://img.youtube.com/vi/ITP57KG4PLk/maxresdefault.jpg",
  },
  {
    title: "#010 Wann macht Bitcoin Sinn im Portfolio?",
    url: "https://www.youtube.com/embed/UlJiBNiBPek",
    thumbnail: "https://img.youtube.com/vi/UlJiBNiBPek/maxresdefault.jpg",
  },
  {
    title:
      "#011 Ist der Zug schon abgefahren? Auf einen Crash warten oder einkaufen?",
    url: "https://www.youtube.com/embed/R7Axl_jiJ8U",
    thumbnail: "https://img.youtube.com/vi/R7Axl_jiJ8U/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#012 Sollte man im Bullrun Altcoins verkaufen oder im Portfolio behalten?",
    url: "https://www.youtube.com/embed/DnAcFoQ209I",
    thumbnail: "https://img.youtube.com/vi/DnAcFoQ209I/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title: "#013 Warum ist die Diversifizierung des Portfolios so wichtig?",
    url: "https://www.youtube.com/embed/kxYE5FnV6xU",
    thumbnail: "https://img.youtube.com/vi/kxYE5FnV6xU/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title: "#014 Wann sollte man die Altcoins in einem Bullrun verkaufen?",
    url: "https://www.youtube.com/embed/4mnPj-vTz4U",
    thumbnail: "https://img.youtube.com/vi/4mnPj-vTz4U/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#015 Warum sind günstige Durchschnittspreise bei den Altcoins so wichtig?",
    url: "https://www.youtube.com/embed/II8kyJkHEcs",
    thumbnail: "https://img.youtube.com/vi/II8kyJkHEcs/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title: "#016 Welche Hypethemen sind besonders wichtig im nächsten Bullrun?",
    url: "https://www.youtube.com/embed/Mto_QdZdciI",
    thumbnail: "https://img.youtube.com/vi/Mto_QdZdciI/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#017 Warum haben viele Altcoins einen besseren Mehrwert als Bitcoin?",
    url: "https://www.youtube.com/embed/llJGLRtwVhk",
    thumbnail: "https://img.youtube.com/vi/llJGLRtwVhk/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title: "#018 Was ist bei einer Altcoinseason wichtig zu beachten?",
    url: "https://www.youtube.com/embed/BzCrYYCZCPE",
    thumbnail: "https://img.youtube.com/vi/BzCrYYCZCPE/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title: "#019 Werden alle Altcoins wieder ihr ATH erreichen?",
    url: "https://www.youtube.com/embed/74DTBZOP-GU",
    thumbnail: "https://img.youtube.com/vi/74DTBZOP-GU/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title: "#020 Wie wichtig ist es das Hypethema im Bullrun zu treffen?",
    url: "https://www.youtube.com/embed/2RHp5zHOSo8",
    thumbnail: "https://img.youtube.com/vi/2RHp5zHOSo8/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#021 Warum bist du überzeugt, dass dieser Bullrun der grösste Bullrun der Geschichte wird?",
    url: "https://www.youtube.com/embed/kSdlZ47F0Sk",
    thumbnail: "https://img.youtube.com/vi/kSdlZ47F0Sk/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#022 Was sollte man beachten um den Ausstieg bei den Altcoins nicht zu verpassen?",
    url: "https://www.youtube.com/embed/rpMAq2wnIkY",
    thumbnail: "https://img.youtube.com/vi/rpMAq2wnIkY/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#023 Wie bewältigt man Probleme mit Banküberweisungen während eines Bullruns?",
    url: "https://www.youtube.com/embed/zouGdHaViPg",
    thumbnail: "https://img.youtube.com/vi/zouGdHaViPg/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#024 Welche Gründe sprechen dagegen, in Börsentoken zu investieren?",
    url: "https://www.youtube.com/embed/cxg5nrvPHPI",
    thumbnail: "https://img.youtube.com/vi/cxg5nrvPHPI/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title: "#025 Welche Fehler sollte man als Anfänger möglichst meiden?",
    url: "https://www.youtube.com/embed/eOnbY7IB2ZU",
    thumbnail: "https://img.youtube.com/vi/eOnbY7IB2ZU/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title: "#026 Bitcoin: Es wird keine CRASHES mehr geben!?",
    url: "https://www.youtube.com/embed/lnsAqsAWAQE",
    thumbnail: "https://img.youtube.com/vi/lnsAqsAWAQE/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#027 Sollte man jetzt im Plus verkaufen oder auf die Altcoinseason warten?",
    url: "https://www.youtube.com/embed/5qOmAcHc4Kk",
    thumbnail: "https://img.youtube.com/vi/5qOmAcHc4Kk/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#028 Wird die Altcoin-Season durch die Bitcoin ETF’s ausgebremst werden?",
    url: "https://www.youtube.com/embed/svfr2suL8oI",
    thumbnail: "https://img.youtube.com/vi/svfr2suL8oI/maxresdefault.jpg",
  },
  {
    title: "#029 Sollte man in der Altcoin-Season seine Coins verkaufen?",
    url: "https://www.youtube.com/embed/C-91ZGgybvc",
    thumbnail: "https://img.youtube.com/vi/C-91ZGgybvc/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title: "#031 Warum ist Bitcoin das neue Gold?",
    url: "https://www.youtube.com/embed/t_hWwCNrDbM",
    thumbnail: "https://img.youtube.com/vi/t_hWwCNrDbM/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#032 Wie sollte man vorgehen, wenn die neuen Coins ihre pessimistischen Preisziele niemals erreichen?",
    url: "https://www.youtube.com/embed/d130CFHkzkU",
    thumbnail: "https://img.youtube.com/vi/d130CFHkzkU/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#033 Auf welchen Indikator muss man besonders achten um den Beginn der Altcoin-Season zu erkennen?",
    url: "https://www.youtube.com/embed/3qZxWmVUo_Y",
    thumbnail: "https://img.youtube.com/vi/3qZxWmVUo_Y/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#034 Wie lange haben wir noch Zeit um zu investieren, bevor es zu spät ist?",
    url: "https://www.youtube.com/embed/gogIFT6lf-A",
    thumbnail: "https://img.youtube.com/vi/gogIFT6lf-A/maxresdefault.jpg",
    duration: "2:16",
  },
  {
    title:
      "#035 Welchen Effekt hat eine hohe Coininflation typischerweise auf den Preis des Coins?",
    url: "https://www.youtube.com/embed/80Hwzevc5h0",
    thumbnail: "https://img.youtube.com/vi/80Hwzevc5h0/maxresdefault.jpg",
    duration: "2:16",
  },
];

function VideoPlayer() {
  const [width, setWidth] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(videos[0].url);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const t = useTranslations("faq");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleListItemClick = (event, index, videoUrl) => {
    setSelectedIndex(index);
    setSelectedVideo(videoUrl);
  };

  return (
    <Box
      sx={{
        minHeight: "120vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Navbar />
      <Box
        sx={{
          margin:
            width > 1920
              ? "8rem auto 4rem"
              : width > 1500
              ? "8rem 10rem 4rem"
              : width > 900
              ? "8rem 5rem 4rem"
              : width > 500
              ? "8rem 3rem 4rem"
              : "8rem 1rem 4rem",
          minWidth: width > 1920 ? "1700px" : "auto",
        }}
        // sx={{
        //   //   marginTop: isSmallScreen ? "5rem" : "9rem",
        //   margin:
        //     width > 768 ? "3rem auto 0" : width > 500 ? "0 4rem 0" : "0 2rem 0",
        //   // marginTop: "112px",
        //   // height: width > 1600 ? "calc(100vh - 80px)" : "calc(100% - )",
        //   // backgroundColor: "#111826",
        //   overflowX: "hidden",
        //   // maxWidth: width > 2000 ? "1400px" : "",
        //   // width: "100%",
        //   paddingTop: "80px",
        //   // margin: width > 1600 ? "0 0 4rem" : "0 3rem 4rem 3rem",
        //   display: "flex",
        //   flexDirection: "column",
        //   // alignItems: "center",
        // }}
      >
        <Typography
          sx={{
            color: "#FFFFFF",
            fontFamily: '"Montserrat", Sans-serif',
            fontSize: "32px",
            fontWeight: 600,
          }}
          // sx={{
          //   // marginLeft: isSmallScreen ? "1rem" : "6rem",
          //   textTransform: "uppercase",
          //   letterSpacing: "0.01em",
          //   textAlign: isSmallScreen ? "center" : "left",
          // }}
        ></Typography>
        <Typography
          sx={{
            color: "#24ffa7",
            fontSize: width > 1500 ? "4rem" : width > 900 ? "3rem" : "2rem",
            fontWeight: "900",
            textTransform: "uppercase",
          }}
          // sx={{
          //   // marginLeft: isSmallScreen ? "1rem" : "6rem",
          //   letterSpacing: "0.01em",
          //   textAlign: isSmallScreen ? "center" : "left",
          //   marginBottom: "2rem",
          // }}
        >
          {t("heading1")}
        </Typography>
        <Box
          container
          spacing={0}
          sx={{
            display: "flex",
            flexDirection: width < 1200 ? "column" : "row",
            maxWidth: "1900px",
          }}
          // sx={{
          //   // margin: isSmal  lScreen ? "1rem" : "0 0rem 10rem 5rem",
          //   // minHeight: "543px",
          //   // height: isSmallScreen ? "350px" : width > 1900 ? "100%" : "543px",
          //   display: "flex",
          //   width: "100%",
          //   maxWidth: "1900px",
          // }}
        >
          {/* <Grid
            item
            xs={12}
            md={6}
            sx={{ margin: "0px", height: isSmallScreen ? "auto" : "100%" }}
          >
          </Grid> */}
          <Card sx={{ flexGrow: 1, flexBasis: "70%", height: "540px" }}>
            <CardMedia
              sx={{ height: width < 1200 ? "540px" : "100%" }}
              // height="100%"
              component="iframe"
              // height={isSmallScreen ? "240px" : "100%"}
              src={selectedVideo}
              allow="autoplay; encrypted-media"
              loading="lazy"
              title="Video Player"
            />
          </Card>
          {/* <Grid
            item
            xs={12}
            md={4}
            sx={{
              height: isSmallScreen ? "auto" : "100%",
              width: isSmallScreen ? "100%" : "33%",
            }}
          >
          </Grid> */}
          <List
            sx={{
              overflow: "auto",
              backgroundColor: "#2A2A2A",
              borderRight: isSmallScreen ? "none" : "1px solid #333",
              height: "auto",
              // minHeight: "543px",
              maxHeight: "540px",
              flexShrink: 1,
              flexBasis: "30%",
            }}
            // style={{
            // }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#2A2A2A",
                borderBottom: "1px solid #d5d8dc",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: "#B1B1B1",
                  fontSize: "16px",
                  padding: "10px 10px 15px 10px",
                  fontWeight: "700",
                }}
              >
                Playlist
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  color: "#B1B1B1",
                  fontSize: "16px",
                  padding: "10px 10px 15px 10px",
                  fontWeight: "700",
                }}
              >
                {videos.length} Videos
              </Typography>
            </Box>
            {videos.map((video, index) => (
              <ListItem
                key={index}
                onClick={(event) =>
                  handleListItemClick(event, index, video.url)
                }
                sx={{
                  cursor: "pointer",
                  padding: "10px",
                  borderBottom: "1px solid #555",
                  backgroundColor:
                    selectedIndex === index ? "black" : "#333236",
                  "&:hover": {
                    backgroundColor:
                      selectedIndex === index ? "black" : "#28282A",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    src={video.thumbnail}
                    sx={{ width: 56, height: 32, marginRight: "10px" }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {video.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" style={{ color: "#999" }}>
                      {video.duration}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default VideoPlayer;
