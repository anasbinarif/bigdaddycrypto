import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import theme from './theme';
import "./globals.css";
import { ThemeProvider } from "@mui/material";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata = {
    title: "Big Daddy Crypto",
    description: "Get your information regarding crypto",
};

export default async function RootLayout({ children, params }) {
    const { locale } = params;

    // Fetching messages for the given locale
    const messages = await getMessages(locale);

    return (
        <html lang={locale}>
        <body>
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}