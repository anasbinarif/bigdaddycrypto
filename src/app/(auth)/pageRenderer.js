"use client";
import React, { createContext, useContext, useState } from "react";
import { LanguageProvider } from "./LanguageContext";

const Page = ({ children }) => {
  return <LanguageProvider>{children}</LanguageProvider>;
};

export default Page;
