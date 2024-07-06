"use client";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import AddAsset from "../admin/AddAsset";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import EditPortfolio from "./EditUsersPortfolio/EditPortfolio";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function CenteredTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: "100%",
          bgcolor: "#111826",
          marginTop: "5%",
          "@media only screen and (max-width: 1300px)": {
            marginTop: "12%",
          },
          "@media only screen and (max-width: 600px)": {
            marginTop: "15%",
          },
          "@media only screen and (max-width: 500px)": {
            marginTop: "20%",
          },
          "& > #simple-tabpanel-0 > .MuiBox-root": {
            "@media only screen and (max-width: 600px)": {
              padding: "10px",
            },
          },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          sx={{
            "& .MuiTab-root": {
              color: "white",
            },
            // '& .Mui-selected': {
            //     color: 'white',
            // },
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--color-secondary-2)",
            },
            "& .MuiTab-root:not(.Mui-selected):hover": {
              backgroundColor: "var(--color-secondary-2)",
            },
            "& .MuiTab-root.Mui-selected": {
              // borderBottomColor: "var(--color-secondary)",
              color: "var(--color-secondary)",
            },
          }}
        >
          <Tab label="Add Asset" />
          <Tab label="Manage Users Portfolios" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <AddAsset />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EditPortfolio />
        </TabPanel>
      </Box>
      <Footer />
    </>
  );
}
