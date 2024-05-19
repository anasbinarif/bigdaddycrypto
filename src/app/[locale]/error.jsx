"use client"
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

const Error = ({ statusCode }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh", // Full viewport height
                textAlign: "center",
            }}
        >
            <Box>
                <Typography variant="h4" gutterBottom>
                    {statusCode
                        ? `An error ${statusCode} occurred on server`
                        : "An error occurred on client"}
                </Typography>
                <Typography variant="body1">
                    We are sorry for the inconvenience. Please try again later.
                </Typography>
                <Link href="/public" passHref>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                        Go back home
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
