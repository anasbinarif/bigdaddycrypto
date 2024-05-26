import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    createTheme, ThemeProvider, Box
} from "@mui/material";
import {getUserPortfolio} from "./../../../../lib/data";

const darkTheme = createTheme({
    palette: {
        mode: "dark", // Enables dark mode
    },
});

const UserList = ({ users, setSelectedUserPortfolio }) => {

    const handeUserClicked = async (user) => {
        const userPortfolio = await getUserPortfolio(user._id);
        setSelectedUserPortfolio(userPortfolio?.data);
        console.log("useruseruser", user, userPortfolio);
    }
    return (
        <Box >
        <ThemeProvider theme={darkTheme}>
            <TableContainer component={Paper} sx={{ maxHeight: "600px", }}>
                <Table aria-label="user table" stickyHeader >
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id} hover onClick={() => handeUserClicked(user)}
                                sx={{ cursor: "pointer"}}
                            >
                                <TableCell>
                                    <Typography variant="body2">{user.username}</Typography>
                                    <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                                </TableCell>
                                <TableCell>requested</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
         </ThemeProvider>
        </Box>
    );
};

export default UserList;
