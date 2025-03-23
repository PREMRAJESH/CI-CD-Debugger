const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios"); // To call AI model
admin.initializeApp();

const db = admin.firestore();

// AI Model API (Use Local Model like GPT4All or Hosted Llama2)
const AI_API_URL = "http://localhost:5000/generate-suggestion"; // Change to actual endpoint

exports.generateDebugSuggestion = functions.firestore
  .document("ci_cd_logs/{logId}")
  .onCreate(async (snap, context) => {
    const logData = snap.data();
    const logMessage = logData.message;

    console.log("🛠 Processing Log for AI Debugging:", logMessage);

    try {
      const aiResponse = await axios.post(AI_API_URL, { log: logMessage });

      const suggestion = aiResponse.data.suggestion || "No suggestion found.";
      console.log("🤖 AI Debugging Suggestion:", suggestion);

      await snap.ref.update({ suggestion }); // Store AI suggestion in Firestore
    } catch (error) {
      console.error("❌ AI Suggestion Error:", error);
    }
  });
