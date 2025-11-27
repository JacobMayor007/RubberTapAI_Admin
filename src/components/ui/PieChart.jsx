import { Pie } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function PieChart({ anthracnose, leafSpot, oidium }) {
  const data = {
    labels: ["Anthracnose", "Leaf Spot", "Oidium Heveae"],

    datasets: [
      {
        data: [anthracnose, leafSpot, oidium],

        backgroundColor: [
          "rgba(205, 133, 63, 0.8)",
          "rgba(143, 170, 82, 0.8)",
          "rgba(222, 184, 135, 0.8)",
        ],
        borderColor: [
          "rgba(205, 133, 63, 1)",
          "rgba(143, 170, 82, 1)",
          "rgba(222, 184, 135, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: true,

    plugins: {
      legend: {
        position: "bottom",
      },

      datalabels: {
        color: "#fff",

        font: {
          weight: "bold",

          size: 16,
        },

        formatter: (value, context) => {
          if (value === 0) {
            return "";
          }

          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);

          const percentage = ((value / total) * 100).toFixed(1);

          return `${percentage}%`;
        },
      },
    },
  };

  return (
    <div className="h-[300px] w-[300px] md:h-[450px] md:w-[450px] m-auto">
      <Pie data={data} options={options} />
    </div>
  );
}
