"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Navbar from "../../../../components/navbar/Navbar";
import Footer from "../../../../components/footer/Footer";
import Policy from "../../../../components/PolicyEl/policy";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { DateRange } from "@mui/icons-material";

const PolicyPage = () => {
  // const t = useTranslations("datenschutz");
  const path = usePathname();
  const [filename, setFilename] = useState("");

  useEffect(() => {
    setFilename(path.split("/")[path.split("/").length - 1]);
  }, [path]);

  // console.log(filename);

  return (
    <>
      <Navbar />
      <Box sx={{ p: "8rem 5rem 2rem" }}>
        {/* Hello */}
        <Policy component={filename} />
      </Box>
      <Footer />
    </>
  );
};

export default PolicyPage;
