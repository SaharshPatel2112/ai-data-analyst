import { useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Table2,
  Upload,
  LogOut,
  Hash,
  Type,
  Menu,
} from "lucide-react";
import StatsOverview from "../components/StatsOverview.jsx";
import DataPreview from "../components/DataPreview.jsx";
import ChatPanel from "../components/ChatPanel.jsx";

const NAV_ITEMS = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "chat", icon: MessageSquare, label: "AI Chat" },
  { id: "data", icon: Table2, label: "Data Preview" },
];

export default function DashboardPage({ session, onReset }) {
  const [active, setSidebarOpen] = useState("overview");
  const [sidebarOpen, setSidebar] = useState(false);
  const [chatMessages, setChatMessages] = useState(null);

  // rename for clarity
  const activeTab = active;
  const setActiveTab = setSidebarOpen;

  const { filename, rowCount, columns, columnTypes } = session;

  const numericCols = columns.filter((c) => columnTypes[c] === "numeric");
  const stringCols = columns.filter((c) => columnTypes[c] === "string");
  const dateCols = columns.filter((c) => columnTypes[c] === "date");

  const closeSidebar = () => setSidebar(false);

  return (
    <div className="dashboard-layout">
      {/* ── Mobile overlay ────────────────────── */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />

      {/* ══════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════ */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo + close button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 8px 18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="logo-mark">A</div>
            <div>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--text-primary)",
                }}
              >
                AI Analyst
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`nav-item ${activeTab === id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(id);
                closeSidebar();
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div className="divider" />

        {/* Column types breakdown */}
        <div
          style={{
            padding: "8px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 2,
            }}
          >
            Column Types
          </p>
          {numericCols.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Hash size={12} color="var(--accent-teal)" />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {numericCols.length} numeric
              </span>
            </div>
          )}
          {stringCols.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Type size={12} color="var(--accent-purple)" />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {stringCols.length} text
              </span>
            </div>
          )}
          {dateCols.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11 }}>📅</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {dateCols.length} date
              </span>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom Buttons */}
        <button
          className="nav-item"
          onClick={() => {
            setChatMessages(null);
            onReset();
          }}
        >
          <Upload size={14} /> New File
        </button>
        <button
          className="nav-item"
          style={{ color: "var(--accent-rose)" }}
          onClick={() => {
            setChatMessages(null);
            onReset();
          }}
        >
          <LogOut size={14} /> Exit
        </button>
      </aside>

      {/* ══════════════════════════════════════
          HEADER
      ══════════════════════════════════════ */}
      <header className="dashboard-header">
        {/* Hamburger — shows on mobile */}
        <button className="hamburger-btn" onClick={() => setSidebar(true)}>
          <Menu size={18} />
        </button>

        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--text-primary)",
          }}
        >
          {activeTab === "overview" && "Overview"}
          {activeTab === "chat" && "AI Chat"}
          {activeTab === "data" && "Data Preview"}
        </h2>

        {/* Live indicator dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className="pulse-dot" />
          <span className="badge badge-blue" style={{ fontSize: 10 }}>
            {filename}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {rowCount.toLocaleString()} rows · {columns.length} cols
        </span>
      </header>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <main className="dashboard-main">
        <div className="page-enter" key={activeTab}>
          {activeTab === "overview" && (
            <StatsOverview
              session={session}
              onGoToChat={() => setActiveTab("chat")}
            />
          )}

          {activeTab === "chat" && (
            <ChatPanel
              session={session}
              messages={chatMessages}
              setMessages={setChatMessages}
            />
          )}

          {activeTab === "data" && <DataPreview session={session} />}
        </div>
      </main>
    </div>
  );
}
