import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRouter from "./routes/upload.js";
import analyzeRouter from "./routes/analyze.js";
import insightsRouter from "./routes/insights.js";
import summaryRouter from "./routes/summary.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/upload", uploadRouter);
app.use("/api/analyze", analyzeRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/summary", summaryRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI Data Analyst API is running 🚀" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
