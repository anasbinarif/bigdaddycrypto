import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    createTheme,
    ThemeProvider,
    Box,
    FormControlLabel,
    Switch
} from "@mui/material";
import { getUserPortfolio } from "./../../../../lib/data";

const darkTheme = createTheme({
    palette: {
        mode: "dark", // Enables dark mode
    },
});

const UserList = ({ users, setSelectedUserPortfolio }) => {
    const [blurEmail, setBlurEmail] = useState(false);

    const handleUserClicked = async (user) => {
        const userPortfolio = await getUserPortfolio(user.userId);
        setSelectedUserPortfolio(userPortfolio?.data);
        console.log("User portfolio:", user, userPortfolio);
    };

    const handleToggleChange = (event) => {
        setBlurEmail(event.target.checked);
    };

    return (
        <Box>
            <ThemeProvider theme={darkTheme}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <FormControlLabel
                        control={<Switch checked={blurEmail} onChange={handleToggleChange} />}
                        label="Blur User Email"
                    />
                </Box>
                <TableContainer component={Paper} sx={{ maxHeight: "600px" }}>
                    <Table aria-label="user table" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Payment Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users?.map((user, index) => (
                                <TableRow
                                    key={index}
                                    hover
                                    onClick={() => handleUserClicked(user)}
                                    sx={{ cursor: "pointer" }}
                                >
                                    <TableCell>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ opacity: blurEmail ? 0.5 : 1, filter: blurEmail ? 'blur(4px)' : 'none' }}
                                        >
                                            {user.userEmail}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{user.oneTimePayment.status}</TableCell>
                                    <TableCell>{new Date(user.oneTimePayment.date).toLocaleString()}</TableCell>
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
