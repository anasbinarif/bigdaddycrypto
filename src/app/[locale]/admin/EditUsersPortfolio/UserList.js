import React, { useState, useMemo, useEffect } from "react";
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
  TableSortLabel,
  CircularProgress,
} from "@mui/material";
import { getUserPortfolio } from "./../../../../lib/data";
import Hashids from "hashids";
import { MySwitch } from "../../../../components/styledSwitch/styledSwitch";

const hashids = new Hashids("this is my salt", 6);

const darkTheme = createTheme({
  palette: {
    mode: "dark", // Enables dark mode
  },
});

const UserList = ({
  users,
  setSelectedUserPortfolio,
  setPortfolioCalculations,
  setSelectedNotizen,
}) => {
  const [loading, setLoading] = useState(false);
  const [blurEmail, setBlurEmail] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("userEmail");

  // console.log("usersusersusers", users);

  const handleUserClicked = async (user) => {
    setLoading(true);
    const userPortfolio = await getUserPortfolio(user.userId);
    setSelectedUserPortfolio(userPortfolio?.data);
    setPortfolioCalculations(userPortfolio?.calculation);
    setSelectedNotizen(user.notizen);
    setLoading(false);
    // console.log("User portfolio:", user, userPortfolio);
  };

  const handleToggleChange = (event) => {
    setBlurEmail(event.target.checked);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      let aValue, bValue;
      if (orderBy.includes(".")) {
        const [parent, child] = orderBy.split(".");
        aValue = a[parent][child];
        bValue = b[parent][child];
      } else {
        aValue = a[orderBy];
        bValue = b[orderBy];
      }

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [users, order, orderBy]);

  return (
    <Box>
      <Box>
        <ThemeProvider theme={darkTheme}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <FormControlLabel
              control={
                <MySwitch
                  sx={{
                    "& .MuiSwitch-track": {
                      backgroundColor: "grey",
                    },
                  }}
                  checked={blurEmail}
                  onChange={handleToggleChange}
                />
              }
              // label="Blur User Email"
            />
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "600px",
              overflowX: "auto",
              backgroundColor: "transparent",
              backgroundImage: "none",
              boxShadow: "none",

              "& .MuiTableCell-root": {
                minWidth: "110px",
              },
            }}
          >
            <Table aria-label="user table" stickyHeader>
              <TableHead
                sx={{
                  "& .MuiTableCell-root": {
                    // backgroundColor: "transparent",
                    padding: "2px",
                    color: "#ffffff50",
                    fontWeight: "bold",
                    "&:first-child": {
                      padding: "16px",
                    },

                    "& .MuiButtonBase-root": {
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "flex-start",

                      "& .MuiSvgIcon-root": {
                        opacity: 1,
                      },
                    },
                  },
                }}
              >
                <TableRow>
                  <TableCell
                    sortDirection={orderBy === "userEmail" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "userEmail"}
                      direction={orderBy === "userEmail" ? order : "asc"}
                      onClick={(e) => handleRequestSort(e, "userEmail")}
                    >
                      User
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel>Comment</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel>Email</TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={
                      orderBy === "oneTimePayment.status" ? order : false
                    }
                  >
                    <TableSortLabel
                      active={orderBy === "oneTimePayment.status"}
                      direction={
                        orderBy === "oneTimePayment.status" ? order : "asc"
                      }
                      onClick={(e) =>
                        handleRequestSort(e, "oneTimePayment.status")
                      }
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={
                      orderBy === "oneTimePayment.date" ? order : false
                    }
                  >
                    <TableSortLabel
                      active={orderBy === "oneTimePayment.date"}
                      direction={
                        orderBy === "oneTimePayment.date" ? order : "asc"
                      }
                      onClick={(e) =>
                        handleRequestSort(e, "oneTimePayment.date")
                      }
                    >
                      Payment Date
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  border: "1px solid #ffffff18",
                  backgroundColor: "#00000030",

                  "& .MuiTableCell-root": {
                    width: "auto",
                  },
                }}
              >
                {users.map((user, index) => (
                  <TableRow
                    key={index}
                    hover
                    onClick={() => handleUserClicked(user)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: blurEmail
                        ? "transparent"
                        : user.oneTimePayment.status === "Paid"
                        ? "#00aa6655"
                        : "#de0b0b55",
                      "& .MuiTableCell-root": {
                        "&:not(:first-child)": {
                          borderRight: "1px solid #ffffff18",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2">{user.username}</Typography>
                    </TableCell>
                    <TableCell
                      sx={
                        {
                          // maxHeight: "100px",
                          // overflow: "auto",
                          // display: "block",
                          // width: "200px",
                        }
                      }
                    >
                      {user.notizen.UserComment ? user.notizen.UserComment : ""}
                    </TableCell>
                    <TableCell
                      sx={{
                        opacity: blurEmail ? 0.5 : 1,
                        filter: blurEmail ? "blur(4px)" : "none",
                      }}
                    >
                      {user.userEmail}
                    </TableCell>
                    <TableCell
                      sx={{
                        opacity: blurEmail ? 0.5 : 1,
                        filter: blurEmail ? "blur(4px)" : "none",
                      }}
                    >
                      {user.oneTimePayment.status}
                    </TableCell>
                    <TableCell
                      sx={{
                        opacity: blurEmail ? 0.5 : 1,
                        filter: blurEmail ? "blur(4px)" : "none",
                      }}
                    >
                      {new Date(user.oneTimePayment.date).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ThemeProvider>
      </Box>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </Box>
  );
};

export default UserList;
