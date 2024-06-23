import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

function XAnstiegeLowPieChart({ data }) {
  ChartJS.register(Tooltip, Legend, ArcElement, ChartDataLabels);

  let total = data.data.reduce((total, current) => total + current, 0);

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

  const options = {
    // Use ChartOptions type for options
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      datalabels: {
        display: "auto",
        clamp: true,
        font: { size: "7px" },
        color: "#fff",
        backgroundColor: "black",
        anchor: "end",
        align: "start",

        formatter: (value, context) => {
          return ((value / total) * 100).toFixed(2) + "%";
        },
      },
    },
  };

  let pieData = {
    labels: data.labels,
    datasets: [
      {
        data: data.data,
        backgroundColor: Object.values(backgroundColor),
        borderColor: Object.values(borderColor),
      },
    ],
  };

  return (
    <Pie
      options={options}
      data={pieData}
      height={301}
      plugins={[ChartDataLabels]} // Optional: Add any plugins you might use
    />
  );
}

export default XAnstiegeLowPieChart;
