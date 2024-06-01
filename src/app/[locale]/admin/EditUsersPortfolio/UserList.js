import React, { useState, useMemo } from "react";
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
    Switch,
    TableSortLabel
} from "@mui/material";
import { getUserPortfolio } from "./../../../../lib/data";

const darkTheme = createTheme({
    palette: {
        mode: "dark", // Enables dark mode
    },
});

const UserList = ({ users, setSelectedUserPortfolio }) => {
    const [blurEmail, setBlurEmail] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('userEmail');

    const handleUserClicked = async (user) => {
        const userPortfolio = await getUserPortfolio(user.userId);
        setSelectedUserPortfolio(userPortfolio?.data);
        console.log("User portfolio:", user, userPortfolio);
    };

    const handleToggleChange = (event) => {
        setBlurEmail(event.target.checked);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => {
            let aValue, bValue;
            if (orderBy.includes('.')) {
                const [parent, child] = orderBy.split('.');
                aValue = a[parent][child];
                bValue = b[parent][child];
            } else {
                aValue = a[orderBy];
                bValue = b[orderBy];
            }

            if (aValue < bValue) {
                return order === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [users, order, orderBy]);

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
                                <TableCell sortDirection={orderBy === 'userEmail' ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === 'userEmail'}
                                        direction={orderBy === 'userEmail' ? order : 'asc'}
                                        onClick={(e) => handleRequestSort(e, 'userEmail')}
                                    >
                                        User
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection={orderBy === 'oneTimePayment.status' ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === 'oneTimePayment.status'}
                                        direction={orderBy === 'oneTimePayment.status' ? order : 'asc'}
                                        onClick={(e) => handleRequestSort(e, 'oneTimePayment.status')}
                                    >
                                        Status
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection={orderBy === 'oneTimePayment.date' ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === 'oneTimePayment.date'}
                                        direction={orderBy === 'oneTimePayment.date' ? order : 'asc'}
                                        onClick={(e) => handleRequestSort(e, 'oneTimePayment.date')}
                                    >
                                        Payment Date
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedUsers?.map((user, index) => (
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
