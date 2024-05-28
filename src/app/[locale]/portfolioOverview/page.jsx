"use client";
import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    CircularProgress,
    Alert,
    TextField,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Allocation from "../../../../public/assets/images/Allocation.webp";
import Image from "next/image";
import Checkout from "../../../components/oneTimePayment/OneTimePaymentCheckout";
import CustomizedSteppers from "./CustomizedSteppers";
import { usePathname, useRouter } from 'next/navigation';

const steps = [
    'Wieviele Assets hast du in deinem Portfolio?',
    'Wie viel Euro hast du bereits in Kryptos investiert?',
    'Wieviele X willst du mit deinem Portfolio von hier aus erreichen?',
    'Ihr Angebot wird in Kürze erstellt',
];

const PortfolioForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [visitorString, setVisitorString] = useState('dummyVisitorString');
    const [userComment, setUserComment] = useState('This is a sample user comment.');
    const [missingCoins, setMissingCoins] = useState('Sample missing coins data.');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [portfolioData, setPortfolioData] = useState({
        assets: '',
        investment: '',
        target: '',
    });
    const [showNext, setShowNext] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        updateUrl(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setShowNext(true);
        updateUrl(activeStep - 1);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission
    };

    const handleSelection = (step, value) => {
        setPortfolioData({
            ...portfolioData,
            [step]: value
        });
        setTimeout(handleNext, 200);
    };

    const updateUrl = (step) => {
        const currentPathname = pathname || "";
        router.push(`${currentPathname}?step=${step}`, undefined, { shallow: true });
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Container>
            <Box my={4} display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Box elevation={3} style={{ padding: 16, backgroundColor: "transparent", color: "white", borderRadius: 12, width: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: "none" }}>
                    <Box>
                        <form onSubmit={handleSubmit}>
                            {activeStep === 0 && (
                                <Box mt={2} textAlign="center">
                                    <Typography variant="h4" sx={{ whiteSpace: "nowrap" }} >Wieviele Assets hast du in deinem Portfolio?</Typography>
                                    <Grid container spacing={2} justifyContent="center" mt={2}>
                                        {['1-15', '16-25', '26-35', '36+'].map((label) => (
                                            <Grid item key={label}>
                                                <Paper
                                                    onClick={() => handleSelection('assets', label)}
                                                    sx={{
                                                        p: 2,
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        backgroundColor: portfolioData.assets === label ? '#333333' : '#202530',
                                                        color: portfolioData.assets === label ? '#ffbf00' : '#ffffff',
                                                        border: portfolioData.assets === label ? '2px solid #ffbf00' : '2px solid transparent',
                                                        borderRadius: 2,
                                                        width: 180,
                                                        height: 150,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        position: "relative",
                                                        '&:hover': {
                                                            boxShadow: !(portfolioData.assets === label) ? "0 8px 48px -16px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(232, 176, 27, 0.35);" : ""
                                                        }
                                                    }}
                                                >
                                                    <Typography variant="h5" sx={{ color: "#E8B01B" }} >{label}</Typography>
                                                    <Typography variant="caption">Assets</Typography>
                                                    {portfolioData.assets === label && <CheckCircleIcon style={{ color: '#43B97F', marginTop: 8, position: "absolute", top: "8px", right: "10px" }} />}
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                            {activeStep === 1 && (
                                <Box mt={2}>
                                    <Typography variant="h4">Wie viel Euro hast du bereits in Kryptos investiert?</Typography>
                                    <Grid container spacing={2} justifyContent="center" mt={2}>
                                        {['Unter 10.000 €', '10.000 - 25.000 €', '25.000 - 50.000 €', '50.000 - 100.000 €', '100.000 - 200.000 €', '200.000 - 400.000 €', '400.000 - 750.000 €', '750.000+'].map((label) => (
                                            <Grid item key={label} xs={6} sm={4}>
                                                <Paper
                                                    onClick={() => handleSelection('investment', label)}
                                                    sx={{
                                                        p: 2,
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        backgroundColor: portfolioData.investment === label ? '#333333' : '#202530',
                                                        color: portfolioData.investment === label ? '#ffffff' : '#ffffff',
                                                        border: portfolioData.investment === label ? '2px solid #ffbf00' : '2px solid transparent',
                                                        borderRadius: 2,
                                                        height: 60,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        position: "relative",
                                                        '&:hover': {
                                                            boxShadow: !(portfolioData.investment === label) ? "0 8px 48px -16px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(232, 176, 27, 0.35);" : ""
                                                        }
                                                    }}
                                                >
                                                    {portfolioData.investment === label && <CheckCircleIcon style={{ color: '#43B97F', position: "absolute", left: "50px" }} />}
                                                    <Typography variant="body1" whiteSpace="nowrap" >{label}</Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                            {activeStep === 2 && (
                                <Box mt={2}>
                                    <Typography variant="h4">Wieviele X willst du mit deinem Portfolio von hier aus erreichen?</Typography>
                                    <Grid container spacing={2} justifyContent="center" mt={2}>
                                        {['10x', '20x', '30x', '50x', '100x'].map((label) => (
                                            <Grid item key={label}>
                                                <Paper
                                                    onClick={() => handleSelection('target', label)}
                                                    sx={{
                                                        p: 2,
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        backgroundColor: portfolioData.target === label ? '#333333' : '#202530',
                                                        color: portfolioData.target === label ? '#ffbf00' : '#ffffff',
                                                        border: portfolioData.target === label ? '2px solid #ffbf00' : '2px solid transparent',
                                                        borderRadius: 2,
                                                        width: 180,
                                                        height: 150,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        position: "relative",
                                                        '&:hover': {
                                                            boxShadow: !(portfolioData.target === label) ? "0 8px 48px -16px rgba(0, 0, 0, 0.15), inset 0 0 0 2px rgba(232, 176, 27, 0.35);" : ""
                                                        }
                                                    }}
                                                >
                                                    <Typography variant="h4" sx={{ color: "#E8B01B" }} >{label}</Typography>
                                                    {portfolioData.target === label && <CheckCircleIcon style={{ color: '#43B97F', marginTop: 8, position: "absolute", top: "8px", right: "10px" }} />}
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                            {activeStep === 3 && (
                                <Box mt={2}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={6}>
                                            <Image
                                                src={Allocation}
                                                alt="Allocation"
                                                placeholder="blur"
                                                style={{
                                                    borderRadius: 10,
                                                    width: "300px",
                                                    height: "300px"
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h4" gutterBottom>Lass dein Portfolio von Big Daddy Crypto bewerten.</Typography>
                                            <Typography variant="body2" gutterBottom>Beachte bitte, dass immer nur eine begrenzte Anzahl an Portfolios bearbeitet werden können.</Typography>
                                            <TextField
                                                fullWidth
                                                id="portfolioID"
                                                label="Portfolio-ID"
                                                variant="outlined"
                                                value={visitorString}
                                                // disabled
                                                margin="normal"
                                                InputLabelProps={{
                                                    style: { color: 'white' },
                                                }}
                                                InputProps={{
                                                    style: { color: 'white' },
                                                }}
                                                sx={{
                                                    color: "white",
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: 'white',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: 'white',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: 'white',
                                                        },
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                id="userComment"
                                                label="Kommentare/Anmerkungen"
                                                variant="outlined"
                                                multiline
                                                rows={4}
                                                value={userComment}
                                                onChange={(e) => setUserComment(e.target.value)}
                                                margin="normal"
                                                required
                                                InputLabelProps={{
                                                    style: { color: 'white' },
                                                }}
                                                InputProps={{
                                                    style: { color: 'white' },
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: 'white',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: 'white',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: 'white',
                                                        },
                                                    },
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                id="missingCoins"
                                                label="Notiere Postitionen, die es nicht im Generator gab"
                                                variant="outlined"
                                                multiline
                                                rows={4}
                                                value={missingCoins}
                                                onChange={(e) => setMissingCoins(e.target.value)}
                                                margin="normal"
                                                InputLabelProps={{
                                                    style: { color: 'white' },
                                                }}
                                                InputProps={{
                                                    style: { color: 'white' },
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: 'white',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: 'white',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: 'white',
                                                        },
                                                    },
                                                }}
                                            />
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                sx={{
                                                    color: "white",
                                                    mt: 2,
                                                    backgroundColor: "#ffbf00",
                                                    '&:hover': {
                                                        backgroundColor: "#403002",
                                                    }
                                            }}
                                                onClick={() => setOpen(true)}
                                            >
                                                Kommentar anfordern
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Checkout open={open} handleClose={() => setOpen(false)} />
                                </Box>
                            )}

                        </form>
                    </Box>
                    <Box mt={2} display="flex" justifyContent="center" sx={{ marginTop: "150px" }} >
                        <CustomizedSteppers activeStep={activeStep} steps={steps} />
                    </Box>
                    <Box mt={0} display="flex" justifyContent={activeStep === 0 ? "flex-end" : "space-between"}>
                        {activeStep !== 0 && (
                            <Button
                                color="inherit"
                                onClick={handleBack}
                                sx={{
                                    color: "#E8B01B",
                                    background: "#3C3623",
                                    padding: "1em 1.5em",
                                    borderRadius: "12px",
                                    '&:hover': {
                                        color: "#0F2242",
                                        background: "#e8b01b"
                                    }
                                }}
                            >
                                Zurück
                            </Button>
                        )}
                        {showNext && activeStep < steps.length - 1 && (
                            <Button
                                color="inherit"
                                onClick={handleNext}
                                sx={{
                                    color: "#E8B01B",
                                    background: "#3C3623",
                                    padding: "1em 1.5em",
                                    borderRadius: "12px",
                                    '&:hover': {
                                        color: "#0F2242",
                                        background: "#e8b01b"
                                    }
                                }}
                            >
                                Nächster Schritt
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default PortfolioForm;
