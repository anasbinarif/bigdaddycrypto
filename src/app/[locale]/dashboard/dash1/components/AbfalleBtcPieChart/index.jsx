import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTranslations } from "next-intl";

function AbfalleBtcPieChart({ data, bitcoin }) {
  ChartJS.register(Tooltip, Legend, ArcElement, ChartDataLabels);

  const t = useTranslations();

  let newData = processAbfalleBtcPieChartData(data, bitcoin);
  let total = newData.reduce((total, current) => total + current, 0);

  let backgroundColor = {
    "Abfälle > Bitcoin": "#d87a68",
    "Abfälle < Bitcoin": "#a3cd83",
  };

  let borderColor = {
    "Abfälle > Bitcoin": "#d87a68",
    "Abfälle < Bitcoin": "#a3cd83",
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
    labels: [`${t("Abfälle")} > Bitcoin`, `${t("Abfälle")} < Bitcoin`],
    datasets: [
      {
        data: newData,
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

const processAbfalleBtcPieChartData = (data, bitcoin) => {
  let greater = 0,
    lesser = 0;

  data.forEach((d) => {
    if (parseFloat(d["Percentage of Downfall"]) >= bitcoin) {
      greater++;
    } else {
      lesser++;
    }
  });
  return [greater, lesser];
};

export default AbfalleBtcPieChart;
