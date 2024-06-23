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
import zoomPlugin from "chartjs-plugin-zoom";
import { StyleThemeButton } from "../StyledButton";

function LowToTopScatterLineWithoutXAxis({ data, bitcoin }) {
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

  let newData = processLowTopScatterLine(data, backgroundColor);

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
        type: "linear",

        display: false,
        grid: {
          display: false,
        },
        ticks: {
          align: "inner",
        },
      },
      y: {
        beginAtZero: true,
        type: "logarithmic",
        ticks: {
          callback: function (value) {
            return formatValue(value); // You can rotate or format the value here if needed
          },
        },
        min: 0.1,
        grid: {
          display: false,
        },
        offset: true,
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
              min: 0,
              max: data.length,
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
    datasets: newData,
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
          plugins={zoomPlugin}
          ref={chartRef}
        />
      </div>
      <StyleThemeButton ref={zoomButtonRef} onClick={handleResetZoom} />
    </>
  );
}

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

const processLowTopScatterLine = (data, backgroundColor, xRange = 100) => {
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
      // Generate a random x-value within the specified range
      let xValue = Math.random() * xRange;
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

export default LowToTopScatterLineWithoutXAxis;
