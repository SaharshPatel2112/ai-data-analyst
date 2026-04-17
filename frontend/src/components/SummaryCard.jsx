import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, RefreshCw } from "lucide-react";
import { getSummary } from "../utils/api.js";

// ── Data type emoji map ────────────────────────────────────────────────────
const DATA_EMOJI = {
  sales: "🛍️",
  survey: "📋",
  financial: "💰",
  inventory: "📦",
  customer: "👥",
  other: "📊",
};

export default function SummaryCard({ session }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch summary automatically when component mounts
  useEffect(() => {
    fetchSummary();
  }, [session.sessionId]);

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSummary(session.sessionId);
      setSummary(data);
    } catch (err) {
      setError("Could not generate summary. Try refreshing.");
      console.error("Summary error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Loading State — skeleton ───────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="card"
        style={{
          background: "rgba(14,165,233,0.03)",
          borderColor: "rgba(14,165,233,0.15)",
        }}
      >
        {/* Header skeleton */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div
            className="skeleton"
            style={{ width: 32, height: 32, borderRadius: 8 }}
          />
          <div className="skeleton" style={{ width: 160, height: 18 }} />
        </div>
        {/* Paragraph skeleton */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <div className="skeleton" style={{ width: "100%", height: 14 }} />
          <div className="skeleton" style={{ width: "95%", height: 14 }} />
          <div className="skeleton" style={{ width: "88%", height: 14 }} />
          <div className="skeleton" style={{ width: "72%", height: 14 }} />
        </div>
        {/* Bullets skeleton */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div
                className="skeleton"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  flexShrink: 0,
                }}
              />
              <div
                className="skeleton"
                style={{ width: `${70 + i * 8}%`, height: 13 }}
              />
            </div>
          ))}
        </div>
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginTop: 14,
            textAlign: "center",
          }}
        >
          AI is analyzing your dataset…
        </p>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="alert alert-error">
        <span>⚠</span> {error}
        <button
          onClick={fetchSummary}
          style={{
            marginLeft: 12,
            background: "none",
            border: "1px solid var(--accent-rose)",
            borderRadius: 6,
            color: "var(--accent-rose)",
            fontSize: 11,
            padding: "2px 8px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!summary) return null;

  const emoji = DATA_EMOJI[summary.dataType] || "📊";

  // ── Summary Card ───────────────────────────────────────────────────────
  return (
    <div
      className="card"
      style={{
        background: "rgba(14,165,233,0.03)",
        borderColor: "rgba(14,165,233,0.2)",
        animation: "fadeUp 0.4s ease forwards",
      }}
    >
      {/* ── Header ────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "rgba(14,165,233,0.12)",
              border: "1px solid rgba(14,165,233,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            {emoji}
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Sparkles size={13} color="var(--brand)" />
              AI Dataset Summary
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Auto-generated from your data
            </div>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchSummary}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--text-muted)",
            padding: "5px 7px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
          }}
          title="Regenerate summary"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* ── Summary Paragraph ─────────────────── */}
      <p
        style={{
          fontSize: 14,
          color: "var(--text-secondary)",
          lineHeight: 1.75,
          marginBottom: 18,
          borderLeft: "2px solid rgba(14,165,233,0.3)",
          paddingLeft: 14,
        }}
      >
        {summary.summary}
      </p>

      {/* ── Quick Insights Bullets ─────────────── */}
      {summary.quickInsights?.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 4,
            }}
          >
            Key Findings
          </p>
          {summary.quickInsights.map((insight, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "8px 12px",
                background: "var(--bg-input)",
                borderRadius: 10,
                fontSize: 13,
                color: "var(--text-secondary)",
              }}
            >
              <TrendingUp
                size={13}
                color="var(--accent-teal)"
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              {insight}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
