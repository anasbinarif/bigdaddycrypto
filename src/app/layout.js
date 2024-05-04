import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import theme from '../app/theme';
import "./globals.css";
import { ThemeProvider } from "@mui/material";

export const metadata = {
  title: "Big Daddy Crypto",
  description: "get your information regarding crypto",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
