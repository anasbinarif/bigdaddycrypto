import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Popper,
} from "@mui/material";
import styles from "./coinDetails.module.css";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

const CoinDetailsTable = ({
  rowVals,
  handleRowData,
  handleDeleteRow,
  validationError,
}) => {
  const t = useTranslations("coinDetails");

  const getTodayString = () => {
    const today = new Date();
    const day = `0${today.getDate()}`.slice(-2); // Ensuring two digits
    const month = `0${today.getMonth() + 1}`.slice(-2); // Ensuring two digits, adding 1 because getMonth() is zero-indexed
    const year = today.getFullYear();
    return `${day} / ${month} / ${year}`; // Formats date as "YYYY-MM-DD"
  };
  const computeDaysPast = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const today = new Date().toISOString().split("T")[0];

  const PopperMy = useCallback((props) => {
    const anchorEl = document.getElementById("filters");

    return (
      <Popper
        {...props}
        anchorEl={anchorEl}
        style={{
          width: anchorEl.clientWidth,
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
        sx={{
          "& > .MuiPaper-root": {
            "& .MuiAutocomplete-noOptions": {
              color: "white",
            },
            "& > .MuiTypography-root": {
              color: "white",
            },
            backgroundColor: "#202530",
            filter: "brightness(0.8)",
          },
        }}
        placement="bottom-end"
      />
    );
  }, []);

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "#ffffff08",
        "& .MuiTableCell-head": {
          color: "#ffffff50",
          border: "none",
          fontWeight: "bold",
        },
        "& .MuiTableBody-root .MuiTableRow-root": {
          backgroundColor: "#00000033",
          "&:hover": {
            backgroundColor: "#00000050",
          },
        },
        "& .MuiTableCell-body": {
          color: "white",
          border: "none",
        },
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                "@media only screen and (max-width: 1500px)": {
                  textWrap: "nowrap",
                },
              }}
            >
              {t("action")}
            </TableCell>
            <TableCell>{t("date")}</TableCell>
            <TableCell
              sx={{
                "@media only screen and (max-width: 1500px)": {
                  textWrap: "nowrap",
                },
              }}
            >
              {t("pricePerCoin")}
            </TableCell>
            <TableCell
              sx={{
                "@media only screen and (max-width: 1500px)": {
                  textWrap: "nowrap",
                },
              }}
            >
              {t("amountInEUR")}
            </TableCell>
            <TableCell>{t("coins")}</TableCell>
            <TableCell>{t("holdingPeriod")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowVals.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <Select
                  inputProps={{ "aria-label": "Without label" }}
                  labelId="demo-simple-selectTrans-label"
                  id="demo-simple-select"
                  value={row.Type}
                  label="Age"
                  onChange={(e) => handleRowData(e.target.value, index, "Type")}
                  variant="outlined"
                  sx={{
                    color:
                      row.Type === "Kauf"
                        ? "#4CAF50"
                        : row.Type === "Verkauf"
                        ? "#F44336"
                        : "white",
                    fontSize: "0.8rem",
                    border: "none",

                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #ffffff20",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #ffffff20",
                    },

                    "& .MuiFormHelperText-root": {
                      color: "#ffffff",
                    },
                    "& .MuiFormLabel-root": {
                      color: "#ffffff",
                      "&.Mui-focused": {
                        color: "#ffffff",
                      },
                    },

                    "& .MuiOutlinedInput-root": {
                      "&:selected": {
                        border: "none",
                      },
                    },

                    "& .MuiInputBase-root": {
                      // border: "none",
                    },
                    "& .MuiSelect-select": {
                      // border: "1px solid #ffffff20",
                      // border: "none",
                      padding: "5px",
                      "&:focus-visible": {
                        outline: "none",
                      },
                    },
                    "& .MuiSvgIcon-root": { color: "#ffffff" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        color: "white",
                        backgroundColor: "#111826",
                      },
                    },
                  }}
                >
                  <MenuItem value="Kauf">{t("buy")}</MenuItem>
                  <MenuItem value="Verkauf">{t("sell")}</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <div>
                  {/* <label htmlFor="datePicker">Select a date:</label> */}
                  <input
                    type="date"
                    id="datePicker"
                    value={row.Date}
                    onChange={(e) =>
                      handleRowData(e.target.value, index, "Date")
                    }
                    max={today}
                    className={styles["input--date"]}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "none",
                    padding: "3px 5px",
                    borderRadius: "4px",
                    maxWidth: "100px",
                  }}
                >
                  {row.PricePerCoin} €
                </div>
              </TableCell>
              <TableCell>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ffffff20",
                    padding: "3px 5px",
                    borderRadius: "4px",
                    maxWidth: "100px",
                  }}
                >
                  <input
                    type="number"
                    id="betragInput"
                    value={row.Betrag}
                    onChange={(e) =>
                      handleRowData(parseFloat(e.target.value), index, "Betrag")
                    }
                    className={styles.input}
                  />
                  €
                </div>
              </TableCell>
              <TableCell>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ffffff20",
                    padding: "3px 5px",
                    borderRadius: "4px",
                    maxWidth: "100px",
                  }}
                >
                  <input
                    type="number"
                    id="numberInput"
                    value={row.Coins}
                    onChange={(e) =>
                      handleRowData(parseFloat(e.target.value), index, "Coins")
                    }
                    className={styles.input}
                  />
                </div>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "3px 5px",
                      maxWidth: "100px",
                    }}
                  >
                    {row.Date === "00/00/00"
                      ? ""
                      : `${computeDaysPast(row.Date)} ${t("days")}`}
                  </div>
                </Box>
              </TableCell>
              <TableCell>
                <Tooltip title="Delete" onClick={() => handleDeleteRow(index)}>
                  <IconButton
                    sx={{
                      color: "gray",
                      "&:hover": { color: "red" },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {validationError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {validationError}
        </Typography>
      )}
    </TableContainer>
  );
};

export default CoinDetailsTable;
