"use client"
import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';


const KryptoFilter = () => {
    const [priceIndicator, setPriceIndicator] = useState('');

    const handleChange = (event) => {
        setPriceIndicator(event.target.value);
    };
    return (
        <Box sx={{ width: '100%', bgcolor: '#202530', p: 2, display: "flex" }}>
            <Box>
                <Typography variant="h6" component="div">
                    Wähle deine Krypto-Assets
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Wähle deine gewünschten Krypto-Assets aus und füge sie durch Doppelklick in dein Portfolio ein.
                </Typography>
            </Box>
            <Box sx={{display: "flex"}} >
                <TextField
                    width={10}
                    select
                    value={priceIndicator}
                    onChange={handleChange}
                    SelectProps={{
                        native: true,
                    }}
                    variant="outlined"
                    sx={{color: "white"}}
                    color="info"
                >
                    <option value="">Kein Preis-Indikator anzeigen</option>
                    <option value="pi0">Preis-Indikator: Extrem Pessimistisch</option>
                    <option value="pi1">Preis-Indikator: Pessimistisch</option>
                    <option value="pi2">Preis-Indikator: Optimistisch</option>
                    <option value="pi3">Preis-Indikator: Spätseinsteiger</option>
                    <option value="pi4">Preis-Indikator: Spätseinsteiger II</option>
                </TextField>
                <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    options={top100Films.map((option) => option.title)}
                    renderInput={(params) => <TextField {...params} label="freeSolo" />}
                />
            </Box>
        </Box>
    )
}

const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'The Lives of Others', year: 2006 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
];

export default KryptoFilter