import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const PastLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    console.log("🔄 Fetching past logs from Firestore...");

    const fetchLogs = async () => {
      try {
        const logsCollection = collection(db, "past_ci_cd_logs"); // Ensure Firestore has this collection
        const logsSnapshot = await getDocs(logsCollection);
        const logsData = logsSnapshot.docs.map((doc) => doc.data());

        console.log("📡 Firestore Past Logs:", logsData);

        if (logsData.length > 0) {
          setLogs(logsData);
        } else {
          console.warn("⚠️ No past logs found in database!");
        }
      } catch (error) {
        console.error("🔥 Firestore Fetch Error:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">Past Build Logs</h2>
      <div className="bg-gray-800 p-2 rounded-lg h-64 overflow-auto">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={index} className="p-2 border-b border-gray-700">
              <p>
                🛠 <strong>Log:</strong> {log.log || "No log message found"}
              </p>
              <p>
                ❗ <strong>Suggestion:</strong>{" "}
                {log.suggestion || "No suggestions available"}
              </p>
              <p className="text-sm text-gray-400">
                📅{" "}
                {log.timestamp
                  ? new Date(parseInt(log.timestamp)).toLocaleString()
                  : "No timestamp"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No past logs available.</p>
        )}
      </div>
    </div>
  );
};

export default PastLogs;
