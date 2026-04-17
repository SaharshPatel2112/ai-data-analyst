import express from "express";
import dotenv from "dotenv";
import { sessionStore } from "./upload.js";

dotenv.config();
const router = express.Router();

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

    const { columns, columnTypes, stats, data, filename } = session;

    // Send first 10 rows as sample so AI can read actual values
    const sampleRows = data.slice(0, 10);

    // Build readable stats for AI
    const numericCols = columns.filter((c) => columnTypes[c] === "numeric");
    const statsSummary = numericCols
      .map((col) => {
        const s = stats[col];
        if (!s) return "";
        return `${col}: total=${s.sum}, avg=${s.mean}, min=${s.min}, max=${s.max}, count=${s.count}`;
      })
      .join("\n");

    const prompt = `You are an intelligent data analyst assistant. The user has uploaded a CSV file and you have full access to its contents.

DATASET INFO:
- Filename: ${filename}
- Total rows: ${data.length}
- Columns: ${columns.join(", ")}
- Column types: ${JSON.stringify(columnTypes)}
- Sample data (first 10 rows): ${JSON.stringify(sampleRows)}
- Numeric statistics:
${statsSummary}

USER QUESTION: "${query}"

INSTRUCTIONS:
First decide what type of response is needed:

TYPE 1 - CONVERSATIONAL: Use this when the user:
- Greets you (hi, hello, hey)
- Says thanks, thank you, great, ok, bye, goodbye, cool, nice
- Asks a general question about the data
- Asks for explanation or advice
- Says anything that does NOT need a chart

For greetings and thanks — keep the answer SHORT (1 sentence max). Do NOT give data info unless asked.
For "thanks" or "bye" — just say something like "You're welcome! Let me know if you need anything else." — nothing more.
isEnding should be true when user says thanks/bye/ok/done.

TYPE 2 - CHART: Use this when user wants:
- A visualization, ranking, comparison, trend, or distribution
- Explicitly mentions "show", "chart", "top", "highest", "lowest", "compare", "pie", "bar", "distribution"

If user says "pie chart" or "distribution" → always use chartType "pie" and operation type "distribution"

If TYPE 1 - respond with:
{
  "responseType": "text",
  "answer": "Your answer here",
  "isEnding": false,
  "followUp": "One suggestion for what to ask next (null if isEnding is true)"
}

If TYPE 2 - respond with:
{
  "responseType": "chart",
  "operation": {
    "type": "group_by | top_n | trend | distribution | stats | raw",
    "groupCol": "string column name",
    "metricCol": "numeric column name",
    "aggregate": "sum | avg | count | max | min",
    "column": "column name",
    "n": 5,
    "order": "desc | asc",
    "dateCol": "date column name",
    "limit": 10
  },
  "chartType": "bar | line | pie | area | table",
  "insight": "2 sentence insight using real numbers",
  "title": "Short chart title"
}
RULES:
- Only use column names that actually exist in the dataset
- For group_by: groupCol must be string type, metricCol must be numeric type
- Be specific — mention actual column names and real values from the sample data in your answers
- If user greets you or says hi, respond conversationally and suggest what they can ask
- Respond with ONLY raw JSON. No markdown, no backticks, no extra text.`;

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
                "You are a helpful data analyst. You have access to the user's dataset. Always respond with valid JSON only. No markdown, no backticks, no extra text whatsoever.",
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
      if (response.status === 429) {
        return res.status(429).json({
          error: "Too many requests. Please wait a moment and try again.",
        });
      }
      if (response.status === 401) {
        return res.status(401).json({
          error: "Invalid API key. Check your backend/.env file.",
        });
      }
      return res.status(500).json({
        error: `API error ${response.status}. Try again.`,
      });
    }

    const groqData = await response.json();
    const raw = groqData?.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      return res.status(500).json({
        error: "AI returned empty response. Please try again.",
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
      console.error("Failed to parse AI response:", raw);
      return res.status(500).json({
        error: "AI returned invalid format. Try rephrasing your question.",
      });
    }

    if (!parsed.responseType) {
      return res.status(500).json({
        error: "AI returned incomplete response. Try again.",
      });
    }

    res.json(parsed);
  } catch (err) {
    console.error("Insights route error:", err.message);
    res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
});

export default router;
