"use client";
import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, useTheme } from "@mui/material";
import { useFormatter } from "next-intl";
import { usePDF } from "react-to-pdf";
import * as XLSX from "xlsx";
import { useTranslations } from "next-intl";
import DropdownWithSearch from "../DropdownWithSearch";
import XAnstiegeLowPieChart from "../XAnstiegeLowPieChart";
import XAnstiegeHorizontalBarChart from "../XAnstiegeHorizontalBarChart";
import AnstiegeBtcPieChart from "../AnstiegeBtcPieChart";
import AbfallePieChart from "../AbfallePieChart";
import AbfalleHorizontalBarChart from "../AbfalleBarChart";
import AbfalleBtcPieChart from "../AbfalleBtcPieChart";
import LowToTopScatterLine from "../LowToTopScatterLine";
import AltcoinsBottomNachScatterChart from "../AltcoinsBottomNachScatterChart";
import RankLowLineChart from "../RankLowLineChart";
import MarketLowLineChart from "../MarkeCapLowTop";
import RankTopLowLineChart from "../RankTopLowLineChart";
import MarketTopLowLineChart from "../MarketCapTopLowLineChart";
import AltcoinsBottomNachScatterWithoutXAxisChart from "../AltcoinsBottomNachScatterWithoutXAxisChart";
import LowToTopScatterLineWithoutXAxis from "../LowToTopScatterLineWithoutXAxis";
import DarkThemeCard from "../DarkThemeCard";
import DarkThemeValueCard from "../DarkThemeValueCard";
import DenseTable from "../PaginatedTable";
import {
  StylePDFButton,
  StyleExcelButton,
  StyleFullScreen,
} from "../StyledButton";
import ThemeSettings from "../ThemeSettingsButton";
import FullScreenModal from "../FullScreenModal";
import { StyledText } from "../StyledElements";
import LoadingCircle from "../../../../../../components/loading/Loading";

function MainPage({ expanded }) {
  const [filteredMcGroup, setFilteredMCGroup] = useState([]);
  const [filteredHaupt, setFilteredHaupt] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);

  const [open, setOpen] = useState(false);
  const handleModalOpen = (component) => {
    setOpen(true);
    setCurrentComponent(component);
  };
  const handleModalClose = () => setOpen(false);

  const [data, setData] = useState([]);

  const theme = useTheme();

  const { toPDF, targetRef } = usePDF({
    filename: "Bullrun 2021 Anstiege und Abfälle.pdf",
  });

  const [selectedFilters, setSelectedFilters] = useState([]);

  const [mcOptions, setMCOptions] = useState([]);

  const [hauptOptions, setHauptOptions] = useState([]);

  const [coinOptions, setCoinOptions] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const [bitcoinXAnstiege, setBitcoinXAnstiege] = useState(0);
  const [bitcoinPercentOfDownfall, setBitcoinPercentOfDownfall] = useState(0);

  const [avgXAnstiege, setAvgXAnstiege] = useState(0);
  const [mediaXAnstiege, setMediaXAnstiege] = useState(0);

  const [avgAbfalle, setAvgAbfalle] = useState(0);
  const [medianAbfalle, setMedianAbfalle] = useState(0);

  const [highAbfalle, setHighAbfalle] = useState(0);

  const [highXAnstiege, setHighXAnstiege] = useState(0);

  const [btcCsvData, setBtcCsvData] = useState([]);

  const [currentComponent, setCurrentComponent] = useState(<></>);

  const [loading, setLoading] = useState(false);

  const formatter = useFormatter();

  useEffect(() => {
    setLoading(true);
    handleOptionSelect();
    setLoading(false);
  }, [hauptOptions, mcOptions, coinOptions, data]);

  const t = useTranslations("dash");

  let weights = {
    "Top 10": 0,
    "bis 300 Mio": 1,
    "300-50 Mio": 2,
    "50-10 Mio": 3,
    "10-3 Mio": 4,
    "3-1 Mio": 5,
    "weniger als 1 Mio": 6,
  };

  const convertCsvToJson = (csv) => {
    csv = csv.replace(/\r/g, "");
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        if (headers[j].localeCompare("Percentage of Downfall") === 0) {
          obj[headers[j]] = Math.abs(currentLine[j]);
        } else {
          obj[headers[j]] = currentLine[j];
        }
      }

      result.push(obj);
    }

    return result;
  };

  const xAnstiegeLowPieChartDataProcessing = (data) => {
    let obj = {
      "0X-17X": 0,
      "17.1X-20.9X": 0,
      "21X-39.9X": 0,
      "40X-99.9X": 0,
      "100X-999.9X": 0,
      ">=1000X": 0,
    };

    data.forEach((d, i) => {
      if (d["X Anstieg"] >= 0 && d["X Anstieg"] <= 17) {
        obj["0X-17X"]++;
      } else if (d["X Anstieg"] > 17 && d["X Anstieg"] <= 20.9) {
        obj["17.1X-20.9X"]++;
      } else if (d["X Anstieg"] > 20.9 && d["X Anstieg"] <= 39.9) {
        obj["21X-39.9X"]++;
      } else if (d["X Anstieg"] > 39.9 && d["X Anstieg"] <= 99.9) {
        obj["40X-99.9X"]++;
      } else if (d["X Anstieg"] > 99.9 && d["X Anstieg"] <= 999.9) {
        obj["100X-999.9X"]++;
      } else if (d["X Anstieg"] > 999.9) {
        obj[">=1000X"]++;
      }
    });

    let arr = [];

    Object.keys(obj).forEach((d) => {
      arr.push(obj[d]);
    });

    return {
      labels: Object.keys(obj),
      data: arr,
    };
  };

  const fetchCsvData = async () => {
    try {
      const response = await fetch(`/final_data.xlsx`);
      if (!response.ok) {
        throw new Error("Failed to fetch Excel data");
      }

      const arrayBuffer = await response.arrayBuffer(); // Fetch the data as an ArrayBuffer

      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array", cellDates: true }); // Use cellDates to preserve dates

      // Assuming the first sheet is the one you want to work with
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON, specifying date format options
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        dateNF: "yyyy-mm-dd",
      });

      const processedData = jsonData.map((row) => {
        const processedRow = {};
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            const cell = row[key];
            if (typeof cell === "number" && cell > 25569 && cell < 2958465) {
              processedRow[key] = new Date(
                Math.round((cell - 25569) * 86400 * 1000)
              )
                .toISOString()
                .split("T")[0];
            } else {
              processedRow[key] = cell;
            }
          }
        }
        return processedRow;
      });

      processedData.forEach((d) => {
        d["Percentage of Downfall"] = Math.abs(
          d["Percentage of Downfall"] * 100
        );
      });
      return processedData;
    } catch (error) {
      console.error("Error fetching and converting Excel data:", error);
      return [];
    }
  };

  const handleExcelDownload = () => {
    // Create a temporary anchor element
    const link = document.createElement("a");
    // Set the href to the path of the Excel file in the public folder
    link.href = `./Bullrun 2021 Anstiege und Abfälle Table Data.xlsx`;
    // Set the download attribute with the file name
    link.download = "Bullrun 2021 Anstiege und Abfälle Table Data.xlsx";
    // Append the anchor to the body
    document.body.appendChild(link);
    // Programmatically click the anchor to trigger the download
    link.click();
    // Remove the anchor from the document
    document.body.removeChild(link);
  };

  const fetchBTCCsvData = async () => {
    try {
      const response = await fetch("./BTC-USD.csv");
      if (!response.ok) {
        throw new Error("Failed to fetch BTC CSV data");
      }
      const csvData = await response.text();
      return convertCsvToJson(csvData);
    } catch (error) {
      console.error("Error fetching BTC CSV data:", error);
      return [];
    }
  };

  const handleOptionSelect = (selectedOption = "") => {
    const mcOptionsSet = new Set(mcOptions.map((option) => option.option));
    const coinOptionsSet = new Set(coinOptions.map((option) => option.option));
    const hauptOptionsSet = new Set(
      hauptOptions.map((option) => option.option)
    );

    if (mcOptions.length > 0) {
      setSelectedFilters((prevFilters) => {
        if (!prevFilters.includes("mcOptions")) {
          return [...prevFilters, "mcOptions"];
        }
        return prevFilters;
      });
    } else {
      setSelectedFilters((prevFilters) =>
        prevFilters.filter((item) => item !== "mcOptions")
      );
    }

    if (hauptOptions.length > 0) {
      setSelectedFilters((prevFilters) => {
        if (!prevFilters.includes("hauptOptions")) {
          return [...prevFilters, "hauptOptions"];
        }
        return prevFilters;
      });
    } else {
      setSelectedFilters((prevFilters) =>
        prevFilters.filter((item) => item !== "hauptOptions")
      );
    }

    if (coinOptions.length > 0) {
      setSelectedFilters((prevFilters) => {
        if (!prevFilters.includes("coinOptions")) {
          return [...prevFilters, "coinOptions"];
        }
        return prevFilters;
      });
    } else {
      setSelectedFilters((prevFilters) =>
        prevFilters.filter((item) => item !== "coinOptions")
      );
    }

    // Filter data based on selected options
    const filteredData = data.filter((item, i) => {
      // Check if MC Gruppe matches any value in mcOptions
      let mcMatch = true,
        coinMatch = true,
        hauptMatch = true;

      if (mcOptions.length > 0) {
        // Check if any object in mcOptions array has an "option" key that matches item["MC Gruppe"]
        mcMatch = mcOptionsSet.has(item["MC Gruppe"]);
      }

      if (coinOptions.length > 0) {
        coinMatch = coinOptionsSet.has(item["Symbol"]);
      }

      if (hauptOptions.length > 0) {
        hauptMatch = hauptOptionsSet.has(item["Haupt-Kategorie"]);
      }

      // Return true if all options match
      return mcMatch && coinMatch && hauptMatch;
    });

    // Set the filtered data
    setFilteredData(filteredData);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const jsonData = await fetchCsvData();

      const btcLoadData = await fetchBTCCsvData();

      setBtcCsvData(btcLoadData);
      setData(jsonData);
      setFilteredData(jsonData);

      let bitcoin = jsonData.find((obj) => obj.Coin === "Bitcoin");

      if (bitcoin !== undefined) {
        setBitcoinXAnstiege(bitcoin?.["X Anstieg"]);
        setBitcoinPercentOfDownfall(bitcoin?.["Percentage of Downfall"]);
      }
    };
    fetchData();
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    setAvgXAnstiege(
      (
        filteredData
          .filter(
            (obj) =>
              obj &&
              obj["X Anstieg"] !== undefined &&
              obj["X Anstieg"] !== "" &&
              !isNaN(parseFloat(obj["X Anstieg"]))
          )
          .reduce((acc, obj) => acc + parseFloat(obj["X Anstieg"] || 0), 0) /
        filteredData.filter(
          (obj) =>
            obj &&
            obj["X Anstieg"] !== undefined &&
            obj["X Anstieg"] !== "" &&
            !isNaN(parseFloat(obj["X Anstieg"]))
        ).length
      ).toFixed(2)
      // .replace(/\./g, ",")
    );

    setAvgAbfalle(
      (
        filteredData
          .filter(
            (obj) =>
              obj &&
              obj["Percentage of Downfall"] !== undefined &&
              obj["Percentage of Downfall"] !== "" &&
              !isNaN(parseFloat(obj["Percentage of Downfall"]))
          )
          .reduce(
            (acc, obj) => acc + parseFloat(obj["Percentage of Downfall"] || 0),
            0
          ) /
        filteredData.filter(
          (obj) =>
            obj &&
            obj["Percentage of Downfall"] !== undefined &&
            obj["Percentage of Downfall"] !== "" &&
            !isNaN(parseFloat(obj["Percentage of Downfall"]))
        ).length
      ).toFixed(2)
      // .replace(/\./g, ",")
    );

    setMedianAbfalle(
      ((sortedPercentages, mid) =>
        sortedPercentages.length % 2 === 0
          ? (sortedPercentages[mid - 1] + sortedPercentages[mid]) / 2
          : sortedPercentages[mid])(
        filteredData
          .filter(
            (obj) =>
              obj &&
              obj["Percentage of Downfall"] !== undefined &&
              obj["Percentage of Downfall"] !== "" &&
              !isNaN(parseFloat(obj["Percentage of Downfall"]))
          )
          .map((obj) => parseFloat(obj["Percentage of Downfall"]))
          .sort((a, b) => a - b),
        Math.floor(
          filteredData.filter(
            (obj) =>
              obj &&
              obj["Percentage of Downfall"] !== undefined &&
              obj["Percentage of Downfall"] !== "" &&
              !isNaN(parseFloat(obj["Percentage of Downfall"]))
          ).length / 2
        )
      ).toFixed(2)
      // .replace(/\./g, ",")
    );

    setMediaXAnstiege(
      ((sortedPercentages, mid) =>
        sortedPercentages.length % 2 === 0
          ? (sortedPercentages[mid - 1] + sortedPercentages[mid]) / 2
          : sortedPercentages[mid])(
        filteredData
          .filter(
            (obj) =>
              obj &&
              obj["X Anstieg"] !== undefined &&
              obj["X Anstieg"] !== "" &&
              !isNaN(parseFloat(obj["X Anstieg"]))
          )
          .map((obj) => parseFloat(obj["X Anstieg"]))
          .sort((a, b) => a - b),
        Math.floor(
          filteredData.filter(
            (obj) =>
              obj &&
              obj["X Anstieg"] !== undefined &&
              obj["X Anstieg"] !== "" &&
              !isNaN(parseFloat(obj["X Anstieg"]))
          ).length / 2
        )
      ).toFixed(2)
      // .replace(/\./g, ",")
    );

    setHighAbfalle(
      filteredData
        .filter(
          (obj) =>
            obj &&
            obj["X Anstieg"] !== undefined &&
            obj["X Anstieg"] !== "" &&
            !isNaN(parseFloat(obj["X Anstieg"]))
        )
        .reduce(
          (count, d) =>
            count +
            (parseFloat(d["Percentage of Downfall"]) >= bitcoinPercentOfDownfall
              ? 1
              : 0),
          0
        )
    );

    setHighXAnstiege(
      filteredData
        .filter(
          (obj) =>
            obj &&
            obj["X Anstieg"] !== undefined &&
            obj["X Anstieg"] !== "" &&
            !isNaN(parseFloat(obj["X Anstieg"]))
        )
        .reduce(
          (count, d) =>
            count + (parseFloat(d["X Anstieg"]) >= bitcoinXAnstiege ? 1 : 0),
          0
        )
    );

    // if (filterType.localeCompare("Haupt-Kategorie") !== 0) {

    if (selectedFilters.includes("hauptOptions")) {
      const uniqueHaupt = [
        ...new Map(
          data.map((d) => [
            d["Haupt-Kategorie"],
            { option: d["Haupt-Kategorie"], label: d["Haupt-Kategorie"] },
          ])
        ).values(),
      ].sort((a, b) => a.label.localeCompare(b.label));

      setFilteredHaupt(uniqueHaupt);
    } else {
      const uniqueHaupt = [
        ...new Map(
          filteredData.map((d) => [
            d["Haupt-Kategorie"],
            { option: d["Haupt-Kategorie"], label: d["Haupt-Kategorie"] },
          ])
        ).values(),
      ].sort((a, b) => a.label.localeCompare(b.label));

      setFilteredHaupt(uniqueHaupt);
    }

    // }

    // if (filterType.localeCompare("MC Gruppe") !== 0) {
    if (selectedFilters.includes("mcOptions")) {
      const uniqueMCGroup = [
        ...new Map(
          data.map((d, i) => [
            d["MC Gruppe"],
            {
              option: d["MC Gruppe"],
              label: d["MC Gruppe"],
              weights: weights[d["MC Gruppe"]],
            },
          ])
        ).values(),
      ].sort((a, b) => parseFloat(a.weights) - parseFloat(b.weights));
      setFilteredMCGroup(uniqueMCGroup);
    } else {
      const uniqueMCGroup = [
        ...new Map(
          filteredData.map((d, i) => [
            d["MC Gruppe"],
            {
              option: d["MC Gruppe"],
              label: d["MC Gruppe"],
              weights: weights[d["MC Gruppe"]],
            },
          ])
        ).values(),
      ].sort((a, b) => parseFloat(a.weights) - parseFloat(b.weights));
      setFilteredMCGroup(uniqueMCGroup);
    }
    // }

    // if (filterType.localeCompare("Coins") !== 0) {
    if (selectedFilters.includes("coinOptions")) {
      let uniqueCoins = data
        .map((d) => {
          return {
            option: d["Symbol"],
            label: d["Coin"] + " " + d["Symbol"],
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));

      setFilteredCoins(uniqueCoins);
    } else {
      let uniqueCoins = filteredData
        .map((d) => {
          return {
            option: d["Symbol"],
            label: d["Coin"] + " " + d["Symbol"],
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));

      setFilteredCoins(uniqueCoins);
    }
    // }
    setLoading(false);
  }, [filteredData]);

  return !expanded ? (
    <div>Click to Expand</div>
  ) : loading ? (
    <div style={{ backgroundColor: "#111826", height: "100vh" }}>
      <LoadingCircle />
    </div>
  ) : (
    <div
      style={{
        background: "#111826",
        padding: 11,
        margin: 0,
      }}
    >
      <ThemeSettings />

      <FullScreenModal
        open={open}
        handleClose={handleModalClose}
        component={currentComponent}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          float: "right",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "end", mt: 2.5 }}>
          <StyleExcelButton
            onClick={() => handleExcelDownload()}
            text="Download Table as Excel"
          />
          <StylePDFButton
            onClick={() => toPDF()}
            text="Download PDF"
            extraStyles={{ marginLeft: 11 }}
          />
        </Box>
      </Box>

      <br />
      <div
        ref={targetRef}
        style={{
          background: "#111826",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            textAlign="center"
            color="#fff"
            sx={{ margin: "revert", width: "33%", textAlign: "end" }}
          >
            {t("X-Anstiege")} 2018-2021
          </Typography>
          <Typography
            variant="h4"
            textAlign="center"
            color="#fff"
            sx={{
              margin: "revert",
              pl: 1,
              pr: 1,
              width: "33%",
              fontSize: "31px",
              textAlign: "center",
            }}
          >
            Bullrun 2021 {t("Anstiege und Abfälle")}
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="#fff"
            sx={{ margin: "revert", width: "33%", textAlign: "start" }}
          >
            2021-2023 {t("Abfälle")}
          </Typography>
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1, // Ensures it stays above other content while scrolling
            backgroundColor: "#fff",
          }}
        >
          <Grid item xs={4} sx={{ background: "#111826" }}>
            <DropdownWithSearch
              options={filteredMcGroup}
              onSelect={handleOptionSelect}
              label={t("MC Gruppe")}
              value={mcOptions}
              setValue={setMCOptions}
              cookieName="MC Gruppe"
              // setFilterType={setFilterType}
            />
          </Grid>

          <Grid item xs={4} sx={{ background: "#111826" }}>
            <DropdownWithSearch
              options={filteredHaupt}
              onSelect={handleOptionSelect}
              label={t("Haupt-Kategorie")}
              value={hauptOptions}
              setValue={setHauptOptions}
              cookieName="Haupt-Kategorie"
              // setFilterType={setFilterType}
            />
          </Grid>

          <Grid item xs={4} sx={{ background: "#111826" }}>
            <DropdownWithSearch
              options={filteredCoins}
              onSelect={handleOptionSelect}
              label="Coins"
              value={coinOptions}
              setValue={setCoinOptions}
              cookieName="Coins"
              // setFilterType={setFilterType}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={2}>
          <Grid item sm={2} xs={6}>
            <DarkThemeValueCard
              title={"∅ " + t("X-Anstiege")}
              // value={formatNumberWithCommas(parseFloat(avgXAnstiege))}
              value={formatter.number(avgXAnstiege, {
                maximumFractionDigits: 2,
              })}
            />
          </Grid>
          <Grid item sm={2} xs={6}>
            <DarkThemeValueCard
              title={"Median " + t("X-Anstiege")}
              // value={formatNumberWithCommas(parseFloat(mediaXAnstiege))}
              value={formatter.number(mediaXAnstiege, {
                maximumFractionDigits: 2,
              })}
            />
          </Grid>
          <Grid item sm={2} xs={6}>
            <DarkThemeValueCard
              title={`${t("Anstiege")} > BTC`}
              value={`${formatter.number(
                (highXAnstiege / filteredData.length) * 100,
                {
                  maximumFractionDigits: 2,
                }
              )}%`}
              valueStyle={theme.typography.greenText}
            />
          </Grid>
          <Grid item sm={2} xs={6}>
            <DarkThemeValueCard
              title={`${t("Abfälle")} > BTC`}
              value={`${formatter.number(
                (highAbfalle / filteredData.length) * 100,
                {
                  maximumFractionDigits: 2,
                }
              )}%`}
              valueStyle={theme.typography.redText}
            />
          </Grid>
          <Grid item sm={2} xs={6}>
            <DarkThemeValueCard
              title={`Median ${t("Abfälle")}`}
              // value={"-" + formatNumberWithCommas(parseFloat(medianAbfalle))}
              value={
                "-" +
                formatter.number(medianAbfalle, {
                  maximumFractionDigits: 2,
                }) +
                "%"
              }
            />
          </Grid>
          <Grid item sm={2} xs={6}>
            <DarkThemeValueCard
              title={`∅ ${t("Abfälle")}`}
              // value={"-" + formatNumberWithCommas(parseFloat(avgAbfalle))}
              value={
                "-" +
                formatter.number(avgAbfalle, {
                  maximumFractionDigits: 2,
                }) +
                "%"
              }
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={2}>
          <Grid item={4} sm={4} xs={12}>
            <DarkThemeCard
              title={`${t("X-Anstiege")} Bullrun 2021`}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText text={`${t("X-Anstiege")} Bullrun 2021`} />
                        <div style={{ height: "90%" }}>
                          <XAnstiegeLowPieChart
                            data={xAnstiegeLowPieChartDataProcessing(
                              filteredData
                            )}
                          />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <XAnstiegeLowPieChart
                data={xAnstiegeLowPieChartDataProcessing(filteredData)}
              />
            </DarkThemeCard>
            <br />
            <DarkThemeCard
              title={`${t("X-Anstiege")} Bullrun 2021`}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText text={`${t("X-Anstiege")} Bullrun 2021`} />
                        <div style={{ height: "90%" }}>
                          <XAnstiegeHorizontalBarChart
                            data={xAnstiegeLowPieChartDataProcessing(
                              filteredData
                            )}
                          />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <XAnstiegeHorizontalBarChart
                data={xAnstiegeLowPieChartDataProcessing(filteredData)}
              />
            </DarkThemeCard>
            <br />
            <DarkThemeCard
              title={`${t("Anstiege")} BTC`}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText text="Anstiege BTC" />
                        <div style={{ height: "90%" }}>
                          <AnstiegeBtcPieChart
                            data={filteredData}
                            btc={bitcoinXAnstiege}
                          />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <AnstiegeBtcPieChart data={filteredData} btc={bitcoinXAnstiege} />
            </DarkThemeCard>
            <br />
            <DarkThemeCard
              title={`${t("X-Anstiege")} Bullrun 2021 ${t("visualisiert")}`}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText
                          text={`${t("X-Anstiege")} Bullrun 2021 ${t(
                            "visualisiert"
                          )}`}
                        />
                        <div style={{ height: "90%" }}>
                          <LowToTopScatterLineWithoutXAxis
                            data={filteredData}
                            bitcoin={bitcoinXAnstiege}
                          />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <LowToTopScatterLineWithoutXAxis
                data={filteredData}
                bitcoin={bitcoinXAnstiege}
              />
            </DarkThemeCard>
            <br />
            <DarkThemeCard
              title={`${t("X-Anstiege")} Bullrun 2021 (BTC ${t(
                "Korrelation"
              )})`}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText
                          text={`${t("X-Anstiege")} Bullrun 2021 (BTC ${t(
                            "Korrelation"
                          )})`}
                        />
                        <div style={{ height: "90%" }}>
                          <LowToTopScatterLine
                            data={filteredData}
                            bitcoin={bitcoinXAnstiege}
                            btcCsvData={btcCsvData}
                            totalData={data}
                          />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <LowToTopScatterLine
                data={filteredData}
                bitcoin={bitcoinXAnstiege}
                btcCsvData={btcCsvData}
                totalData={data}
              />
            </DarkThemeCard>
            <br />
            <DarkThemeCard
              title={"Rank Low - Top"}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText text="Rank Low - Top" />
                        <div style={{ height: "90%" }}>
                          <RankLowLineChart data={filteredData} />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <RankLowLineChart data={filteredData} />
            </DarkThemeCard>
            <br />
            <DarkThemeCard
              title={"Market Cap Low - Top"}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText text="Market Cap Low - Top" />
                        <div style={{ height: "90%" }}>
                          <MarketLowLineChart data={filteredData} />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <MarketLowLineChart data={filteredData} />
            </DarkThemeCard>
          </Grid>
          <Grid item={4} sm={4} xs={12}>
            <DenseTable data={filteredData} />
          </Grid>
          <Grid item={4} sm={4} xs={12}>
            <DarkThemeCard
              title={`${t("Abfälle")} ${t("Bärenmarkt nach")} 2021`}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText
                          text={`${t("Abfälle")} ${t("Bärenmarkt nach")} 2021`}
                        />
                        <div style={{ height: "90%" }}>
                          <AbfallePieChart data={filteredData} />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <AbfallePieChart data={filteredData} />
            </DarkThemeCard>
            <br />
            <DarkThemeCard
              title={`${t("Abfälle")} ${t("Bärenmarkt nach")} 2021`}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText
                          text={`${t("Abfälle")} ${t("Bärenmarkt nach")} 2021`}
                        />
                        <div style={{ height: "90%" }}>
                          <AbfalleHorizontalBarChart data={filteredData} />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <AbfalleHorizontalBarChart data={filteredData} />
            </DarkThemeCard>
            <br />
            <DarkThemeCard
              title={`BTC ${t("Abfälle")}`}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText text={`BTC ${t("Abfälle")}`} />
                        <div style={{ height: "90%" }}>
                          <AbfalleBtcPieChart
                            data={filteredData}
                            bitcoin={bitcoinPercentOfDownfall}
                          />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <AbfalleBtcPieChart
                data={filteredData}
                bitcoin={bitcoinPercentOfDownfall}
              />
            </DarkThemeCard>
            <br />
            <DarkThemeCard
              title={t("Bottom der Coins Bärenmarkt nach 2021 visualisiert")}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText
                          text={t(
                            "Bottom der Coins Bärenmarkt nach 2021 visualisiert"
                          )}
                        />
                        <div style={{ height: "90%" }}>
                          <AltcoinsBottomNachScatterWithoutXAxisChart
                            data={filteredData}
                            bitcoin={bitcoinPercentOfDownfall}
                          />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <AltcoinsBottomNachScatterWithoutXAxisChart
                data={filteredData}
                bitcoin={bitcoinPercentOfDownfall}
              />
            </DarkThemeCard>
            <br />
            <DarkThemeCard
              title={`${t("Bottom der Coins")} ${t(
                "Bärenmarkt nach"
              )} 2021 (BTC ${t("Korrelation")})`}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText
                          text={`${t("Bottom der Coins")} ${t(
                            "Bärenmarkt nach"
                          )} 2021 (BTC ${t("Korrelation")})`}
                        />
                        <div style={{ height: "90%" }}>
                          <AltcoinsBottomNachScatterChart
                            data={filteredData}
                            btcCsvData={btcCsvData}
                            totalData={data}
                            bitcoin={bitcoinPercentOfDownfall}
                          />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <AltcoinsBottomNachScatterChart
                data={filteredData}
                btcCsvData={btcCsvData}
                totalData={data}
                bitcoin={bitcoinPercentOfDownfall}
              />
            </DarkThemeCard>
            <br />
            <DarkThemeCard
              title={"Rank Top - Low"}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText text="Rank Top - Low" />
                        <div style={{ height: "90%" }}>
                          <RankTopLowLineChart data={filteredData} />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <RankTopLowLineChart data={filteredData} />
            </DarkThemeCard>
            <br />
            <DarkThemeCard
              title={"Market Cap Top - Low"}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText text="Market Cap Top - Low" />
                        <div style={{ height: "90%" }}>
                          <MarketTopLowLineChart data={filteredData} />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <MarketTopLowLineChart data={filteredData} />
            </DarkThemeCard>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default MainPage;
