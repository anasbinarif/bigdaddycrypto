import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from "./theme";
import "./globals.css";
import { ThemeProvider } from "@mui/material";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Script from "next/script";
import Head from "next/head";

export const metadata = {
  title: "koinfolio",
  description: "Get your information regarding crypto",
  other: {
    google: "notranslate",
  },
  icons: {
    icon: "/assets/favicons/favicon.ico",
  },
};

// const GA_TRACKING_ID = 'G-DWHG20ZNC7';
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
export default async function RootLayout({ children, params }) {
  const { locale } = params;

  // Fetching messages for the given locale
  const messages = await getMessages(locale);

  return (
    <html lang={locale} translate="no">
      <Head>
        <meta name="google" content="notranslate" key="notranslate" />
        <script src="https://cope-cdn.copecart.com/cope.js" async></script>
      </Head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <NextIntlClientProvider messages={messages}>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                                        window.dataLayer = window.dataLayer || [];
                                        function gtag(){dataLayer.push(arguments);}
                                        gtag('js', new Date());
                                        gtag('config', '${GA_TRACKING_ID}', {
                                            page_path: window.location.pathname,
                                        });
                                    `,
                }}
              />
              {children}
            </NextIntlClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
