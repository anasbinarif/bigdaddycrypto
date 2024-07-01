"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import MainTab from "../../components/MainTab/MainTab";
import LayoutWrapper from "../../components/LayoutWrapper";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@emotion/react";

// const GA_TRACKING_ID = 'G-DWHG20ZNC7';
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
export default function Home() {
    const [tabSelector, setTabSelector] = useState("one");
    const pathname = usePathname();

    useEffect(() => {
        const handleRouteChange = (url) => {
            window.gtag('config', GA_TRACKING_ID, {
                page_path: url,
            });
        };

        // Trigger handleRouteChange whenever pathname changes
        handleRouteChange(pathname);

    }, [pathname]);

    return (
        <LayoutWrapper tabSelector={tabSelector} setTabSelector={setTabSelector}>
            <SessionProvider>
                <MainTab tabSelector={tabSelector} setTabSelector={setTabSelector} />
            </SessionProvider>
        </LayoutWrapper>
    );
}
