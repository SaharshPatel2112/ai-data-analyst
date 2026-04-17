import { useState, useRef, useEffect } from "react";
import { Send, User, Lightbulb, Sparkles } from "lucide-react";
import ChartRenderer from "./ChartRenderer.jsx";
import { getInsights, analyzeData } from "../utils/api.js";

const SUGGESTIONS = [
  "What is this dataset about?",
  "Show top 5 by highest value",
  "Show distribution as pie chart",
  "Give me summary statistics",
  "What are the unique categories?",
  "What should I analyze first?",
];

// ── Single Message Bubble ──────────────────────────────────────────────────
function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`chat-bubble ${isUser ? "user" : ""}`}
      style={{ alignItems: "flex-start" }}
    >
      <div className={`chat-avatar ${isUser ? "user" : "ai"}`}>
        {isUser ? <User size={13} /> : "AI"}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: "76%",
        }}
      >
        {/* Text bubble */}
        <div className={`chat-text ${isUser ? "user" : "ai"}`}>{msg.text}</div>

        {/* Follow up suggestion */}
        {msg.followUp && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              padding: "8px 12px",
              background: "rgba(167,139,250,0.06)",
              border: "1px solid rgba(167,139,250,0.2)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            <Sparkles
              size={12}
              color="var(--accent-purple)"
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            <span>
              <span style={{ color: "var(--accent-purple)", fontWeight: 500 }}>
                Try asking:{" "}
              </span>
              {msg.followUp}
            </span>
          </div>
        )}

        {/* Insight card */}
        {msg.insight && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              padding: "10px 14px",
              background: "rgba(251,191,36,0.06)",
              border: "1px solid rgba(251,191,36,0.2)",
              borderRadius: 12,
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            <Lightbulb
              size={13}
              color="var(--accent-amber)"
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            {msg.insight}
          </div>
        )}

        {/* Chart */}
        {msg.chartData && msg.chartData.length > 0 && (
          <div
            className="card"
            style={{ padding: "16px 16px 10px", marginTop: 4 }}
          >
            {msg.chartTitle && (
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 14,
                }}
              >
                {msg.chartTitle}
              </p>
            )}
            <ChartRenderer
              data={msg.chartData}
              chartType={msg.chartType}
              xKey={msg.xKey}
              yKey={msg.yKey}
            />
          </div>
        )}

        {/* Error */}
        {msg.error && (
          <div className="alert alert-error" style={{ marginTop: 4 }}>
            <span>⚠</span> {msg.error}
            {msg.retryQuery && (
              <button
                onClick={() => msg.onRetry(msg.retryQuery)}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Typing Indicator ───────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="chat-bubble" style={{ alignItems: "flex-start" }}>
      <div className="chat-avatar ai">AI</div>
      <div className="chat-text ai" style={{ padding: "4px 6px" }}>
        <div className="typing-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

// ── Main ChatPanel ─────────────────────────────────────────────────────────
export default function ChatPanel({ session, messages, setMessages }) {
  const { sessionId, rowCount, columns } = session;

  // ── Use parent state if provided, else local ───────────────────────────
  const defaultMessages = [
    {
      id: 0,
      role: "ai",
      text: `👋 Hi! I've loaded your dataset with ${rowCount.toLocaleString()} rows and ${columns.length} columns (${columns.join(", ")}). Ask me anything — I can explain the data, find patterns, or show you charts!`,
    },
  ];

  const [localMessages, setLocalMessages] = useState(defaultMessages);

  // Use parent-controlled messages if passed in, else use local
  const msgs = messages ?? localMessages;
  const setMsgs = setMessages ?? setLocalMessages;

  // If parent passes null (reset), reinitialize
  useEffect(() => {
    if (messages === null && setMessages) {
      setMessages(defaultMessages);
    }
  }, [messages]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  // ── Send message ───────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const query = text || input.trim();
    if (!query || loading) return;
    setInput("");

    const userMsg = { id: Date.now(), role: "user", text: query };
    setMsgs((prev) => [...(prev ?? defaultMessages), userMsg]);
    setLoading(true);

    try {
      const aiResponse = await getInsights(sessionId, query);

      // ── Conversational response ──────────────────────────────────────
      if (aiResponse.responseType === "text") {
        const aiMsg = {
          id: Date.now() + 1,
          role: "ai",
          text: aiResponse.answer,
          // Only show follow-up if it's not an ending message
          followUp: aiResponse.isEnding ? null : aiResponse.followUp,
        };
        setMsgs((prev) => [...(prev ?? []), aiMsg]);

        // ── Chart response ───────────────────────────────────────────────
      } else if (aiResponse.responseType === "chart") {
        const { result, chartType, xKey, yKey } = await analyzeData(
          sessionId,
          aiResponse.operation,
        );
        const aiMsg = {
          id: Date.now() + 1,
          role: "ai",
          text: aiResponse.title || "Here's what I found:",
          insight: aiResponse.insight,
          chartTitle: aiResponse.title,
          chartData: result,
          chartType: aiResponse.chartType || chartType,
          xKey,
          yKey,
        };
        setMsgs((prev) => [...(prev ?? []), aiMsg]);
      } else {
        const aiMsg = {
          id: Date.now() + 1,
          role: "ai",
          text:
            aiResponse.answer || "I processed your request. Please try again.",
        };
        setMsgs((prev) => [...(prev ?? []), aiMsg]);
      }
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        role: "ai",
        text: "Sorry, I couldn't process that.",
        error:
          err.response?.data?.error ||
          err.message ||
          "Something went wrong. Make sure the backend is running.",
        retryQuery: query,
        onRetry: sendMessage,
      };
      setMsgs((prev) => [...(prev ?? []), errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-wrapper">
      {/* Messages */}
      <div className="chat-messages">
        {(msgs ?? defaultMessages).map((msg) => (
          <Message key={msg.id} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions — only on first load */}
      {(msgs ?? defaultMessages).length <= 1 && (
        <div className="suggestion-chips">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="chip"
              onClick={() => sendMessage(s)}
              disabled={loading}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrap">
          <textarea
            className="chat-input"
            placeholder="Ask anything about your data…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Send size={14} />
          </button>
        </div>
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Enter to send · Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
