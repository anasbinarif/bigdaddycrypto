import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { green, grey, red, yellow } from '@mui/material/colors';
import { Box } from '@mui/material';

function BewertungCard() {
    return (
        <Card sx={{ bgcolor: "#202530", color: 'white', height: "100%", borderRadius: 2, }}>
            <CardContent>
                <Typography sx={{ fontSize: 14, fontWeight: 'bold' }} gutterBottom>
                    Bewertung
                </Typography>
                <List sx={{bgcolor: "#00000033", borderRadius: "8px"}} >
                    {[
                        { text: 'Abdeckung von Hype-Themen', color: green[500] },
                        { text: 'Doppelte Abdeckung von Hype-Themen', color: green[500] },
                        { text: 'Fehlendes Hype-Thema', color: green[500] },
                        { text: 'Verteilung der gewählten Hype-Themen', color: yellow[800] },
                        { text: 'Anzahl an Coins', color: green[500] }
                    ].map(item => (
                        <ListItem key={item.text} sx={{ py: 0 }}>
                            <ListItemIcon>
                                <FiberManualRecordIcon sx={{ color: item.color }} />
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography component="div">
                        Sicherheit <span style={{ fontSize: '1.2rem', color: green[500] }}>8.9</span>
                    </Typography>
                    <Typography component="div">
                        Potential <span style={{ fontSize: '1.2rem', color: green[500] }}>23-36x</span>
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

export default BewertungCard;
