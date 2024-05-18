"use client";
import { useState } from "react";
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
} from "@mui/material";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const videos = [
    {
        title: "Mavia MAVIA (gaming, \"ok/risk\") #1 Top2000",
        url: "https://www.youtube.com/embed/70JdJIE_6EM",
        thumbnail: "https://img.youtube.com/vi/70JdJIE_6EM/maxresdefault.jpg",
        duration: "5:30"
    },
    {
        title: "Limewire LMWR (KI, \"gut\") #2 Top2000",
        url: "https://www.youtube.com/embed/Vgr11UNvcQw",
        thumbnail: "https://img.youtube.com/vi/Vgr11UNvcQw/maxresdefault.jpg",
        duration: "4:40"
    },
    {
        title: "Propchain PROPC (Token, \"risk\") #3 Top2000",
        url: "https://www.youtube.com/embed/24UQlSiTHPc",
        thumbnail: "https://img.youtube.com/vi/24UQlSiTHPc/maxresdefault.jpg",
        duration: "8:02"
    },
    {
        title: "NEAT vs ISSP #4 Top2000",
        url: "https://www.youtube.com/embed/IyWiaR6RqWw",
        thumbnail: "https://img.youtube.com/vi/IyWiaR6RqWw/maxresdefault.jpg",
        duration: "7:33"
    },
    {
        title: "Gameswift GSWIFT (Gaming, \"gut\") #5 Top2000",
        url: "https://www.youtube.com/embed/uY5W6PoVtUk",
        thumbnail: "https://img.youtube.com/vi/uY5W6PoVtUk/maxresdefault.jpg",
        duration: "8:50"
    },
    {
        title: "MagicSquare SQR (Kein Hype, \"gut\")  #6 Top2000",
        url: "https://www.youtube.com/embed/KuRtzJBl68A",
        thumbnail: "https://img.youtube.com/vi/KuRtzJBl68A/maxresdefault.jpg",
        duration: "7:11"
    },
    {
        title: "GameGPT DUEL (Gaming/KI, \"gut\") #7 Top2000",
        url: "https://www.youtube.com/embed/j7uXmLTYZOY",
        thumbnail: "https://img.youtube.com/vi/j7uXmLTYZOY/maxresdefault.jpg",
        duration: "11:37"
    },
    {
        title: "CommuneAI COMAI (KI, \"ok\") #8 Top2000",
        url: "https://www.youtube.com/embed/WlEFJPJ2540",
        thumbnail: "https://img.youtube.com/vi/WlEFJPJ2540/maxresdefault.jpg",
        duration: "7:52"
    },
    {
        title: "HyperGPT HGPT (KI, \"risk\") #9 Top2000",
        url: "https://www.youtube.com/embed/PcPAaOPqMFc",
        thumbnail: "https://img.youtube.com/vi/PcPAaOPqMFc/maxresdefault.jpg",
        duration: "5:30"
    },
    {
        title: "Mars4 MARS4 (Gaming, \"risk\") #10 Top2000",
        url: "https://www.youtube.com/embed/tQ__1fgzXQc",
        thumbnail: "https://img.youtube.com/vi/tQ__1fgzXQc/maxresdefault.jpg",
        duration: "5:53"
    },
    {
        title: "Oraichain ORAI (KI, \"fast sehr gut\") #11 Top2000",
        url: "https://www.youtube.com/embed/U-BA06Xvi1c",
        thumbnail: "https://img.youtube.com/vi/U-BA06Xvi1c/maxresdefault.jpg",
        duration: "4:39"
    },
    {
        title: "Ovr OVR (Gaming, \"fast sehr gut\") #12 Top2000",
        url: "https://www.youtube.com/embed/tP5IwIlD5BY",
        thumbnail: "https://img.youtube.com/vi/tP5IwIlD5BY/maxresdefault.jpg",
        duration: "7:23"
    },
    {
        title: "Pixels PIXELS (Gaming, \"gut\") #13 Top2000",
        url: "https://www.youtube.com/embed/1vRYZtlBUWU",
        thumbnail: "https://img.youtube.com/vi/1vRYZtlBUWU/maxresdefault.jpg",
        duration: "5:22"
    },
    {
        title: "Shrapnel SHRAP (Gaming, \"risk\") #14 Top2000",
        url: "https://www.youtube.com/embed/pHK2fv0vvZ4",
        thumbnail: "https://img.youtube.com/vi/pHK2fv0vvZ4/maxresdefault.jpg",
        duration: "3:40"
    },
    {
        title: "Wam WAM (Gaming, \"risk\") #15 Top2000",
        url: "https://www.youtube.com/embed/SfEeO4rGzeM",
        thumbnail: "https://img.youtube.com/vi/SfEeO4rGzeM/maxresdefault.jpg",
        duration: "3:44"
    },
    {
        title: "Xana XANA (Gaming. \"ok\") #16 Top2000",
        url: "https://www.youtube.com/embed/myhTvyF4wUg",
        thumbnail: "https://img.youtube.com/vi/myhTvyF4wUg/maxresdefault.jpg",
        duration: "6:25"
    },
    {
        title: "Gtai GTAI (KI, \"naja\") #17 Top2000",
        url: "https://www.youtube.com/embed/0n2WJWw-ADo",
        thumbnail: "https://img.youtube.com/vi/0n2WJWw-ADo/maxresdefault.jpg",
        duration: "5:32"
    },
    {
        title: "Beam BEAM (Gaming, \"gut\") #18 Top2000",
        url: "https://www.youtube.com/embed/AOgsNapiDx0",
        thumbnail: "https://img.youtube.com/vi/AOgsNapiDx0/maxresdefault.jpg",
        duration: "6:20"
    },
    {
        title: "Oort OORT (KI, \"gut\") #19 Top2000",
        url: "https://www.youtube.com/embed/BBqC7VVJeiI",
        thumbnail: "https://img.youtube.com/vi/BBqC7VVJeiI/maxresdefault.jpg",
        duration: "5:45"
    },
    {
        title: "Artificial Liquid Intelligence ALI (KI, \"fast sehr gut\") #20 Top2000",
        url: "https://www.youtube.com/embed/FGFIUejalNA",
        thumbnail: "https://img.youtube.com/vi/FGFIUejalNA/maxresdefault.jpg",
        duration: "9:40"
    },
    {
        title: "Sipher SIPHER (Gaming, \"risk\") #21 Top2000",
        url: "https://www.youtube.com/embed/xAGNPrGbJnA",
        thumbnail: "https://img.youtube.com/vi/xAGNPrGbJnA/maxresdefault.jpg",
        duration: "4:02"
    },
    {
        title: "Port3 PORT3 (KI, \"red flag\") #22 Top2000",
        url: "https://www.youtube.com/embed/7cVcZV4rZdk",
        thumbnail: "https://img.youtube.com/vi/7cVcZV4rZdk/maxresdefault.jpg",
        duration: "5:35"
    },
    {
        title: "Graphlinq GLQ (Ki, \"gut,risk\") #23 Top2000",
        url: "https://www.youtube.com/embed/a3uVM43ud_k",
        thumbnail: "https://img.youtube.com/vi/a3uVM43ud_k/maxresdefault.jpg",
        duration: "7:34"
    },
    {
        title: "AiRight AIRI (KI, \"ok\") #24 Top2000",
        url: "https://www.youtube.com/embed/oFw5N8IQJDY",
        thumbnail: "https://img.youtube.com/vi/oFw5N8IQJDY/maxresdefault.jpg",
        duration: "4:26"
    },
    {
        title: "Asto ASTO (Gaming, \"sehr gut\") #25 Top2000",
        url: "https://www.youtube.com/embed/Y57S4q8jxNo",
        thumbnail: "https://img.youtube.com/vi/Y57S4q8jxNo/maxresdefault.jpg",
        duration: "5:55"
    },
    {
        title: "Sologenic SOLO (DEFI,CBDC,TOKEN \"gut\") #26 Top2000",
        url: "https://www.youtube.com/embed/uBe4glTH7vQ",
        thumbnail: "https://img.youtube.com/vi/uBe4glTH7vQ/maxresdefault.jpg",
        duration: "7:23"
    },
    {
        title: "Portal PORTAL (Gaming, \"gut\") #27 Top2000",
        url: "https://www.youtube.com/embed/ct5_c8Ya1Ks",
        thumbnail: "https://img.youtube.com/vi/ct5_c8Ya1Ks/maxresdefault.jpg",
        duration: "10:43"
    },
    {
        title: "Chirpley CHIRP (Ecommerce, \"gut\") #28 Top2000",
        url: "https://www.youtube.com/embed/b_twfojnA0o",
        thumbnail: "https://img.youtube.com/vi/b_twfojnA0o/maxresdefault.jpg",
        duration: "5:23"
    },
    {
        title: "Web3War FPS (Gaming, \"gut\") #29 Top2000",
        url: "https://www.youtube.com/embed/FOUqGgKnsXc",
        thumbnail: "https://img.youtube.com/vi/FOUqGgKnsXc/maxresdefault.jpg",
        duration: "8:05"
    },
    {
        title: "WilderWorlds WILD (Gaming, \"risk\") #30 Top2000",
        url: "https://www.youtube.com/embed/s3QgvAzAFLw",
        thumbnail: "https://img.youtube.com/vi/s3QgvAzAFLw/maxresdefault.jpg",
        duration: "7:05"
    }
];


const MediaVideoPlayer = () => {
    const [selectedVideo, setSelectedVideo] = useState(videos[0].url);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleListItemClick = (event, index, videoUrl) => {
        setSelectedIndex(index);
        setSelectedVideo(videoUrl);
    };
    return (
        <>
            <Navbar />
            <Box sx={{ marginTop: "9rem", backgroundColor: "#111826" }}>
                <Typography
                    sx={{
                        marginLeft: "6rem",
                        color: '#FFFFFF',
                        fontFamily: '"Montserrat", Sans-serif',
                        fontSize: '32px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.01em'
                    }}
                >
                    Mediathek
                </Typography>
                <Typography
                    sx={{
                        color: "#24ffa7",
                        marginLeft: "6rem",
                        fontSize: "80px",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        letterSpacing: "0.01em",
                    }}
                >
                    Coin-Vorstellungen
                </Typography>
                <Grid container spacing={0} sx={{ margin: "0 0rem 10rem 5rem", height: "543px" }}>
                    <Grid item xs={12} md={4} sx={{height: "100%", width: "33%"}}>
                        <List
                            style={{
                                overflow: "auto",
                                backgroundColor: "#2A2A2A",
                                borderRight: "1px solid #333",
                                height: "100%"
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", backgroundColor: "#2A2A2A", borderBottom: "1px solid #d5d8dc" }}>
                                <Typography variant="h2" sx={{ color: "#B1B1B1", fontSize: "16px", padding: "10px 10px 15px 10px", fontWeight: "700" }}>
                                    Playlist
                                </Typography>
                                <Typography variant="h2" sx={{ color: "#B1B1B1", fontSize: "16px", padding: "10px 10px 15px 10px", fontWeight: "700" }}>
                                    {videos.length} Videos
                                </Typography>
                            </Box>
                            {videos.map((video, index) => (
                                <ListItem
                                    key={index}
                                    onClick={(event) => handleListItemClick(event, index, video.url)}
                                    sx={{
                                        cursor: "pointer",
                                        padding: "10px",
                                        borderBottom: "1px solid #555",
                                        backgroundColor: selectedIndex === index ? "black" : "#333236",
                                        "&:hover": {
                                            backgroundColor: selectedIndex === index ? "black" : "#28282A",
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
                                                style={{
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
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ margin: "0px" }}>
                        <Card>
                            <CardMedia
                                component="iframe"
                                height="520"
                                src={selectedVideo}
                                allow="autoplay; encrypted-media"
                                loading="lazy"
                                title="Video Player"
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </>
    )
}

export default MediaVideoPlayer