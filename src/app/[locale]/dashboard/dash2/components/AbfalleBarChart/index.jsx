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

function AbfalleHorizontalBarChart({ data }) {
  ChartJS.register(
    Tooltip,
    Legend,
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    BarElement
  );

  let newData = processAbfalleHorizontalBarChartData(data);

  let colors = {
    "-0% -9,99%": "#064b21",
    "-10% -19,99%": "#067531",
    "-20% -29,99%": "#a3cd83",
    "-30% -39,99%": "#f6e832",
    "-40% -49,99%": "#f6a62b",
    "-50% -59,99%": "#ed6a1d",
    "-60% -69,99%": "#ea513e",
    "-70% -74,99%": "#e31d13",
    "-75% -79,99%": "#e94532",
    "-80% -84,99%": "#e83b29",
    "-85% -89,99%": "#e73020",
    "-90% -94,99%": "#e62517",
    "-95% -99,97%": "#a81923",
    "-99.97% -100%": "#0d0d0d",
  };

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
    categoryPercentage: 0.1,
    barPercentage: 100,
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

  let barData = {
    labels: newData.labels,
    datasets: newData.labels.map((label) => ({
      label: label,
      data: [{ x: newData.data[label], y: label }],
      backgroundColor: colors[label],
      borderColor: colors[label],
      borderWidth: 1,
    })),
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

const processAbfalleHorizontalBarChartData = (data) => {
  let obj = {
    "-0% -9,99%": 0,
    "-10% -19,99%": 0,
    "-20% -29,99%": 0,
    "-30% -39,99%": 0,
    "-40% -49,99%": 0,
    "-50% -59,99%": 0,
    "-60% -69,99%": 0,
    "-70% -74,99%": 0,
    "-75% -79,99%": 0,
    "-80% -84,99%": 0,
    "-85% -89,99%": 0,
    "-90% -94,99%": 0,
    "-95% -99,97%": 0,
    "-99.97% -100%": 0,
  };

  data.forEach((d) => {
    d["Percentage of Downfall"] = parseFloat(d["Percentage of Downfall"]);

    if (
      d["Percentage of Downfall"] >= 0 &&
      d["Percentage of Downfall"] <= 9.99
    ) {
      obj["-0% -9,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 9.99 &&
      d["Percentage of Downfall"] <= 19.99
    ) {
      obj["-10% -19,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 19.99 &&
      d["Percentage of Downfall"] <= 29.99
    ) {
      obj["-20% -29,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 29.99 &&
      d["Percentage of Downfall"] <= 39.99
    ) {
      obj["-30% -39,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 39.99 &&
      d["Percentage of Downfall"] <= 49.99
    ) {
      obj["-40% -49,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 49.99 &&
      d["Percentage of Downfall"] <= 59.99
    ) {
      obj["-50% -59,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 59.99 &&
      d["Percentage of Downfall"] <= 69.99
    ) {
      obj["-60% -69,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 69.99 &&
      d["Percentage of Downfall"] <= 74.99
    ) {
      obj["-70% -74,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 74.99 &&
      d["Percentage of Downfall"] <= 79.99
    ) {
      obj["-75% -79,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 79.99 &&
      d["Percentage of Downfall"] <= 84.99
    ) {
      obj["-80% -84,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 84.99 &&
      d["Percentage of Downfall"] <= 89.99
    ) {
      obj["-85% -89,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 89.99 &&
      d["Percentage of Downfall"] <= 94.99
    ) {
      obj["-90% -94,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 95 &&
      d["Percentage of Downfall"] < 99.97
    ) {
      obj["-95% -99,97%"]++;
    } else {
      obj["-99.97% -100%"]++;
    }
  });

  return {
    labels: Object.keys(obj),
    data: obj,
  };
};

export default AbfalleHorizontalBarChart;
