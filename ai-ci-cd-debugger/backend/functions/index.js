const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios");

admin.initializeApp();
const db = admin.database();

// Function to analyze build logs and suggest fixes
exports.analyzeBuildLogs = functions.database
  .ref("/build-logs/{logId}")
  .onCreate(async (snapshot, context) => {
    const logData = snapshot.val();
    if (!logData || !logData.status.includes("failed")) return null;

    let fixSuggestion = "No suggestion available.";

    // Enhanced AI Debugging Rules
    if (logData.status.includes("missing module")) {
      fixSuggestion =
        "Run 'npm install' or 'yarn install' to fix missing modules.";
    } else if (logData.status.includes("network error")) {
      fixSuggestion =
        "Check your internet connection or try clearing npm cache with 'npm cache clean --force'.";
    } else if (logData.status.includes("file not found")) {
      fixSuggestion =
        "Verify the file path and ensure it exists in the repository.";
    } else if (logData.status.includes("permission denied")) {
      fixSuggestion =
        "Try running the command with 'sudo' or check file permissions.";
    } else if (logData.status.includes("syntax error")) {
      fixSuggestion =
        "Check for missing brackets, semicolons, or typos in your code.";
    } else if (logData.status.includes("out of memory")) {
      fixSuggestion =
        "Increase memory limit by running 'NODE_OPTIONS=--max-old-space-size=4096 npm run build'.";
    } else {
      fixSuggestion =
        "Run 'npm run lint' or check the official documentation for more details.";
    }

    // Store AI debugging suggestion in Firebase
    await db.ref(`/debug-suggestions/${context.params.logId}`).set({
      log: logData.status,
      suggestion: fixSuggestion,
      timestamp: new Date().toISOString(),
    });

    // Send alert to Slack & Discord
    const slackWebhook = functions.config().webhooks.slack;
    const discordWebhook = functions.config().webhooks.discord;

    const message = `🚨 **Build Failed**  
📌 **Issue:** ${logData.status}  
💡 **Fix Suggestion:** ${fixSuggestion}`;

    if (slackWebhook) {
      await axios.post(slackWebhook, { text: message });
    }

    if (discordWebhook) {
      await axios.post(discordWebhook, { content: message });
    }

    return null;
  });
exports.storePastLogs = functions.database
  .ref("/build-logs/{logId}")
  .onCreate(async (snapshot, context) => {
    const logData = snapshot.val();

    if (!logData) return null;

    // Store logs in Firebase under 'past-logs'
    await db.ref(`/past-logs/${context.params.logId}`).set({
      log: logData.status,
      timestamp: new Date().toISOString(),
    });

    return null;
  });
