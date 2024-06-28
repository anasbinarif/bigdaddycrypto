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
import { videos } from "../../../components/media";

const MediaVideoPlayer = () => {
    const [width, setWidth] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(videos[0].url);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const t = useTranslations("media_page");
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
            >
                <Typography
                    sx={{
                        color: "#FFFFFF",
                        fontFamily: '"Montserrat", Sans-serif',
                        fontSize: "32px",
                        fontWeight: 600,
                    }}
                >
                    {t("heading1")}
                </Typography>
                <Typography
                    sx={{
                        color: "#24ffa7",
                        fontSize: width > 1500 ? "4rem" : width > 900 ? "3rem" : "2rem",
                        fontWeight: "900",
                        textTransform: "uppercase",
                    }}
                >
                    {t("heading2")}
                </Typography>
                <Grid
                    container
                    spacing={0}
                    sx={{
                        display: "flex",
                        flexDirection: width < 1200 ? "column" : "row",
                        maxWidth: "1900px",
                    }}
                >
                    <Grid item xs={12} md={8}>
                        <Card sx={{ flexGrow: 1, height: "540px" }}>
                            <CardMedia
                                sx={{ height: width < 1200 ? "540px" : "100%" }}
                                component="iframe"
                                src={selectedVideo}
                                allow="autoplay; encrypted-media"
                                loading="lazy"
                                title="Video Player"
                            />
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <List
                            sx={{
                                overflow: "auto",
                                backgroundColor: "#2A2A2A",
                                borderRight: isSmallScreen ? "none" : "1px solid #333",
                                height: "auto",
                                maxHeight: "540px",
                            }}
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
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </Box>
    );
};

export default MediaVideoPlayer;
