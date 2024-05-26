import React, { useEffect, useState } from "react";
import { getUsers } from "../../../../lib/action";
import { Grid, Paper, styled } from "@mui/material";
import UserList from "./UserList";
import UserPortfolioTable from "./UserPortfolioTable";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const EditPortfolio = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserPortfolio, setSelectedUserPortfolio] = useState([])

    useEffect(() => {
        getUsers().then((data) => {
            console.log("Users data", data);
            setUsers(data);
        });
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <UserList users={users} setSelectedUserPortfolio={setSelectedUserPortfolio} />
            </Grid>
            <Grid item xs={9}>
                <UserPortfolioTable portfolio={selectedUserPortfolio} setSelectedUserPortfolio={setSelectedUserPortfolio}/>
            </Grid>
        </Grid>
    );
};

export default EditPortfolio;
