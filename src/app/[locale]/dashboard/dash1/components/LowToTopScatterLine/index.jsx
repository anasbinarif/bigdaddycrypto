"use client";
import { useRef } from "react";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LogarithmicScale,
  ScatterController,
} from "chart.js";
import { Chart as RChart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ChartAnnotation from "chartjs-plugin-annotation";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import zoomPlugin from "chartjs-plugin-zoom";
import { StyleThemeButton } from "../StyledButton";

function LowToTopScatterLine({ totalData, data, bitcoin, btcCsvData }) {
  ChartJS.register(
    Tooltip,
    Legend,
    ArcElement,
    ChartDataLabels,
    TimeScale,
    TimeSeriesScale,
    PointElement,
    LogarithmicScale,
    ChartAnnotation,
    CandlestickController,
    CandlestickElement,
    ScatterController,
    zoomPlugin
  );

  const chartRef = useRef(null);
  const zoomButtonRef = useRef(null);

  let backgroundColor = {
    "0X-17X": "#be1622",
    "17.1X-20.9X": "#d87a68",
    "21X-39.9X": "#cce2bc",
    "40X-99.9X": "#67b54d",
    "100X-999.9X": "#477f36",
    ">=1000X": "#f8ea49",
    Dead: "#0d0d0d",
  };

  function formatValue(value) {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + "B";
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + "K";
    } else {
      return value.toString();
    }
  }

  let newData = processLowTopScatterLine(data, backgroundColor);
  let minMaxXDate = getMinMaxXDate(totalData);

  const annotation = {
    type: "line",
    borderColor: "#000C66",
    borderWidth: 3,
    scaleID: "y",
    value: bitcoin,
    label: {
      backgroundColor: "transparent",
      content: "BTC",
      display: true,
    },
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    animation: false,
    layout: {
      padding: {
        left: 0,
        right: 60,
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
        },
        grid: {
          display: false,
        },
        beginAtZero: true,

        min: minMaxXDate?.minX,
        max: minMaxXDate?.maxX,
      },
      y: {
        beginAtZero: true,
        type: "logarithmic",
        min: 0.1,
        ticks: {
          callback: function (value, index, values) {
            return formatValue(value); // You can rotate or format the value here if needed
          },
        },
        grid: {
          display: false,
        },
        offset: true,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          display: false, // only want the grid lines for one axis to show up
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: true,
          },
          mode: "x",
          limits: {
            x: {
              min: minMaxXDate?.minX,
              max: minMaxXDate?.maxX,
            },
          },
          onZoom: ({ chart }) => {
            zoomButtonRef.current.style.display = "flex";
          },
        },
      },
      tooltip: {
        mode: "nearest",
        intersect: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label +=
                context.raw.name !== undefined
                  ? context.formattedValue + " (" + context.raw.name + ")"
                  : context.formattedValue;
            }
            return label;
          },
        },
      },
      annotation: {
        annotations: {
          annotation,
        },
      },
      datalabels: {
        display: false,
      },
    },
  };

  let scatterData = {
    datasets: [
      {
        type: "candlestick",
        label: "Candle Stick",
        data: candleStickDataProces(
          btcCsvData,
          minMaxXDate?.minX,
          minMaxXDate?.maxX
        ),
        backgroundColors: { up: "#01ff01", down: "#fe0000", unchanged: "#999" },
        yAxisID: "y1",
      },
      ...newData,
    ],
  };

  const handleResetZoom = () => {
    const chart = chartRef.current;
    if (chart) {
      chart.resetZoom();
      zoomButtonRef.current.style.display = "none";
    }
  };

  return (
    <>
      <div style={{ width: "100%", height: "90%" }}>
        <RChart
          options={options}
          data={scatterData}
          height={301}
          type="candlestick"
          plugins={zoomPlugin}
          ref={chartRef}
        />
      </div>
      <StyleThemeButton ref={zoomButtonRef} onClick={handleResetZoom} />
    </>
  );
}

const changeDateFormat = (originalDate) => {
  const timestamp = new Date(originalDate).getTime();
  return timestamp;
};

const getMinMaxXDate = (data) => {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;

  data.forEach((d, i) => {
    if (
      d["Date of Highest High"] !== undefined &&
      d["X Anstieg"] !== undefined &&
      !isNaN(d["X Anstieg"])
    ) {
      let xValue = changeDateFormat(d["Date of Highest High"]);

      if (xValue < minX) {
        minX = xValue;
      }
      if (xValue > maxX) {
        maxX = xValue;
      }
    }
  });

  return { minX, maxX };
};

const processLowTopScatterLine = (data, backgroundColor) => {
  let obj = {
    "0X-17X": [],
    "17.1X-20.9X": [],
    "21X-39.9X": [],
    "40X-99.9X": [],
    "100X-999.9X": [],
    ">=1000X": [],
    Dead: [],
  };

  let dataset = [];

  data.forEach((d) => {
    if (
      d["Date of Highest High"] !== undefined &&
      d["X Anstieg"] !== undefined &&
      !isNaN(d["X Anstieg"])
    ) {
      let xValue = changeDateFormat(d["Date of Highest High"]);
      d["X Anstieg"] = parseFloat(d["X Anstieg"]);

      // Determine category using a lookup function
      const category = getCategory(d);
      obj[category].push({
        x: xValue,
        y: d["X Anstieg"],
        name: d.Coin,
      });
    }
  });

  Object.keys(obj).forEach((d) => {
    dataset.push({
      type: "scatter",
      label: d,
      data: obj[d],
      backgroundColor: backgroundColor[d],
      trendlineLinear: {
        width: 2,
        lineStyle: "solid",
      },
      hidden: false,
      yAxisID: "y",
    });
  });

  return dataset;
};

function getCategory(d) {
  let value = parseFloat(d["X Anstieg"]);
  if (d["doa"] === "d") {
    return "Dead";
  } else if (value >= 0 && value <= 17) {
    return "0X-17X";
  } else if (value > 17 && value <= 20.9) {
    return "17.1X-20.9X";
  } else if (value > 20.9 && value <= 39.9) {
    return "21X-39.9X";
  } else if (value > 39.9 && value <= 99.9) {
    return "40X-99.9X";
  } else if (value > 99.9 && value <= 999.9) {
    return "100X-999.9X";
  } else {
    return ">=1000X";
  }
}

function getTimeStamp(dateString) {
  const [year, month, day] = dateString.split("-");

  // Create a new Date object with the specified year, month (0-indexed), and day
  const date = new Date(year, month - 1, day);

  // Get the timestamp by calling getTime() method on the Date object
  return date.getTime();
}

function candleStickDataProces(btcCsvData, minX, maxX) {
  let arr = [];

  btcCsvData.forEach((d, i) => {
    let timestamp = getTimeStamp(d.Date);
    if (timestamp >= minX && timestamp <= maxX) {
      arr.push({
        x: timestamp,
        o: parseFloat(d.Open),
        h: parseFloat(d.High),
        l: parseFloat(d.Low),
        c: parseFloat(d.Close),
      });
    }
  });

  return arr;
}

export default LowToTopScatterLine;
