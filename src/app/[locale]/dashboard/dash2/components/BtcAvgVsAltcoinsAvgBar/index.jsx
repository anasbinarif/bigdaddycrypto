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

function BtcAvgVsAltcoinsAvgBar({ data }) {
  ChartJS.register(
    Tooltip,
    Legend,
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    BarElement
  );

  const options = {
    categoryPercentage: 1, // here
    barPercentage: 0.7, // here
    // barThickness: 100,
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
        // barPercentage: 0.3,
        // categoryPercentage: 0.1,
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
    BTC: "#477f36",
    Altcoins: "#be1622",
  };

  let borderColor = {
    BTC: "#477f36",
    Altcoins: "#be1622",
  };

  let barData = {
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
    <Bar
      options={options}
      data={barData}
      height={301}
      plugins={[ChartDataLabels]}
    />
  );
}

export default BtcAvgVsAltcoinsAvgBar;
