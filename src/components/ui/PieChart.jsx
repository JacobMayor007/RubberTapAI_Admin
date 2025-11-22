import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ anthracnose, leafSpot, oidium }) {
  const data = {
    labels: ["Anthracnose", "Leaf Spot", "Oidium Heveae"],
    datasets: [
      {
        data: [anthracnose, leafSpot, oidium],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-[450px] w-[450px] m-auto">
      <Pie data={data} />
    </div>
  );
}
