import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

function XAnstiegeHorizontalBarChart({ data }) {
  ChartJS.register(
    Tooltip,
    Legend,
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    BarElement
  );

  const options = {
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: true,
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
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      datalabels: {
        display: false,
      },
    },
  };

  let backgroundColor = {
    "0X-17X": "#be1622",
    "17.1X-20.9X": "#d87a68",
    "21X-39.9X": "#cce2bc",
    "40X-99.9X": "#67b54d",
    "100X-9999X": "#477f36",
    ">=1000X": "#f8ea49",
  };

  let borderColor = {
    "0X-17X": "#be1622",
    "17.1X-20.9X": "#d87a68",
    "21X-39.9X": "#cce2bc",
    "40X-99.9X": "#67b54d",
    "100X-9999X": "#477f36",
    ">=1000X": "#f8ea49",
  };

  let barData = {
    labels: data.labels,
    datasets: [
      {
        label: "X Anstiege Low",
        data: data.data,
        backgroundColor: Object.values(backgroundColor),
        borderColor: Object.values(borderColor),
      },
    ],
  };

  return (
    <Bar
      options={options}
      data={barData}
      height={301}
      plugins={[ChartDataLabels]}
    />
  );
}

export default XAnstiegeHorizontalBarChart;
