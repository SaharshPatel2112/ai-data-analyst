import express from "express";
import dotenv from "dotenv";
import { sessionStore } from "./upload.js";

dotenv.config();
const router = express.Router();

// ── Pre-compute full dataset stats to send to AI ───────────────────────────
// Instead of sending raw rows (limited), we compute real counts from ALL data
function computeDatasetContext(data, columns, columnTypes) {
  const context = {};

  columns.forEach((col) => {
    const type = columnTypes[col];

    if (type === "string") {
      // Count frequency of each unique value across ALL rows
      const freq = {};
      data.forEach((row) => {
        const v = row[col];
        if (v != null && v !== "") {
          freq[String(v)] = (freq[String(v)] || 0) + 1;
        }
      });
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);

      context[col] = {
        type: "string",
        uniqueValues: sorted.length,
        // Send ALL value counts so AI knows exact numbers
        valueCounts: Object.fromEntries(sorted),
        topValues: sorted.slice(0, 10).map(([k, v]) => `${k}: ${v} records`),
      };
    } else if (type === "numeric") {
      const vals = data.map((r) => Number(r[col])).filter((v) => !isNaN(v));
      if (vals.length > 0) {
        const sum = vals.reduce((a, b) => a + b, 0);
        const avg = sum / vals.length;
        const min = Math.min(...vals);
        const max = Math.max(...vals);
        context[col] = {
          type: "numeric",
          count: vals.length,
          sum: +sum.toFixed(2),
          avg: +avg.toFixed(2),
          min,
          max,
        };
      }
    } else if (type === "year") {
      // Count records per year across ALL data
      const yearCount = {};
      data.forEach((row) => {
        const v = row[col];
        if (v != null) yearCount[String(v)] = (yearCount[String(v)] || 0) + 1;
      });
      context[col] = {
        type: "year",
        yearCounts: yearCount,
        uniqueYears: Object.keys(yearCount).sort(),
      };
    } else if (type === "date") {
      context[col] = {
        type: "date",
        sampleValues: [...new Set(data.slice(0, 5).map((r) => r[col]))],
      };
    }
  });

  return context;
}

router.post("/", async (req, res) => {
  try {
    const { sessionId, query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Query cannot be empty." });
    }

    const session = sessionStore[sessionId];
    if (!session) {
      return res.status(404).json({
        error: "Session not found. Please re-upload your CSV.",
      });
    }

    const { columns, columnTypes, data, filename } = session;

    // ── Compute full dataset context from ALL rows ─────────────────────────
    const datasetContext = computeDatasetContext(data, columns, columnTypes);

    const prompt = `You are an intelligent data analyst. You have access to metadata about the entire dataset.

DATASET: ${filename}
TOTAL ROWS: ${data.length}
COLUMNS: ${columns.join(", ")}
COLUMN TYPES: ${JSON.stringify(columnTypes)}

FULL DATASET STATISTICS (computed from ALL ${data.length} rows):
${JSON.stringify(datasetContext, null, 2)}

USER QUESTION: "${query}"

INSTRUCTIONS:
Decide the appropriate response type based on the user's intent:

TYPE 1 - CONVERSATIONAL (Text Answer):
Use this when the user asks for summaries, counts, totals, averages, or general explanations.
- "how many students failed?" → use valueCounts to answer directly in text.
- "what is the average score?" → use numeric stats to answer.
- Give EXACT numbers from the statistics above. Do not guess.

TYPE 2 - DATA VISUALIZATION & LISTS (Chart/Table):
Use this when the user asks to SEE the data, wants a chart, or asks for a LIST of specific people/rows.
- "show me a chart", "visualize X"
- "list the names of people who failed", "who failed?", "show me the details of students with A grade" → USE THE 'filter' OPERATION with 'table' chartType.

Available operations for TYPE 2:
- "filter": (NEW) use this when user wants a list, names, or specific rows matching a condition. Returns a table.
- "distribution": count frequency of values in a string column → pie chart
- "group_by": group by string col, aggregate numeric col → bar chart  
- "top_n": top N rows by numeric col → bar chart
- "trend": values over time → line chart
- "stats": statistics for numeric col → bar chart
- "raw": show raw data → table
- "count_by": count records grouped by a string column → bar chart

JSON OUTPUT FORMATS:

If TYPE 1 (Text):
{
  "responseType": "text",
  "answer": "Precise answer using EXACT numbers from the statistics.",
  "isEnding": false,
  "followUp": "A useful follow-up question suggestion"
}

If TYPE 2 (Chart or Table/List):
{
  "responseType": "chart",
  "operation": {
    "type": "filter | distribution | group_by | top_n | trend | stats | raw | count_by",
    "filterCol": "Column name to search inside (ONLY required for 'filter')",
    "filterVal": "Value to match, e.g. 'Fail' (ONLY required for 'filter')",
    "operator": "equals | contains | > | < | >= | <=" (ONLY required for 'filter', defaults to 'contains'),
    "groupCol": "string column name",
    "metricCol": "numeric column name",
    "aggregate": "sum | avg | count | max | min",
    "column": "column name",
    "countCol": "column name to count by (for count_by)",
    "n": 5,
    "order": "desc | asc",
    "dateCol": "date/year column name",
    "limit": 50
  },
  "chartType": "bar | line | pie | area | table",
  "insight": "Brief insight about what this data shows",
  "title": "Clear descriptive title"
}

Respond with ONLY raw JSON. No markdown, no backticks.`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are a precise data analyst. Always use exact numbers from the provided statistics. If a user asks for lists or names of specific rows, output a 'filter' operation with a 'table' chartType. Respond with valid JSON only.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.1,
          max_tokens: 1024,
        }),
      },
    );

    if (!response.ok) {
      const errData = await response.json();
      console.error("Groq API error:", errData);
      if (response.status === 429)
        return res
          .status(429)
          .json({ error: "Too many requests. Wait a moment and try again." });
      if (response.status === 401)
        return res
          .status(401)
          .json({ error: "Invalid API key. Check your backend/.env file." });
      return res
        .status(500)
        .json({ error: `API error ${response.status}. Try again.` });
    }

    const groqData = await response.json();
    const raw = groqData?.choices?.[0]?.message?.content?.trim();

    if (!raw)
      return res
        .status(500)
        .json({ error: "AI returned empty response. Please try again." });

    let parsed;
    try {
      const clean = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsed = JSON.parse(clean);
    } catch {
      console.error("Failed to parse AI response:", raw);
      return res
        .status(500)
        .json({ error: "AI returned invalid format. Try rephrasing." });
    }

    if (!parsed.responseType)
      return res
        .status(500)
        .json({ error: "AI returned incomplete response. Try again." });

    res.json(parsed);
  } catch (err) {
    console.error("Insights route error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
