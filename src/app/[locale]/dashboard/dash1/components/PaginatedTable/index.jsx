import React, { useState, useRef, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useTheme, Box, Tooltip } from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useFormatter, useTranslations } from "next-intl";
import { StyleResetButton } from "../StyledButton";

export default function DenseTable({ data, xanstiege = true }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortColumn, setSortColumn] = useState("MC at Lowest Low Before"); // Default sort column
  const [sortedData, setSortedData] = useState([]);
  const containerRef = useRef(null);
  const paginationRef = useRef(null);
  const theme = useTheme();
  const formatter = useFormatter();
  const t = useTranslations();

  useEffect(() => {
    const sorted = [...data].sort(
      (a, b) =>
        parseFloat(a["MC at Lowest Low Before"]) -
        parseFloat(b["MC at Lowest Low Before"])
    );

    setSortedData(sorted);
  }, [data]);

  const keys = {
    "X Anstieg": "X Anstieg",
    Coin: "Coin",
    "Haupt-Kategorie": "Haupt-Kategorie",
    "%Abfalle": "Percentage of Downfall",
    ID: "ID",
    "MC at Lowest Low Before": "MC at Lowest Low Before",
    "MC at Lowest Low Before": "MC at Lowest Low Before",
  };

  useEffect(() => {
    const sorted = [...data].sort((a, b) => {
      const valueA =
        typeof a[keys[sortColumn]] === "string"
          ? a[keys[sortColumn]]
          : parseFloat(a[keys[sortColumn]]);
      const valueB =
        typeof b[keys[sortColumn]] === "string"
          ? b[keys[sortColumn]]
          : parseFloat(b[keys[sortColumn]]);

      if (isNaN(valueA) || isNaN(valueB)) {
        return isNaN(valueA) &&
          (keys[sortColumn].localeCompare("%Abfalle") === 0 ||
            keys[sortColumn].localeCompare("X Anstieg") === 0)
          ? 1
          : sortOrder === "asc"
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      } else {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }
    });
    setSortedData(sorted);
  }, [sortColumn, sortOrder, data]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Calculate the number of rows based on the container's height
  const calculateRowsPerPage = (containerHeight) => {
    const rowHeight = 52.95; // Set your row height
    const rowsCount = Math.floor(containerHeight / rowHeight);
    setRowsPerPage(rowsCount);
  };

  useEffect(() => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      calculateRowsPerPage(containerHeight);
    }
  }, [containerRef]);

  const backgroundColorCalculatorXAnstieg = (d) => {
    d["X Anstieg"] = parseFloat(d["X Anstieg"]);
    if (d["X Anstieg"] >= 0 && d["X Anstieg"] <= 17) {
      return "#be1622";
    } else if (d["X Anstieg"] > 17 && d["X Anstieg"] <= 20.9) {
      return "#d87a68";
    } else if (d["X Anstieg"] > 20.9 && d["X Anstieg"] <= 39.9) {
      return "#cce2bc";
    } else if (d["X Anstieg"] > 39.9 && d["X Anstieg"] <= 99.9) {
      return "#67b54d";
    } else if (d["X Anstieg"] > 99.9 && d["X Anstieg"] <= 999.9) {
      return "#477f36";
    } else if (d["X Anstieg"] > 999.9) {
      return "#f8ea49";
    }
  };

  const backgroundColorCalculatorAbfalle = (d) => {
    d["Percentage of Downfall"] = !isNaN(
      parseFloat(d["Percentage of Downfall"])
    )
      ? parseFloat(d["Percentage of Downfall"])
      : 100;

    if (d.doa === "d") {
      return "#0d0d0d";
    } else if (
      d["Percentage of Downfall"] >= 0 &&
      d["Percentage of Downfall"] <= 10.99
    ) {
      return "#064b21";
    } else if (
      d["Percentage of Downfall"] > 10.99 &&
      d["Percentage of Downfall"] <= 20.99
    ) {
      return "#067531";
    } else if (
      d["Percentage of Downfall"] > 20.99 &&
      d["Percentage of Downfall"] <= 30.99
    ) {
      return "#a3cd83";
    } else if (
      d["Percentage of Downfall"] > 30.99 &&
      d["Percentage of Downfall"] <= 40.99
    ) {
      return "#f6e832";
    } else if (
      d["Percentage of Downfall"] > 40.99 &&
      d["Percentage of Downfall"] <= 50.99
    ) {
      return "#f6a62b";
    } else if (
      d["Percentage of Downfall"] > 50.99 &&
      d["Percentage of Downfall"] <= 60.99
    ) {
      return "#ed6a1d";
    } else if (
      d["Percentage of Downfall"] > 60.99 &&
      d["Percentage of Downfall"] <= 70.99
    ) {
      return "#ea513e";
    } else if (
      d["Percentage of Downfall"] > 70.99 &&
      d["Percentage of Downfall"] <= 80.99
    ) {
      return "#e31d13";
    } else if (
      d["Percentage of Downfall"] > 80.99 &&
      d["Percentage of Downfall"] <= 90.79
    ) {
      return "#a81923";
    } else if (d["Percentage of Downfall"] > 90.8) {
      return "#86141c";
    }
  };

  const handleSort = (column) => {
    let isAsc = sortOrder === "asc";
    if (sortColumn === column) {
      isAsc = !isAsc;
    } else {
      setSortColumn(column);
      isAsc = true;
    }
    setSortOrder(isAsc ? "asc" : "desc");
  };

  const resetSort = () => {
    // Reset sort order and display original data
    setSortOrder("asc");
    setSortColumn("MC at Lowest Low Before");
    setSortedData(
      [...data].sort(
        (a, b) =>
          parseFloat(a["MC at Lowest Low Before"]) -
          parseFloat(b["MC at Lowest Low Before"])
      )
    );
  };

  return (
    <TableContainer
      ref={containerRef}
      component={Paper}
      sx={{
        height: "100%",
        backgroundColor: theme.colors.lightBackgroundColor, // Dark background color
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 1,
        }}
      >
        <StyleResetButton onClick={resetSort} />

        <TablePagination
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={() => {}}
          sx={{ color: theme.colors.textColor, float: "right" }}
          rowsPerPageOptions={-1}
          ref={paginationRef}
        />
      </Box>
      <Table
        size="small"
        aria-label="a dense table"
        sx={{
          overflowY: "scroll",
          tableLayout: "fixed",
          width: "100%",
        }}
      >
        <TableHead>
          <TableRow>
            {xanstiege && (
              <TableCell
                sx={{
                  color: theme.colors.textColor,
                  fontWeight: "bold",
                  width: "23%",
                }}
                align="left"
              >
                <TableSortLabel
                  active={sortColumn === "X Anstieg"}
                  direction={sortOrder}
                  onClick={() => handleSort("X Anstieg")}
                  style={{
                    color: theme.colors.textColor,
                    fill: theme.colors.textColor,
                  }}
                  sx={{
                    "& .MuiTableSortLabel-icon": {
                      fill: theme.colors.textColor,
                    },
                  }}
                >
                  {t("X-Anstiege")}
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell
              sx={{
                color: theme.colors.textColor,
                fontWeight: "bold",
                width: "23.5%",
              }}
              align="left"
            >
              <TableSortLabel
                active={sortColumn === "Coin"}
                direction={sortOrder}
                onClick={() => handleSort("Coin")}
                style={{
                  color: theme.colors.textColor,
                  fill: theme.colors.textColor,
                }}
                sx={{
                  "& .MuiTableSortLabel-icon": {
                    fill: theme.colors.textColor,
                  },
                }}
              >
                Coin
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{
                color: theme.colors.textColor,
                fontWeight: "bold",
                width: "35.5%",
              }}
              align="left"
            >
              <TableSortLabel
                active={sortColumn === "Haupt-Kategorie"}
                direction={sortOrder}
                onClick={() => handleSort("Haupt-Kategorie")}
                style={{
                  color: theme.colors.textColor,
                  fill: theme.colors.textColor,
                }}
                sx={{
                  "& .MuiTableSortLabel-icon": {
                    fill: theme.colors.textColor,
                  },
                }}
              >
                {t("Haupt-Kategorie")}
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{
                color: theme.colors.textColor,
                fontWeight: "bold",
                width: "18%",
              }}
              align="left"
            >
              <TableSortLabel
                active={sortColumn === "%Abfalle"}
                direction={sortOrder}
                onClick={() => handleSort("%Abfalle")}
                style={{
                  color: theme.colors.textColor,
                  fill: theme.colors.textColor,
                }}
                sx={{
                  "& .MuiTableSortLabel-icon": {
                    fill: theme.colors.textColor,
                  },
                }}
              >
                %{t("Abfälle")}
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, i) => (
              <TableRow
                key={`Coin${i}`}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  height: "50px",
                }}
              >
                {xanstiege && (
                  <TableCell
                    sx={{
                      color:
                        row?.["X Anstieg"] >= 0 && row?.["X Anstieg"] <= 17
                          ? "#fff"
                          : "#232423",
                      background: backgroundColorCalculatorXAnstieg(row),
                    }}
                    size="small"
                  >
                    {formatter.number(row?.["X Anstieg"], {
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                )}
                <TableCell
                  sx={{
                    color: theme.colors.textColor,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  align="left"
                  size="small"
                >
                  <Tooltip title={row?.["Coin"]} arrow>
                    {row?.Coin}
                  </Tooltip>
                </TableCell>
                <TableCell
                  sx={{
                    color: theme.colors.textColor,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  align="left"
                  size="small"
                >
                  <Tooltip title={row?.["Haupt-Kategorie"]} arrow>
                    {row?.["Haupt-Kategorie"]}
                  </Tooltip>
                </TableCell>
                <TableCell
                  sx={{
                    color:
                      row?.doa === "d"
                        ? "#fff"
                        : row?.["Percentage of Downfall"] > 70.99
                        ? "#fff"
                        : row?.["Percentage of Downfall"] >= 0 &&
                          row?.["Percentage of Downfall"] <= 10.99
                        ? "#fff"
                        : "#232423",
                    fontWeight: 0,
                    background: backgroundColorCalculatorAbfalle(row),
                  }}
                  align="left"
                  size="small"
                >
                  {"-" +
                    formatter.number(row?.["Percentage of Downfall"], {
                      maximumFractionDigits: 2,
                    })}
                  {/* : "-" + 1} */}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => {}}
        sx={{ color: theme.colors.textColor }}
        rowsPerPageOptions={-1}
      />
    </TableContainer>
  );
}
