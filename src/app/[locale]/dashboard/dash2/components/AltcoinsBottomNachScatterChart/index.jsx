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

function AltcoinsBottomNachScatterChart({
  totalData,
  data,
  btcCsvData,
  bitcoin,
}) {
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
    "-0%--10%": "#064b21",
    "-10%--20%": "#067531",
    "-20%--30%": "#a3cd83",
    "-30%--40%": "#f6e832",
    "-40%--50%": "#f6a62b",
    "-50%--60%": "#ed6a1d",
    "-60%--70%": "#ea513e",
    "-70%--80%": "#e31d13",
    "-80%--90%": "#e73625",
    "-90%--99.97%": "#a81923",
    "-99.97%--100%": "#0d0d0d",
  };

  const annotation = {
    type: "line",
    borderColor: "#000C66",
    borderWidth: 3,
    scaleID: "y",
    value: -1 * bitcoin,
    label: {
      backgroundColor: "transparent",
      content: "BTC",
      display: true,
    },
  };

  let newData = processLowTopScatterLine(data, backgroundColor);
  let minMaxXDate = getMinMaxXDate(totalData);

  const options = {
    // Use ChartOptions type for options

    maintainAspectRatio: false,
    responsive: true,
    spanGaps: true, // enable for all datasets,
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
        ticks: {
          align: "inner",
        },
      },
      y: {
        beginAtZero: true,
        type: "linear",
        max: 0,
        min: -100,
        // ticks: {
        //   callback: function (val, index) {
        //     return "-" + val;
        //   },
        // },
        grid: {
          display: false,
        },
        offset: true,
        // reverse: true,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        min: 0,
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

  let pieData = {
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
      <div style={{ width: "100%", height: "91%" }}>
        <RChart
          type="candlestick"
          options={options}
          data={pieData}
          height={301}
          plugins={zoomPlugin}
          ref={chartRef}
        />
      </div>
      <StyleThemeButton ref={zoomButtonRef} onClick={handleResetZoom} />
    </>
  );
}

const changeDateFormat = (originalDate) => {
  if (!originalDate) {
    return;
  }

  const timestamp = new Date(originalDate).getTime();
  return timestamp;
};

const getMinMaxXDate = (data) => {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;

  data.forEach((d, i) => {
    if (
      d["Date of Lowest Low After"] !== undefined &&
      d["Percentage of Downfall"] !== undefined &&
      !isNaN(d["Percentage of Downfall"])
    ) {
      let xValue = changeDateFormat(d["Date of Lowest Low After"]);

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
    "-0%--10%": [],
    "-10%--20%": [],
    "-20%--30%": [],
    "-30%--40%": [],
    "-40%--50%": [],
    "-50%--60%": [],
    "-60%--70%": [],
    "-70%--80%": [],
    "-80%--90%": [],
    "-90%--99.97%": [],
    "-99.97%--100%": [],
  };

  data.forEach((d) => {
    if (
      d["Date of Lowest Low After"] !== undefined &&
      d["Percentage of Downfall"] !== undefined &&
      !isNaN(d["Percentage of Downfall"])
    ) {
      d["Percentage of Downfall"] = parseFloat(d["Percentage of Downfall"]);
      let xValue = changeDateFormat(d["Date of Lowest Low After"]);

      // if (d["doa"] === "d") {
      //   obj["Dead"].push({
      //     x: xValue,
      //     y: -1 * parseFloat(d["Percentage of Downfall"]),
      //     name: d.Coin,
      //   });
      // } else
      if (
        d["Percentage of Downfall"] >= 0 &&
        d["Percentage of Downfall"] <= 10
      ) {
        obj["-0%--10%"].push({
          x: xValue,
          y: -1 * parseFloat(d["Percentage of Downfall"]),
          name: d.Coin,
        });
      } else if (
        d["Percentage of Downfall"] > 10 &&
        d["Percentage of Downfall"] <= 20
      ) {
        obj["-10%--20%"].push({
          x: xValue,
          y: -1 * parseFloat(d["Percentage of Downfall"]),
          name: d.Coin,
        });
      } else if (
        d["Percentage of Downfall"] > 20 &&
        d["Percentage of Downfall"] <= 30
      ) {
        obj["-20%--30%"].push({
          x: xValue,
          y: -1 * parseFloat(d["Percentage of Downfall"]),
          name: d.Coin,
        });
      } else if (
        d["Percentage of Downfall"] > 30 &&
        d["Percentage of Downfall"] <= 40
      ) {
        obj["-30%--40%"].push({
          x: xValue,
          y: -1 * parseFloat(d["Percentage of Downfall"]),
          name: d.Coin,
        });
      } else if (
        d["Percentage of Downfall"] > 40 &&
        d["Percentage of Downfall"] <= 50
      ) {
        obj["-40%--50%"].push({
          x: xValue,
          y: -1 * parseFloat(d["Percentage of Downfall"]),
          name: d.Coin,
        });
      } else if (
        d["Percentage of Downfall"] > 50 &&
        d["Percentage of Downfall"] <= 60
      ) {
        obj["-50%--60%"].push({
          x: xValue,
          y: -1 * parseFloat(d["Percentage of Downfall"]),
          name: d.Coin,
        });
      } else if (
        d["Percentage of Downfall"] > 60 &&
        d["Percentage of Downfall"] <= 70
      ) {
        obj["-60%--70%"].push({
          x: xValue,
          y: -1 * parseFloat(d["Percentage of Downfall"]),
          name: d.Coin,
        });
      } else if (
        d["Percentage of Downfall"] > 70 &&
        d["Percentage of Downfall"] <= 80
      ) {
        obj["-70%--80%"].push({
          x: xValue,
          y: -1 * parseFloat(d["Percentage of Downfall"]),
          name: d.Coin,
        });
      } else if (
        d["Percentage of Downfall"] > 80 &&
        d["Percentage of Downfall"] <= 90
      ) {
        obj["-80%--90%"].push({
          x: xValue,
          y: -1 * parseFloat(d["Percentage of Downfall"]),
          name: d.Coin,
        });
      } else if (
        d["Percentage of Downfall"] > 90 &&
        d["Percentage of Downfall"] <= 99.96
      ) {
        obj["-90%--99.97%"].push({
          x: xValue,
          y: -1 * parseFloat(d["Percentage of Downfall"]),
          name: d.Coin,
        });
      } else {
        obj["-99.97%--100%"].push({
          x: xValue,
          y: -1 * parseFloat(d["Percentage of Downfall"]),
          name: d.Coin,
        });
      }
    }
  });

  let dataset = [];

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

export default AltcoinsBottomNachScatterChart;
