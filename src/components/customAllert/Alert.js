import { Alert, Box } from "@mui/material";

const AlertBar = ({ open, message, severity, onClose }) => {
    if (!open) return null;
    return (
        <Box sx={{
            position: 'fixed',
            top: '15%',
            left: '85%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw'
        }}>
            <Alert severity={severity} onClose={onClose}>
                {message}
            </Alert>
        </Box>
    )
}

export default AlertBar;