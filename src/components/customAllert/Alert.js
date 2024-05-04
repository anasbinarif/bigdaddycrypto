import {Alert, Box} from "@mui/material";

const Allert = () => {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#111826",
        }}>
            {alert.open && (
                <Alert
                    severity={alert.severity}
                    onClose={() => setAlert({...alert, open: false})}
                    sx={{ width: '100%', mb: 2 }} // Adjust the width as necessary
                >
                    {alert.message}
                </Alert>
            )}
            {/* Rest of your form components here */}
        </Box>
    )
}

export default Allert;