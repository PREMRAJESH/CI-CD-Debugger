import { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";

const LiveLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logsRef = ref(database, "build-logs");
    onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLogs(Object.values(data));
      }
    });
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">Live Build Logs</h2>
      <div className="bg-gray-800 p-2 rounded-lg h-64 overflow-auto">
        {logs.map((log, index) => (
          <div key={index} className="text-sm border-b border-gray-700 p-2">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveLogs;
