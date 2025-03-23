const API_URL = "https://your-project.vercel.app/api/logs";

export const fetchLogs = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log("CI/CD Logs:", data);
  } catch (error) {
    console.error("Error fetching logs:", error);
  }
};
