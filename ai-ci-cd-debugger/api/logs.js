export default function handler(req, res) {
  if (req.method === "GET") {
    res.json({ message: "CI/CD Logs API is working!" });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
