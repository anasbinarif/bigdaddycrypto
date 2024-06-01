"use client";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { useState } from "react";

const LayoutWrapper = ({ children, tabSelector, setTabSelector }) => {
  return (
    <>
      <Navbar tabSelector={tabSelector} setTabSelector={setTabSelector} />
      {children}
      <Footer />
    </>
  );
};

export default LayoutWrapper;
