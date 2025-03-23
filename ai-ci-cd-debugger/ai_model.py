from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load Local AI Model
model = pipeline("text-generation", model="mistralai/Mistral-7B-Instruct-v0.1")

@app.route("/generate-suggestion", methods=["POST"])
def generate_suggestion():
    data = request.json
    log = data.get("log", "")

    print("📡 Received Log:", log)

    if not log:
        return jsonify({"suggestion": "No log provided."})

    # AI model generates a fix suggestion
    response = model(f"Debug this CI/CD error: {log}. Suggest a fix.", max_length=100)
    suggestion = response[0]["generated_text"]

    print("💡 AI Debugging Suggestion:", suggestion)

    return jsonify({"suggestion": suggestion})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
