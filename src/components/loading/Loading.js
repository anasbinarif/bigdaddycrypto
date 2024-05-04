import {Box, CircularProgress} from "@mui/material";

const LoadingCircle = () =>{
    return(
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw'
        }}>
            <CircularProgress />
        </Box>
    )
}

export default LoadingCircle;