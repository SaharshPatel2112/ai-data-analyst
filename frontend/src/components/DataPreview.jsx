import { toLabel, formatNumber, truncate } from "../utils/helpers.js";
import { Table2 } from "lucide-react";

export default function DataPreview({ session }) {
  const { preview, columns, columnTypes, rowCount } = session;

  // ── Empty state ────────────────────────────────────────────────────────
  if (!preview || preview.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <div className="empty-state-title">No Preview Available</div>
        <div className="empty-state-desc">
          Could not load data preview. Try re-uploading your CSV file.
        </div>
      </div>
    );
  }

  return (
    <div
      className="page-enter"
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      {/* ── Header ────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 className="section-title">Data Preview</h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            First {preview.length} rows of {rowCount.toLocaleString()} total
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="badge badge-blue">{columns.length} columns</span>
          <span className="badge badge-teal">
            {rowCount.toLocaleString()} rows
          </span>
        </div>
      </div>

      {/* ── Table ─────────────────────────────── */}
      <div className="table-wrapper">
        <table
          className="data-table"
          style={{ minWidth: columns.length * 130 }}
        >
          <thead>
            <tr>
              <th style={{ width: 44 }}>#</th>
              {columns.map((col) => (
                <th key={col}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    {toLabel(col)}
                    <span
                      style={{
                        fontSize: 9,
                        opacity: 0.5,
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {columnTypes[col] === "numeric"
                        ? "123"
                        : columnTypes[col] === "date"
                          ? "date"
                          : "abc"}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, i) => (
              <tr key={i}>
                <td
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 11,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {i + 1}
                </td>
                {columns.map((col) => (
                  <td
                    key={col}
                    className={columnTypes[col] === "numeric" ? "numeric" : ""}
                  >
                    {row[col] === null ||
                    row[col] === undefined ||
                    row[col] === "" ? (
                      <span
                        style={{
                          color: "var(--text-muted)",
                          fontStyle: "italic",
                          fontSize: 11,
                          opacity: 0.6,
                        }}
                      >
                        null
                      </span>
                    ) : columnTypes[col] === "numeric" ? (
                      formatNumber(row[col])
                    ) : (
                      truncate(String(row[col]), 28)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer note ───────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          background: "var(--bg-card)",
          borderRadius: 10,
          border: "1px solid var(--border)",
        }}
      >
        <Table2 size={13} color="var(--text-muted)" />
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Showing preview only. Use{" "}
          <span style={{ color: "var(--brand)" }}>AI Chat</span> to query and
          analyze all {rowCount.toLocaleString()} rows.
        </p>
      </div>
    </div>
  );
}
