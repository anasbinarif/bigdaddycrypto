import { useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Avatar,
  Item,
  Paper,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { addDays } from "date-fns";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./coinDetails.module.css";
import BitpandaIcon from "@/components/portfolioGenerator/icons/BitpandaIcon";

const CoinDetails = (props) => {
  const { coin, index } = props;
  const [value, setValue] = useState(0);
  const [rowVals, setRowVals] = useState([
    // { col1: "Kauf", col2: "01/01/01", col3: 0, col4: 0, col5: 0 },
    // { col1: "Kauf", col2: "01/01/01", col3: 0, col4: 0, col5: 0 },
  ]);

  // console.log(coin);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addRow = () => {
    setRowVals([
      ...rowVals,
      { col1: "Kauf", col2: "01/01/01", col3: 0, col4: 0, col5: 0 },
    ]);
  };

  const handleRowData = (newVal, index, col) => {
    // console.log(newVal, index, col);
    const tempRows = [...rowVals];
    tempRows[index] = { ...tempRows[index], [col]: newVal };
    setRowVals(tempRows);
  };

  console.log(rowVals);
  return (
    <Box
      sx={{
        backgroundColor: "#202530",
        color: "white",
        height: "100%",
        borderRadius: "2px",
        padding: "35px 30px",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column", width: "25%" }}>
          <Box
            sx={{ display: "flex", alignItems: "center", mb: 1, pl: 1, mr: 2 }}
          >
            <Avatar
              src={coin.cgImageURL}
              sx={{ width: 50, height: 50, marginRight: 1 }}
            />
            <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
              {coin.Ticker}
            </Typography>
          </Box>
          <Box sx={{ alignSelf: "flex-end" }}>
            <Typography>{coin.CoinGeckoID}</Typography>
            <Typography>{coin.Price.toFixed(2)} €</Typography>
          </Box>
        </Box>
        <Box className={styles.grid}>
          <Box className={styles.grid__item}>
            <Typography sx={{ fontSize: "0.9rem" }}>Bestand</Typography>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: "bold" }}>
              0,00 €
            </Typography>
            <Typography sx={{ color: "#ffffff88" }}>0 BTC</Typography>
          </Box>
          <Box className={styles.grid__item}>
            <Typography sx={{ fontSize: "0.9rem" }}>Investiert</Typography>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: "bold" }}>
              0,00 €
            </Typography>
            <Typography sx={{ color: "#ffffff88" }}>Geplant: 0,00 €</Typography>
          </Box>
          <Box className={styles.grid__item}>
            <Typography sx={{ fontSize: "0.9rem" }}>
              Gesamtgewinn/-Verlust
            </Typography>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: "bold" }}>
              0,00 €
            </Typography>
            <Typography
              className="down"
              sx={{
                "&.down": {
                  color: "red",
                },

                "&.up": {
                  color: "green",
                },

                "&.down:before": {
                  content: '"▼ "',
                  fontSize: "80%",
                  marginRight: "3px",
                },

                "&.up:before": {
                  content: '"▲ "',
                  fontSize: "80%",
                  marginRight: "3px",
                },
              }}
            >
              -100.0%
            </Typography>
          </Box>
          <Box className={styles.grid__item}>
            <Typography sx={{ fontSize: "0.9rem" }}>
              Durchschn. Kaufpreis
            </Typography>
            <Typography
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "rgb(68, 68, 68)",
              }}
            >
              --,-- €
            </Typography>
          </Box>
          <Box className={styles.grid__item}>
            <Typography sx={{ fontSize: "0.9rem" }}>
              Durchschn. Verkaufspreis
            </Typography>
            <Typography
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "rgb(68, 68, 68)",
              }}
            >
              --,-- €
            </Typography>
          </Box>
          <Box className={styles.grid__item}>
            <Typography sx={{ fontSize: "0.9rem" }}>
              Gewinn realisiert
            </Typography>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: "bold" }}>
              0,00 €
            </Typography>
            <Typography sx={{ color: "#ffffff88" }}>% von Invest</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%", marginTop: "3rem" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="transparent"
          sx={{
            "& .MuiTab-root": {
              color: "#ffffff80",
              "&.Mui-selected": {
                backgroundColor: "#ffffff08",
                color: "#ffffff",
                border: "none",
              },
            },
          }}
        >
          <Tab
            label="Tab 1"
            sx={{
              backgroundColor: value === 0 ? "#ffffff08" : "#00000033",
              marginRight: "15px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              fontWeight: value === 0 ? "bold" : "normal",
              color: value === 0 ? "#ffffff" : "#ffffff80",
            }}
          />
          <Tab
            label="Tab 2"
            sx={{
              backgroundColor: value === 1 ? "#ffffff08" : "#00000033",
              marginRight: "15px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              fontWeight: value === 1 ? "bold" : "normal",
            }}
          />
          <Tab
            label="Tab 3"
            sx={{
              backgroundColor: value === 2 ? "#ffffff08" : "#00000033",
              marginRight: "15px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              fontWeight: value === 2 ? "bold" : "normal",
            }}
          />
        </Tabs>
        <Box>
          {value === 0 && (
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
                    <TableCell>Aktion</TableCell>
                    <TableCell>Datum</TableCell>
                    <TableCell>Preis pro Coin</TableCell>
                    <TableCell>Betrag in EUR</TableCell>
                    <TableCell>Coins</TableCell>
                    <TableCell>Haltedauer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Render six rows */}
                  {rowVals.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          inputProps={{ "aria-label": "Without label" }}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={row.col1}
                          label="Age"
                          onChange={(e) =>
                            handleRowData(e.target.value, index, "col1")
                          }
                          // variant="filled"
                          sx={{
                            color: "white",
                            fontSize: "0.8rem",
                            border: "none",

                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "1px solid #ffffff20",
                            },

                            "& .MuiInputBase-root": {
                              border: "none",
                            },
                            "& .MuiSelect-select": {
                              border: "none",
                              padding: "5px",
                            },
                            "& .MuiSvgIcon-root": { color: "#ffffff" },
                          }}
                        >
                          <MenuItem value="Kauf">Kauf</MenuItem>
                          <MenuItem value="Verkauf">VerKauf</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div>
                          {/* <label htmlFor="datePicker">Select a date:</label> */}
                          <input
                            type="date"
                            id="datePicker"
                            value={row.col2}
                            onChange={(e) =>
                              handleRowData(e.target.value, index, "col2")
                            }
                            style={{
                              backgroundColor: "transparent",
                              border: "1px solid #ffffff20",
                              borderRadius: "4px",
                              padding: "5px",
                              marginRight: "auto",
                            }}
                          />
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
                            type="text"
                            id="numberInput"
                            value={row.col3}
                            onChange={(e) =>
                              handleRowData(
                                parseFloat(e.target.value) || 0,
                                index,
                                "col3"
                              )
                            }
                            style={{
                              marginRight: "5px",
                              width: "100px",
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                          />
                          <div>&euro;</div>
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
                            type="text"
                            id="numberInput"
                            value={row.col4}
                            onChange={(e) =>
                              handleRowData(
                                parseFloat(e.target.value) || 0,
                                index,
                                "col4"
                              )
                            }
                            style={{
                              marginRight: "5px",
                              width: "100px",
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                          />
                          <div>&euro;</div>
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
                            type="text"
                            id="numberInput"
                            value={row.col5}
                            onChange={(e) =>
                              handleRowData(
                                parseFloat(e.target.value) || 0,
                                index,
                                "col5"
                              )
                            }
                            style={{
                              marginRight: "5px",
                              width: "100px",
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button>
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ color: "#ffffff80" }}
                          />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {value === 1 && <div>Content for Tab 2</div>}
          {value === 2 && <div>Content for Tab 3</div>}
        </Box>
        <Button
          sx={{
            marginTop: "20px",
            backgroundColor: "#00000033",
            color: "white",
            fontSize: "0.8rem",
          }}
          onClick={addRow}
        >
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
          Neue Transaktion hinzufügen
        </Button>
      </Box>
    </Box>
  );
};

export default CoinDetails;
