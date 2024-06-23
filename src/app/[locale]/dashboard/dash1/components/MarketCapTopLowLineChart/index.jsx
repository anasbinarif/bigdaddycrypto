import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  LinearScale,
  LineElement,
  CategoryScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

function MarketTopLowLineChart({ data }) {
  ChartJS.register(
    Tooltip,
    Legend,
    ArcElement,
    ChartDataLabels,
    LinearScale,
    LineElement,
    CategoryScale
  );

  let backgroundColor = {
    series1: "rgba(35, 60, 75, 0.8)",
    series2: "rgba(255, 125, 45, 0.8)",
    series3: "rgba(250, 200, 70, 0.8)",
    series4: "rgba(160, 195, 130, 0.8)",
    series5: "rgba(95, 155, 140, 0.8)",
    series6: "rgba(205, 220, 220, 0.8)",
    series7: "rgba(130, 205, 215, 0.8)",
    series8: "rgba(5, 215, 160, 0.8)",
    series9: "rgba(245, 120, 185, 0.8)",
    series10: "rgba(80, 110, 0, 0.8)",
  };

  let borderColor = {
    series1: "rgba(35, 60, 75, 0.8)",
    series2: "rgba(255, 125, 45, 0.8)",
    series3: "rgba(250, 200, 70, 0.8)",
    series4: "rgba(160, 195, 130, 0.8)",
    series5: "rgba(95, 155, 140, 0.8)",
    series6: "rgba(205, 220, 220, 0.8)",
    series7: "rgba(130, 205, 215, 0.8)",
    series8: "rgba(5, 215, 160, 0.8)",
    series9: "rgba(245, 120, 185, 0.8)",
    series10: "rgba(80, 110, 0, 0.8)",
  };

  const options = {
    // Use ChartOptions type for options
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: {
        left: 0,
        right: 80,
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      x: {
        type: "category",
        beginAtZero: false,

        grid: {
          display: false,
        },
        offset: true,
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return value.toLocaleString("de-DE");
          },
        },
      },
    },

    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      datalabels: {
        display: false,
      },
    },
  };

  let lineData = {
    datasets: processMarketTopLowLineChart(data, backgroundColor, borderColor),
  };

  return (
    <Line
      options={options}
      data={lineData}
      height={301}
      plugins={[ChartDataLabels]} // Optional: Add any plugins you might use
    />
  );
}

const processMarketTopLowLineChart = (data, backgroundColor, borderColor) => {
  // let filteredData = data.slice(0, 10);

  let filteredData = data
    .sort(
      (a, b) =>
        parseFloat(b["MC at Highest High"]) -
        parseFloat(a["MC at Highest High"])
    )
    .slice(0, 10);

  let dataset = [];

  filteredData.forEach((d, i) => {
    dataset.push({
      label: d.Coin,
      backgroundColor: backgroundColor[`series${i + 1}`],
      borderColor: borderColor[`series${i + 1}`],
      data: [
        {
          x: "MC at Highest High",
          y: parseFloat(d["MC at Highest High"]),
        },
        {
          x: "MC at Lowest Low After",
          y: parseFloat(d["MC at Lowest Low After"]),
        },
      ],
    });
  });
  return dataset;
};

export default MarketTopLowLineChart;
