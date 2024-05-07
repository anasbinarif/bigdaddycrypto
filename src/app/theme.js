'use client';
import {Roboto} from 'next/font/google';
import { createTheme } from '@mui/material/styles';
Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});
const theme = createTheme({
    typography: {
        fontFamily: "sans-serif"
    },
});

export default theme;