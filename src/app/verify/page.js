"use client";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';

const VerifyPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetch(`/api/verifyEmail?token=${token}&email=${email}`, {
                method: 'GET',
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setMessage('Email verified successfully!');
                    } else {
                        setMessage('Invalid or expired token.');
                    }
                })
                .catch(error => {
                    setMessage('An error occurred. Please try again.');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setMessage('No token provided.');
            setLoading(false);
        }
    }, [token]);

    return (
        <Container maxWidth="sm">
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Email Verification
                </Typography>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Alert severity={message === 'Email verified successfully!' ? 'success' : 'error'}>
                        {message}
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default VerifyPage;