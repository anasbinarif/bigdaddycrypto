import React, { useEffect, useState } from "react";
import { Grid, Paper, styled, Button, ButtonGroup, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import UserList from "./UserList";
import UserPortfolioTable from "./UserPortfolioTable";
import Item1 from "../../../../components/portfolioÜbersicht/Item1";
import { DonutCard } from "../../../../components/portfolioGenerator/cards/donutCard/DonutCard";
import BewertungCard from "../../../../components/portfolioGenerator/cards/Bewertung";
import Item4 from "../../../../components/portfolioÜbersicht/Item4";

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchUsers = async (page) => {
    const response = await fetch(`/api/getAllOneTimeUserPayments?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      console.log("One-time paid users:", data);
      setUsers(data.data);
      setTotalPages(Math.ceil(data.total / limit));
    }
  };

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
    fetchUsers(page);
  }, [page]);

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
        <Grid item xs={12} container justifyContent="space-between" alignItems="center">
          <Typography variant="body1">
            Page {page} of {totalPages}
          </Typography>
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                disabled={page === 1}
                sx={{
                  backgroundColor: "darkgrey",
                  "&:hover": {
                    backgroundColor: "grey",
                  },
                }}
            >
              <ArrowBack />
              Previous
            </Button>
            <Button
                onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                disabled={page === totalPages}
                sx={{ marginLeft: "8px" }}
            >
              Next
              <ArrowForward />
            </Button>
          </ButtonGroup>
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
