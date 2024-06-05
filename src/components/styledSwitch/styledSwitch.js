"use client";
import React, { useEffect, useState } from "react";
import { Switch } from "@mui/material";
import { styled } from "@mui/material/styles";

export const MySwitch = styled(Switch)(({ theme }) => ({
  padding: 6,
  "& .MuiSwitch-switchBase.MuiSwitch-colorPrimary": {
    "&.Mui-checked": {
      color: "#ffffff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "var(--color-secondary-2)",
      },
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 50,
    backgroundColor: "var(--color-secondary)",
    opacity: 1,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      left: 12,
    },
    "&::after": {
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));
