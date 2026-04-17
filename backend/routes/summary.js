import express from "express";
import dotenv from "dotenv";
import { sessionStore } from "./upload.js";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = sessionStore[sessionId];

    if (!session) {
      return res.status(404).json({
        error: "Session not found. Please re-upload your CSV.",
      });
    }

    const { columns, columnTypes, stats, data, filename } = session;

    // ── Build context for AI ───────────────────────────────────────────────
    const numericCols = columns.filter((c) => columnTypes[c] === "numeric");
    const stringCols = columns.filter((c) => columnTypes[c] === "string");
    const sampleRows = data.slice(0, 5);

    // Build a stats summary string for the prompt
    const statsSummary = numericCols
      .map((col) => {
        const s = stats[col];
        if (!s) return "";
        return `${col}: sum=${s.sum}, avg=${s.mean}, min=${s.min}, max=${s.max}`;
      })
      .join("\n");

    const prompt = `You are a data analyst. Analyze this dataset and write a smart summary.

DATASET: ${filename}
Total rows: ${data.length}
Columns: ${columns.join(", ")}
Column types: ${JSON.stringify(columnTypes)}
Sample rows: ${JSON.stringify(sampleRows)}
Numeric stats:
${statsSummary}

Write a 3-4 sentence plain English summary of this dataset. Include:
- What the dataset is about
- Key numbers (totals, averages, counts)
- The most interesting or notable finding
- What kind of analysis would be useful

Keep it conversational and insightful. No bullet points. Just natural flowing sentences.

Also provide 3 short "quick insight" bullets (max 10 words each) highlighting the most important facts.

Respond ONLY with raw JSON:
{
  "summary": "3-4 sentence paragraph here",
  "quickInsights": [
    "First key insight here",
    "Second key insight here", 
    "Third key insight here"
  ],
  "dataType": "sales | survey | financial | inventory | customer | other"
}`;

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
                "You are a data analyst. Always respond with valid JSON only. No markdown, no backticks, no extra text.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      },
    );

    if (!response.ok) {
      const errData = await response.json();
      console.error("Groq API error:", errData);
      return res.status(500).json({
        error: "Failed to generate summary. Please try again.",
      });
    }

    const groqData = await response.json();
    const raw = groqData?.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      return res.status(500).json({
        error: "AI returned empty response.",
      });
    }

    let parsed;
    try {
      const clean = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsed = JSON.parse(clean);
    } catch {
      console.error("Failed to parse summary response:", raw);
      return res.status(500).json({
        error: "Failed to parse AI response.",
      });
    }

    res.json(parsed);
  } catch (err) {
    console.error("Summary route error:", err.message);
    res.status(500).json({ error: "Something went wrong generating summary." });
  }
});

export default router;
