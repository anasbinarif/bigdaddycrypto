import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

function AbfallePieChart({ data }) {
  ChartJS.register(Tooltip, Legend, ArcElement, ChartDataLabels);

  let newData = processAbfallePieChartData(data);
  let total = newData.data.reduce((total, current) => total + current, 0);

  let backgroundColor = {
    "-0% -9,99%": "#064b21",
    "-10% -19,99%": "#067531",
    "-20% -29,99%": "#a3cd83",
    "-30% -39,99%": "#f6e832",
    "-40% -49,99%": "#f6a62b",
    "-50% -59,99%": "#ed6a1d",
    "-60% -69,99%": "#ea513e",
    "-70% -79,99%": "#e31d13",
    "-80% -89.99%": "#e73625",
    "-90% -99.97%": "#a81923",
    "-99.97% -100%": "#0d0d0d",
  };

  let borderColor = {
    "-0% -9,99%": "#064b21",
    "-10% -19,99%": "#067531",
    "-20% -29,99%": "#a3cd83",
    "-30% -39,99%": "#f6e832",
    "-40% -49,99%": "#f6a62b",
    "-50% -59,99%": "#ed6a1d",
    "-60% -69,99%": "#ea513e",
    "-70 -79,99%": "#e31d13",
    "-80% -89.99%": "#e73625",
    "-90% -99.97%": "#a81923",
    "-99.97% -100%": "#0d0d0d",
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
    labels: newData.labels,
    datasets: [
      {
        data: newData.data,
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

const processAbfallePieChartData = (data) => {
  let obj = {
    "-0% -9,99%": 0,
    "-10% -19,99%": 0,
    "-20% -29,99%": 0,
    "-30% -39,99%": 0,
    "-40% -49,99%": 0,
    "-50% -59,99%": 0,
    "-60% -69,99%": 0,
    "-70% -79,99%": 0,
    "-80% -89.99%": 0,
    "-90% -99.97%": 0,
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
      d["Percentage of Downfall"] <= 79.99
    ) {
      obj["-70% -79,99%"]++;
    } else if (
      d["Percentage of Downfall"] > 79.99 &&
      d["Percentage of Downfall"] <= 89.99
    ) {
      obj["-80% -89.99%"]++;
    } else if (
      d["Percentage of Downfall"] > 89.99 &&
      d["Percentage of Downfall"] < 99.97
    ) {
      obj["-90% -99.97%"]++;
    } else {
      obj["-99.97% -100%"]++;
    }
  });

  return {
    labels: Object.keys(obj),
    data: Object.values(obj),
  };
};

export default AbfallePieChart;
