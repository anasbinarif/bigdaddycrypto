import React, { useEffect, useState } from "react";
import { Grid, Paper, styled } from "@mui/material";
import UserList from "./UserList";
import UserPortfolioTable from "./UserPortfolioTable";
import Item1 from "../../../../components/portfolioÜbersicht/Item1";
import { DonutCard } from "../../../../components/portfolioGenerator/cards/donutCard/DonutCard";
import BewertungCard from "../../../../components/portfolioGenerator/cards/Bewertung";
import Item4 from "../../../../components/portfolioÜbersicht/Item4";
import {getOneTimePaidUsers} from "../../../../lib/data";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const EditPortfolio = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserPortfolio, setSelectedUserPortfolio] = useState([]);
  const [portfolioCalculations, setPortfolioCalculations] = useState([]);
  const [selectedNotizen, setSelectedNotizen] = useState("");
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {

    getOneTimePaidUsers();
  }, []);

  console.log(portfolioCalculations);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <UserList
          users={users}
          setSelectedUserPortfolio={setSelectedUserPortfolio}
          setPortfolioCalculations={setPortfolioCalculations}
          setSelectedNotizen={setSelectedNotizen}
        />
      </Grid>
      <Grid item xs={8} md={width > 1100 ? 8 : 12}>
        <UserPortfolioTable
          portfolio={selectedUserPortfolio}
          setSelectedUserPortfolio={setSelectedUserPortfolio}
        />
      </Grid>
      {selectedUserPortfolio?.assets && portfolioCalculations?.counts && (
        <Grid item xs={4} md={width > 1100 ? 4 : 12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Item1 preCalcPort={selectedUserPortfolio} />
            </Grid>
            <Grid item xs={12}>
              <DonutCard
                preCalcPort={selectedUserPortfolio}
                preCalcCalculations={portfolioCalculations}
              />
            </Grid>
            <Grid item xs={12}>
              <BewertungCard preCalcPort={selectedUserPortfolio} />
            </Grid>
            <Grid item xs={12}>
              <Item4
                preCalcComment={selectedNotizen ? selectedNotizen : ""}
                preCalcPort={selectedUserPortfolio}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default EditPortfolio;
