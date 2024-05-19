"use client";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { useState } from "react";

const LayoutWrapper = ({ children, tabSelector, setTabSelector }) => {
  return (
    <>
      {/*{!hideNavbarAndFooter.includes(pathname) && <Navbar />}*/}
      <Navbar tabSelector={tabSelector} setTabSelector={setTabSelector} />
      {children}
      <Footer />
      {/*{!hideNavbarAndFooter.includes(pathname) && <Footer />}*/}
    </>
  );
};

export default LayoutWrapper;
