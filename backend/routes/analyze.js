import express from "express";
import { sessionStore } from "./upload.js";
import { groupBy, topN, calculateStats } from "../utils/csvParser.js";

const router = express.Router();

router.post("/", (req, res) => {
  try {
    const { sessionId, operation } = req.body;

    if (!operation || !operation.type) {
      return res.status(400).json({ error: "Invalid operation." });
    }

    const session = sessionStore[sessionId];
    if (!session) {
      return res.status(404).json({
        error: "Session not found. Please re-upload your CSV.",
      });
    }

    const { data, columns, columnTypes } = session;

    if (!data || data.length === 0) {
      return res.status(400).json({ error: "No data found in this file." });
    }

    let result = [];
    let chartType = operation.chartType || "bar";
    let xKey = "";
    let yKey = "";

    switch (operation.type) {
      // ── FILTER ────────────────────────────────────────────────────────────
      case "filter": {
        const col = operation.filterCol;
        const val = operation.filterVal;
        const op = operation.operator || "contains";

        if (!col || val === undefined) {
          return res.status(400).json({ error: "Missing filter criteria." });
        }

        result = data
          .filter((row) => {
            const rowVal = row[col];
            if (rowVal == null) return false;

            const numRowVal = Number(rowVal);
            const numSearchVal = Number(val);

            // Handle numeric operators
            if (op === ">") return numRowVal > numSearchVal;
            if (op === "<") return numRowVal < numSearchVal;
            if (op === ">=") return numRowVal >= numSearchVal;
            if (op === "<=") return numRowVal <= numSearchVal;

            // Handle string operators
            if (op === "equals")
              return String(rowVal).toLowerCase() === String(val).toLowerCase();

            // Default: contains (partial match)
            return String(rowVal)
              .toLowerCase()
              .includes(String(val).toLowerCase());
          })
          .slice(0, operation.limit || 50);

        xKey = columns[0];
        yKey = columns[1] || columns[0];
        chartType = "table";
        break;
      }

      // ── GROUP BY ──────────────────────────────────────────────────────────
      case "group_by": {
        const groupCol =
          operation.groupCol ||
          columns.find((c) => columnTypes[c] === "string");
        const metricCol =
          operation.metricCol ||
          columns.find((c) => columnTypes[c] === "numeric");

        if (!groupCol || !metricCol) {
          return res.status(400).json({
            error:
              "Could not find suitable columns for grouping. Try a different question.",
          });
        }

        result = groupBy(
          data,
          groupCol,
          metricCol,
          operation.aggregate || "sum",
        );
        xKey = groupCol;
        yKey = metricCol;
        chartType = "bar";
        break;
      }

      // ── TOP N ─────────────────────────────────────────────────────────────
      case "top_n": {
        const col =
          operation.column || columns.find((c) => columnTypes[c] === "numeric");

        if (!col) {
          return res.status(400).json({
            error: "Could not find a numeric column for ranking.",
          });
        }

        result = topN(data, col, operation.n || 5, operation.order || "desc");

        xKey = columns.find((c) => columnTypes[c] === "string") || columns[0];
        yKey = col;
        chartType = "bar";
        break;
      }

      // ── TREND ─────────────────────────────────────────────────────────────
      case "trend": {
        const dateCol =
          operation.dateCol ||
          columns.find((c) => columnTypes[c] === "date") ||
          columns[0];
        const metricCol =
          operation.metricCol ||
          columns.find((c) => columnTypes[c] === "numeric") ||
          columns[1];

        if (!dateCol || !metricCol) {
          return res.status(400).json({
            error:
              "Could not find date and numeric columns for trend analysis.",
          });
        }

        const groups = {};
        data.forEach((row) => {
          const key = row[dateCol];
          if (key == null) return;
          groups[key] = (groups[key] || 0) + (Number(row[metricCol]) || 0);
        });

        result = Object.entries(groups).map(([k, v]) => ({
          [dateCol]: k,
          [metricCol]: +v.toFixed(2),
        }));

        xKey = dateCol;
        yKey = metricCol;
        chartType = "line";
        break;
      }

      // ── DISTRIBUTION ──────────────────────────────────────────────────────
      case "distribution": {
        const col =
          operation.column || columns.find((c) => columnTypes[c] === "string");

        if (!col) {
          return res.status(400).json({
            error: "Could not find a text column for distribution.",
          });
        }

        const freq = {};
        data.forEach((row) => {
          const v = row[col];
          if (v != null && v !== "")
            freq[String(v)] = (freq[String(v)] || 0) + 1;
        });

        result = Object.entries(freq)
          .map(([k, v]) => ({ [col]: k, count: v }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        xKey = col;
        yKey = "count";
        chartType = "pie";
        break;
      }

      // ── STATS ─────────────────────────────────────────────────────────────
      case "stats": {
        const col =
          operation.column || columns.find((c) => columnTypes[c] === "numeric");

        if (!col) {
          return res.status(400).json({
            error: "Could not find a numeric column for statistics.",
          });
        }

        const s = calculateStats(data, col);

        if (!s) {
          return res.status(400).json({
            error: `No numeric data found in column "${col}".`,
          });
        }

        result = [
          { metric: "Sum", value: s.sum },
          { metric: "Average", value: s.mean },
          { metric: "Min", value: s.min },
          { metric: "Max", value: s.max },
          { metric: "Median", value: s.median },
          { metric: "Count", value: s.count },
        ];

        xKey = "metric";
        yKey = "value";
        chartType = "bar";
        break;
      }

      // ── RAW ───────────────────────────────────────────────────────────────
      case "raw": {
        result = data.slice(0, operation.limit || 10);
        xKey = columns[0];
        yKey = columns[1];
        chartType = "table";
        break;
      }

      case "count_by": {
        const col =
          operation.countCol ||
          operation.column ||
          columns.find((c) => columnTypes[c] === "string");

        if (!col) {
          return res.status(400).json({
            error: "Could not find a column to count by.",
          });
        }

        const freq = {};
        data.forEach((row) => {
          const v = row[col];
          if (v != null && v !== "") {
            freq[String(v)] = (freq[String(v)] || 0) + 1;
          }
        });

        result = Object.entries(freq)
          .map(([k, v]) => ({ [col]: k, count: v }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 15);

        xKey = col;
        yKey = "count";
        chartType = "bar";
        break;
      }

      default: {
        result = data.slice(0, 10);
        xKey = columns[0];
        yKey = columns[1];
        chartType = "table";
      }
    }

    // ── Guard: empty result ────────────────────────────────────────────────
    if (!result || result.length === 0) {
      return res.status(400).json({
        error: "No data found for this query. Try a different question.",
      });
    }

    // ── Anti-Formatting Fix: Convert "year" columns to strings ─────────────
    // This stops frontend dashboard libraries from abbreviating years to "2.0K"
    const finalResult = result.map((row) => {
      const newRow = { ...row };
      Object.keys(newRow).forEach((key) => {
        // Force conversion if the column type is specifically 'year' or the name contains 'year'
        if (columnTypes[key] === "year" || key.toLowerCase().includes("year")) {
          if (newRow[key] != null) {
            newRow[key] = String(newRow[key]);
          }
        }
      });
      return newRow;
    });

    res.json({ result: finalResult, chartType, xKey, yKey });
  } catch (err) {
    console.error("Analyze error:", err.message);
    res.status(500).json({
      error: "Failed to analyze data. Please try again.",
    });
  }
});

export default router;
