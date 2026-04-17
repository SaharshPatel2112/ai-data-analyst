import axios from "axios";

// ── Use environment variable in production, localhost in development ────────
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Upload CSV file
export async function uploadCSV(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return res.data;
}

// Get AI insights for a query
export async function getInsights(sessionId, query) {
  const res = await api.post("/insights", { sessionId, query });
  return res.data;
}

// Analyze data with an operation
export async function analyzeData(sessionId, operation) {
  const res = await api.post("/analyze", { sessionId, operation });
  return res.data;
}

// Get AI dataset summary
export async function getSummary(sessionId) {
  const res = await api.post("/summary", { sessionId });
  return res.data;
}
