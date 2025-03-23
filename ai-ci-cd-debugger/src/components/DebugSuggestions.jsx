import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const DebugSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    console.log("🔄 Fetching debug suggestions...");

    const fetchSuggestions = async () => {
      try {
        const logsCollection = collection(db, "ci_cd_logs");
        const logsSnapshot = await getDocs(logsCollection);
        const logsData = logsSnapshot.docs.map((doc) => doc.data());

        console.log("📡 Firestore Logs for Debugging:", logsData);

        if (logsData.length > 0) {
          const formattedSuggestions = logsData.map((log) => {
            return {
              issue: log.message,
              suggestion: log.suggestion || "No suggestion available",
              timestamp: new Date(parseInt(log.timestamp)).toLocaleString(),
            };
          });

          setSuggestions(formattedSuggestions);
        } else {
          console.warn("⚠️ No logs found for debugging.");
        }
      } catch (error) {
        console.error("🔥 Firestore Fetch Error:", error);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">AI Debugging Suggestions</h2>
      <div className="bg-gray-800 p-2 rounded-lg h-64 overflow-auto">
        {suggestions.length > 0 ? (
          suggestions.map((item, index) => (
            <div key={index} className="p-2 border-b border-gray-700">
              <p>
                ❌ <strong>Issue:</strong> {item.issue}
              </p>
              <p>
                💡 <strong>Suggestion:</strong> {item.suggestion}
              </p>
              <p className="text-sm text-gray-400">📅 {item.timestamp}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No AI suggestions available.</p>
        )}
      </div>
    </div>
  );
};

export default DebugSuggestions;
