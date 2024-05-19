"use client";
import LayoutWrapper from "../../components/LayoutWrapper";
import MainTab from "../../components/MainTab/MainTab";
import { useState } from "react";

export default function Home() {
  const [tabSelector, setTabSelector] = useState("one");

  return (
    <LayoutWrapper tabSelector={tabSelector} setTabSelector={setTabSelector}>
      <MainTab tabSelector={tabSelector} setTabSelector={setTabSelector} />
    </LayoutWrapper>
  );
}
