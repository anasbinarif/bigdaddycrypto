import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import BitpandaIcon from '../icons/BitpandaIcon';

function BitpandaCard() {
    return (
        <Card sx={{ bgcolor: "#00d578", borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: "100%" }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <BitpandaIcon/>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
                        Bitpanda
                    </Typography>
                </Box>
                <Chip
                    label="Unterstützt meine Arbeit und genießt lebenslange Vorteile."
                    color="default"
                    sx={{ mb: 2, fontWeight: 'bold' }}
                />
            </CardContent>
        </Card>
    );
}

export default BitpandaCard;
