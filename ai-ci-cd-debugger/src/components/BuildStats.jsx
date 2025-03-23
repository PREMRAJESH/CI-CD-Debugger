import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { database, ref } from "../firebase";
import { onValue } from "firebase/database";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BuildStats = () => {
  const [buildData, setBuildData] = useState({ success: 0, failed: 0 });

  useEffect(() => {
    const logsRef = ref(database, "past-logs");
    onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let successCount = 0;
        let failureCount = 0;
        Object.values(data).forEach((log) => {
          if (log.log.includes("failed")) {
            failureCount++;
          } else {
            successCount++;
          }
        });
        setBuildData({ success: successCount, failed: failureCount });
      }
    });
  }, []);

  const chartData = {
    labels: ["Success", "Failed"],
    datasets: [
      {
        label: "Build Status",
        data: [buildData.success, buildData.failed],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  };

  return (
    <div className="p-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">Build Success vs Failure</h2>
      <div className="bg-gray-800 p-4 rounded-lg">
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default BuildStats;
