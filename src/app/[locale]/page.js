"use client";
// import LayoutWrapper from "../../components/LayoutWrapper";
import MainTab from "../../components/MainTab/MainTab";
import { useState } from "react";
import ColorTabs from "../../components/MainTab/MainTab";
import LayoutWrapper from "../../components/LayoutWrapper";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  const [tabSelector, setTabSelector] = useState("one");

  return (
    <LayoutWrapper tabSelector={tabSelector} setTabSelector={setTabSelector}>
      <SessionProvider>
        <ColorTabs tabSelector={tabSelector} setTabSelector={setTabSelector} />
      </SessionProvider>
    </LayoutWrapper>
  );
}
