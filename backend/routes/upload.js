import express from "express";
import fs from "fs";
import { upload } from "../middleware/multer.js";
import {
  parseCSV,
  inferColumnTypes,
  calculateStats,
} from "../utils/csvParser.js";

const router = express.Router();
export const sessionStore = {};

router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const csvContent = fs.readFileSync(req.file.path, "utf-8");
    const { data, columns, rowCount } = parseCSV(csvContent);
    const columnTypes = inferColumnTypes(data, columns);

    const stats = {};
    columns.forEach((col) => {
      if (columnTypes[col] === "numeric") {
        stats[col] = calculateStats(data, col);
      }
    });

    const sessionId = req.file.filename.split(".")[0];
    sessionStore[sessionId] = {
      data,
      columns,
      columnTypes,
      stats,
      filename: req.file.originalname,
    };

    fs.unlinkSync(req.file.path);

    res.json({
      sessionId,
      filename: req.file.originalname,
      rowCount,
      columns,
      columnTypes,
      stats,
      preview: data.slice(0, 5),
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
