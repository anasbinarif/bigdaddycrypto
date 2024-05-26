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
    Stepper,
    Step,
    StepLabel,
    TextField
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Allocation from "../../../../public/assets/images/Allocation.webp";
import Bitpanda from "../../../../public/assets/images/bitpanda.webp";
import Image from "next/image";

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
    const [portfolioData, setPortfolioData] = useState({
        assets: '',
        investment: '',
        target: '',
    });

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
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
                <Box elevation={3} style={{ padding: 16, backgroundColor: "transparent", color: "white", borderRadius: 12, width: "100%", maxWidth: 800, minHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: "none" }}>
                    <Box>
                        <form onSubmit={handleSubmit}>
                            {activeStep === 0 && (
                                <Box mt={2} textAlign="center">
                                    <Typography variant="h6" gutterBottom>Wieviele Assets hast du in deinem Portfolio?</Typography>
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
                                                        width: 120,
                                                        height: 100,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        '&:hover': {
                                                            backgroundColor: '#333333',
                                                        }
                                                    }}
                                                >
                                                    <Typography variant="h6">{label}</Typography>
                                                    <Typography variant="caption">Assets</Typography>
                                                    {portfolioData.assets === label && <CheckCircleIcon style={{ color: '#ffbf00', marginTop: 8 }} />}
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                            {activeStep === 1 && (
                                <Box mt={2}>
                                    <Typography variant="h6">Wie viel Euro hast du bereits in Kryptos investiert?</Typography>
                                    <Grid container spacing={2} justifyContent="center" mt={2}>
                                        {['Unter 10.000 €', '10.000 - 25.000 €', '25.000 - 50.000 €', '50.000 - 100.000 €', '100.000 - 200.000 €', '200.000 - 400.000 €', '400.000 - 750.000 €', '750.000+'].map((label) => (
                                            <Grid item key={label}>
                                                <Paper
                                                    onClick={() => handleSelection('investment', label)}
                                                    sx={{
                                                        p: 2,
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        backgroundColor: portfolioData.investment === label ? '#333333' : '#202530',
                                                        color: portfolioData.investment === label ? '#ffbf00' : '#ffffff',
                                                        border: portfolioData.investment === label ? '2px solid #ffbf00' : '2px solid transparent',
                                                        borderRadius: 2,
                                                        width: 160,
                                                        height: 60,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        '&:hover': {
                                                            backgroundColor: '#333333',
                                                        }
                                                    }}
                                                >
                                                    <Typography variant="body1" whiteSpace="nowrap">{label}</Typography>
                                                    {portfolioData.investment === label && <CheckCircleIcon style={{ color: '#ffbf00', marginTop: 8 }} />}
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                            {activeStep === 2 && (
                                <Box mt={2}>
                                    <Typography variant="h6">Wieviele X willst du mit deinem Portfolio von hier aus erreichen?</Typography>
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
                                                        width: 120,
                                                        height: 100,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        '&:hover': {
                                                            backgroundColor: '#333333',
                                                        }
                                                    }}
                                                >
                                                    <Typography variant="h6">{label}</Typography>
                                                    {portfolioData.target === label && <CheckCircleIcon style={{ color: '#ffbf00', marginTop: 8 }} />}
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
                                            <Typography variant="h6" gutterBottom>Lass dein Portfolio von Big Daddy Crypto bewerten.</Typography>
                                            <Typography variant="body2" gutterBottom>Beachte bitte, dass immer nur eine begrenzte Anzahl an Portfolios bearbeitet werden können.</Typography>
                                            <TextField
                                                fullWidth
                                                id="portfolioID"
                                                label="Portfolio-ID"
                                                variant="outlined"
                                                value={visitorString}
                                                disabled
                                                margin="normal"
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
                                            />
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                sx={{ color: "white", mt: 2, backgroundColor: "#ffbf00" }}
                                            >
                                                Kommentar anfordern
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </form>
                    </Box>
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Stepper activeStep={activeStep} sx={{ color: 'white' }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel StepIconProps={{ sx: { color: 'white' } }} sx={{ '.MuiStepLabel-label': { color: 'white' } }}>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ color: "white" }}
                        >
                            Zurück
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                        >
                            {activeStep === steps.length - 1 ? 'Fertig' : 'Nächster Schritt'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default PortfolioForm;
