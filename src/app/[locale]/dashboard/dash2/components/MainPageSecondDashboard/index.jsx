"use client";
import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, useTheme } from "@mui/material";
import { useFormatter } from "next-intl";
import { usePDF } from "react-to-pdf";
import * as XLSX from "xlsx";
import { useTranslations } from "next-intl";
import DropdownWithSearch from "../DropdownWithSearch";

import AbfallePieChart from "../AbfallePieChart";
import AbfalleHorizontalBarChart from "../AbfalleBarChart";
import AbfalleBtcPieChart from "../AbfalleBtcPieChart";
import BtcAvgVsAltcoinsAvgBar from "../BtcAvgVsAltcoinsAvgBar";
import AltcoinsBottomNachScatterChart from "../AltcoinsBottomNachScatterChart";
// import KorrelationChart from "../KorrelationChart";
import AltcoinsBottomNachScatterWithoutXAxisChart from "../AltcoinsBottomNachScatterWithoutXAxisChart";
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
  const [filteredRanges, setFilteredRanges] = useState([]);

  const [open, setOpen] = useState(false);
  const handleModalOpen = (component) => {
    setOpen(true);
    setCurrentComponent(component);
  };
  const handleModalClose = () => setOpen(false);

  const [data, setData] = useState([]);

  const theme = useTheme();

  const { toPDF, targetRef } = usePDF({
    filename: "Altcoins BTC Correlation Bullrun 2021.pdf",
  });

  const [selectedFilters, setSelectedFilters] = useState([]);

  const [mcOptions, setMCOptions] = useState([]);

  const [hauptOptions, setHauptOptions] = useState([]);

  const [rangeOptions, setRangeOptions] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const [avgData, setAvgData] = useState([]);

  const [bitcoinPercentOfDownfall, setBitcoinPercentOfDownfall] = useState(0);

  const [avgAbfalle, setAvgAbfalle] = useState(0);

  const [highAbfalle, setHighAbfalle] = useState(0);
  const [lowAbfalle, setLowAbfalle] = useState(0);

  const [avgDays, setAvgDays] = useState(0);

  const [currentComponent, setCurrentComponent] = useState(<></>);

  const [btcCsvData, setBtcCsvData] = useState([]);

  const [loading, setLoading] = useState(true);
  const formatter = useFormatter();

  useEffect(() => {
    setLoading(true);
    handleOptionSelect();

    setLoading(false);
  }, [hauptOptions, mcOptions, rangeOptions, data]);

  const t = useTranslations();

  let weights = {
    "Top 10": 0,
    "bis 300 Mio": 1,
    "300-50 Mio": 2,
    "50-10 Mio": 3,
    "10-3 Mio": 4,
    "3-1 Mio": 5,
    "weniger als 1 Mio": 6,
  };

  const fetchCsvData = async () => {
    try {
      const response = await fetch(`/Modified.xlsx`);
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
    link.href = `./Modified.xlsx`;
    // Set the download attribute with the file name
    link.download = "Modified.xlsx";
    // Append the anchor to the body
    document.body.appendChild(link);
    // Programmatically click the anchor to trigger the download
    link.click();
    // Remove the anchor from the document
    document.body.removeChild(link);
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
    const coinOptionsSet = new Set(rangeOptions.map((option) => option.option));
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

    if (rangeOptions.length > 0) {
      setSelectedFilters((prevFilters) => {
        if (!prevFilters.includes("rangeOptions")) {
          return [...prevFilters, "rangeOptions"];
        }
        return prevFilters;
      });
    } else {
      setSelectedFilters((prevFilters) =>
        prevFilters.filter((item) => item !== "rangeOptions")
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

      if (rangeOptions.length > 0) {
        coinMatch = coinOptionsSet.has(item["range"]);
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
    const fetchData = async () => {
      const jsonData = await fetchCsvData();
      const btcLoadData = await fetchBTCCsvData();

      setBtcCsvData(btcLoadData);

      setData(jsonData);
      setFilteredData(jsonData);
    };
    fetchData();
    setLoading(false);
  }, []);

  function calculateDaysDifference(range) {
    let [start, end] = range.split(" to ");

    start = start.trim().split(" - ")[0]; // Extract the date part from the start range
    end = end.trim().split(" - ")[0]; // Extract the date part from the end range

    let startDate = new Date(start);
    let endDate = new Date(end);
    let differenceInTime = endDate - startDate;

    return differenceInTime / (1000 * 3600 * 24); // Convert time difference from milliseconds to days
  }

  useEffect(() => {
    let coinData = {};
    setLoading(true);

    // Iterate through each object in the array
    filteredData.forEach((obj) => {
      // Check if the coin already exists in coinData
      if (coinData[obj.Coin] === undefined) {
        // If not, initialize sums and counts for the coin
        coinData[obj.Coin] = {
          "Percentage of Downfall": obj["Percentage of Downfall"],
          count: 1,
          mccount:
            obj["MC at Highest High"] !== undefined &&
            !isNaN(parseFloat(obj["MC at Highest High"]))
              ? 1
              : 0,
          doa: obj.doa,
          ID: obj.ID,
          "MC Gruppe": obj["MC Gruppe"],
          Coin: obj.Coin,
          Symbol: obj.Symbol,
          "Haupt-Kategorie": obj["Haupt-Kategorie"],
          "Date of Lowest Low After": obj["Date of Lowest Low After"],
          "MC at Highest High":
            obj["MC at Highest High"] !== undefined &&
            !isNaN(parseFloat(obj["MC at Highest High"]))
              ? parseFloat(obj["MC at Highest High"])
              : 0,
          ranges: new Set([obj.range]),
        };
      } else {
        // If the coin exists, add the "Percentage of Downfall" to the sum and increment the count
        coinData[obj.Coin]["Percentage of Downfall"] +=
          obj["Percentage of Downfall"];
        coinData[obj.Coin]["MC at Highest High"] =
          obj["MC at Highest High"] !== undefined &&
          !isNaN(parseFloat(obj["MC at Highest High"]))
            ? coinData[obj.Coin]["MC at Highest High"] +
              parseFloat(obj["MC at Highest High"])
            : coinData[obj.Coin]["MC at Highest High"] + 0;
        coinData[obj.Coin].mccount =
          obj["MC at Highest High"] !== undefined &&
          !isNaN(parseFloat(obj["MC at Highest High"]))
            ? coinData[obj.Coin].mccount + 1
            : coinData[obj.Coin].mccount;
        coinData[obj.Coin].count++;
        coinData[obj.Coin].ranges.add(obj.range); // Add the range to the set of ranges
      }
    });

    // Calculate the average for each coin and store it in coinData
    for (let coin in coinData) {
      coinData[coin]["Percentage of Downfall"] =
        coinData[coin]["Percentage of Downfall"] / coinData[coin].count;
      coinData[coin]["MC at Highest High"] =
        coinData[coin].mccount > 0
          ? coinData[coin]["MC at Highest High"] / coinData[coin].mccount
          : coinData[coin]["MC at Highest High"];
    }

    // Create a new array with unique entries for each coin
    let newData = Object.values(coinData);

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
    if (selectedFilters.includes("rangeOptions")) {
      const uniqueRanges = [
        ...new Map(
          data.map((d) => [
            d["range"],
            { option: d["range"], label: d["range"] },
          ])
        ).values(),
      ].sort((a, b) => a.label.localeCompare(b.label));

      setFilteredRanges(uniqueRanges);
    } else {
      const uniqueRanges = [
        ...new Map(
          filteredData.map((d) => [
            d["range"],
            { option: d["range"], label: d["range"] },
          ])
        ).values(),
      ].sort((a, b) => a.label.localeCompare(b.label));

      setFilteredRanges(uniqueRanges);
    }

    let allUniqueRanges = new Set();
    for (let coin in coinData) {
      coinData[coin].ranges.forEach((range) => allUniqueRanges.add(range));
    }

    // Calculate the total days difference and average days difference
    let totalDaysDifference = 0;
    let uniqueRangesArray = Array.from(allUniqueRanges);
    uniqueRangesArray.forEach((range) => {
      totalDaysDifference += calculateDaysDifference(range);
    });
    let averageDaysDifference = totalDaysDifference / uniqueRangesArray.length;

    setAvgDays(averageDaysDifference);

    let bitcoinObjects = filteredData.filter((obj) => obj.Coin === "Bitcoin");

    if (bitcoinObjects.length > 0) {
      // Calculate the average of the "Percentage of Downfall"
      let totalDownfall = bitcoinObjects.reduce(
        (sum, obj) => sum + parseFloat(obj["Percentage of Downfall"]),
        0
      );
      let averageDownfall = totalDownfall / bitcoinObjects.length;

      // Set the average downfall
      setBitcoinPercentOfDownfall(averageDownfall);
    }

    setAvgData(newData);

    setAvgAbfalle(
      (
        newData
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
        newData.filter(
          (obj) =>
            obj &&
            obj["Percentage of Downfall"] !== undefined &&
            obj["Percentage of Downfall"] !== "" &&
            !isNaN(parseFloat(obj["Percentage of Downfall"]))
        ).length
      ).toFixed(2)
    );

    // setHighAbfalle(
    //   newData
    //     .filter(
    //       (obj) =>
    //         obj &&
    //         obj["Percentage of Downfall"] !== undefined &&
    //         obj["Percentage of Downfall"] !== "" &&
    //         !isNaN(parseFloat(obj["Percentage of Downfall"]))
    //     )
    //     .reduce(
    //       (count, d) =>
    //         count +
    //         (parseFloat(d["Percentage of Downfall"]) >= bitcoinPercentOfDownfall
    //           ? 1
    //           : 0),
    //       0
    //     )
    // );

    // setLowAbfalle(
    //   newData
    //     .filter(
    //       (obj) =>
    //         obj &&
    //         obj["Percentage of Downfall"] !== undefined &&
    //         obj["Percentage of Downfall"] !== "" &&
    //         !isNaN(parseFloat(obj["Percentage of Downfall"]))
    //     )
    //     .reduce(
    //       (count, d) =>
    //         count +
    //         (parseFloat(d["Percentage of Downfall"]) < bitcoinPercentOfDownfall
    //           ? 1
    //           : 0),
    //       0
    //     )
    // );
    setLoading(false);
  }, [filteredData]);

  useEffect(() => {
    setLoading(true);
    setHighAbfalle(
      avgData
        .filter(
          (obj) =>
            obj &&
            obj["Percentage of Downfall"] !== undefined &&
            obj["Percentage of Downfall"] !== "" &&
            !isNaN(parseFloat(obj["Percentage of Downfall"]))
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

    setLowAbfalle(
      avgData
        .filter(
          (obj) =>
            obj &&
            obj["Percentage of Downfall"] !== undefined &&
            obj["Percentage of Downfall"] !== "" &&
            !isNaN(parseFloat(obj["Percentage of Downfall"]))
        )
        .reduce(
          (count, d) =>
            count +
            (parseFloat(d["Percentage of Downfall"]) < bitcoinPercentOfDownfall
              ? 1
              : 0),
          0
        )
    );
    setLoading(false);
  }, [avgData]);

  return !expanded ? (
    <div>Click to expand</div>
  ) : loading ? (
    <div style={{ height: "100vh", backgroundColor: "#111826" }}>
      <LoadingCircle />
    </div>
  ) : (
    <div
      style={{
        background: theme.colors.mainBackgroundColor,
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
          {/* <StyledNavigateButton text="Dashboard 1" href="/" /> */}
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
          background: theme.colors.mainBackgroundColor,
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
            color={theme.colors.textColor}
            sx={{ margin: "revert", width: "33%", textAlign: "end" }}
          ></Typography>
          <Typography
            variant="h4"
            textAlign="center"
            color={theme.colors.textColor}
            sx={{
              margin: "revert",
              pl: 1,
              pr: 1,
              width: "33%",
              fontSize: "31px",
              textAlign: "center",
            }}
          >
            Altcoins BTC {t("Korrektur Korrelation")} Bullrun 2021
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color={theme.colors.textColor}
            sx={{ margin: "revert", width: "33%", textAlign: "start" }}
          >
            BTC Bottom 2018-2021 BTC Top
          </Typography>
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1, // Ensures it stays above other content while scrolling
            backgroundColor: theme.colors.textColor,
          }}
        >
          <Grid
            item
            xs={4}
            sx={{ background: theme.colors.mainBackgroundColor }}
          >
            <DropdownWithSearch
              options={filteredRanges}
              onSelect={handleOptionSelect}
              label={t("Reichweite")}
              value={rangeOptions}
              setValue={setRangeOptions}

              // setFilterType={setFilterType}
            />
          </Grid>
          <Grid
            item
            xs={4}
            sx={{ background: theme.colors.mainBackgroundColor }}
          >
            <DropdownWithSearch
              options={filteredMcGroup}
              onSelect={handleOptionSelect}
              label={t("MC Gruppe")}
              value={mcOptions}
              setValue={setMCOptions}

              // setFilterType={setFilterType}
            />
          </Grid>

          <Grid
            item
            xs={4}
            sx={{ background: theme.colors.mainBackgroundColor }}
          >
            <DropdownWithSearch
              options={filteredHaupt}
              onSelect={handleOptionSelect}
              label={t("Haupt-Kategorie")}
              value={hauptOptions}
              setValue={setHauptOptions}

              // setFilterType={setFilterType}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={2}>
          <Grid item sm={3} xs={6}>
            <DarkThemeValueCard
              title={`∅ ${t("Abfälle")}`}
              value={
                "-" +
                formatter.number(avgAbfalle, {
                  maximumFractionDigits: 2,
                }) +
                "%"
              }
            />
          </Grid>
          <Grid item sm={3} xs={6}>
            <DarkThemeValueCard
              title={t("Haltedauer der Korrektur(en)")}
              value={
                formatter.number(avgDays, {
                  maximumFractionDigits: 2,
                }) +
                " " +
                t("Tage")
              }
            />
          </Grid>
          <Grid item sm={3} xs={6}>
            <DarkThemeValueCard
              title={`${t("Abfälle")} > BTC`}
              value={formatter.number(highAbfalle, {
                maximumFractionDigits: 2,
              })}
            />
          </Grid>

          <Grid item sm={3} xs={6}>
            <DarkThemeValueCard
              title={`${t("Korrelation")} BTC`}
              value={
                "-" +
                formatter.number(bitcoinPercentOfDownfall, {
                  maximumFractionDigits: 2,
                }) +
                "% " +
                t("zu") +
                " -" +
                formatter.number(avgAbfalle, {
                  maximumFractionDigits: 2,
                }) +
                "%"
              }
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={2} p={1}>
          <Grid item sm={6} xs={12}>
            <DenseTable data={avgData} xanstiege={false} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <DarkThemeCard
              title={`BTC ${t("Abfälle")} vs Altcoins`}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText text={`BTC ${t("Abfälle")} vs Altcoins`} />
                        <div style={{ height: "90%" }}>
                          <BtcAvgVsAltcoinsAvgBar
                            data={{
                              labels: ["BTC", "Altcoins"],
                              data: [bitcoinPercentOfDownfall, avgAbfalle],
                            }}
                          />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <BtcAvgVsAltcoinsAvgBar
                data={{
                  labels: ["BTC", "Altcoins"],
                  data: [bitcoinPercentOfDownfall, avgAbfalle],
                }}
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
                            data={avgData}
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
                data={avgData}
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
                          <AltcoinsBottomNachScatterChart
                            data={avgData}
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
                data={avgData}
                btcCsvData={btcCsvData}
                totalData={data}
                bitcoin={bitcoinPercentOfDownfall}
              />
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
                          <AbfallePieChart data={avgData} />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <AbfallePieChart data={avgData} />
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
                          <AbfalleHorizontalBarChart data={avgData} />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <AbfalleHorizontalBarChart data={avgData} />
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
                            highAbfalle={highAbfalle}
                            lowAbfalle={lowAbfalle}
                          />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <AbfalleBtcPieChart
                highAbfalle={highAbfalle}
                lowAbfalle={lowAbfalle}
              />
            </DarkThemeCard>
            {/* <br />
            <DarkThemeCard
              title={`${t("Korrelation")} Chart`}
              FullScreenButton={
                <StyleFullScreen
                  extraStyles={{ position: "absolute", top: -15, right: 0 }}
                  onClick={() =>
                    handleModalOpen(
                      <>
                        <StyledText text={`${t("Korrelation Chart")}`} />
                        <div style={{ height: "90%" }}>
                          <KorrelationChart data={avgData} />
                        </div>
                      </>
                    )
                  }
                />
              }
            >
              <KorrelationChart data={avgData} />
            </DarkThemeCard> */}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default MainPage;
