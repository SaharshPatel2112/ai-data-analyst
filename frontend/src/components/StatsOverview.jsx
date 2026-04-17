import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { toLabel, formatNumber, CHART_COLORS } from "../utils/helpers.js";
import ChartRenderer from "./ChartRenderer.jsx";
import SummaryCard from "./SummaryCard.jsx";

// ── Collapsible Section ────────────────────────────────────────────────────
function CollapsibleSection({ title, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 22px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "DM Sans, sans-serif",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            {title}
          </span>
          {badge && <span className="badge badge-blue">{badge}</span>}
        </div>
        <div
          style={{
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
          }}
        >
          <span>{open ? "Hide" : "Show"}</span>
          {open ? (
            <ChevronUp size={15} color="var(--text-muted)" />
          ) : (
            <ChevronDown size={15} color="var(--text-muted)" />
          )}
        </div>
      </button>

      {open && (
        <div
          style={{
            padding: "0 22px 20px",
            borderTop: "1px solid var(--border)",
            animation: "pageEnter 0.2s ease forwards",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── Single Chart Card ──────────────────────────────────────────────────────
function ChartCard({ title, subtitle, data, chartType, xKey, yKey }) {
  if (!data || data.length < 2) return null;
  return (
    <div className="card">
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: 3,
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          marginBottom: 16,
        }}
      >
        {subtitle}
      </p>
      <ChartRenderer
        data={data}
        chartType={chartType}
        xKey={xKey}
        yKey={yKey}
      />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function StatsOverview({ session, onGoToChat }) {
  const { columns, columnTypes, stats, rowCount, data } = session;

  // Only show stats for TRUE numeric columns — skip year, id, etc.
  const numericCols = columns.filter((c) => columnTypes[c] === "numeric");
  const yearCols = columns.filter((c) => columnTypes[c] === "year");
  const stringCols = columns.filter((c) => columnTypes[c] === "string");

  // Build smart charts
  const charts = buildSmartCharts(session);

  // Split charts into rows
  const row1Charts = charts.filter((c) => c.row === 1);
  const row2Charts = charts.filter((c) => c.row === 2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── AI Summary ─────────────────────────── */}
      <SummaryCard session={session} />

      {/* ── Quick Charts ───────────────────────── */}
      {charts.length > 0 && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <h3 className="section-title">Quick Charts</h3>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {charts.length} chart{charts.length > 1 ? "s" : ""} auto-generated
            </span>
          </div>

          {/* Row 1 — bar + pie side by side */}
          {row1Charts.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: row1Charts.length > 1 ? "1fr 1fr" : "1fr",
                gap: 16,
                marginBottom: row2Charts.length > 0 ? 16 : 0,
              }}
            >
              {row1Charts.map((chart, i) => (
                <ChartCard key={i} {...chart} />
              ))}
            </div>
          )}

          {/* Row 2 — full width line chart */}
          {row2Charts.map((chart, i) => (
            <ChartCard key={i} {...chart} />
          ))}
        </div>
      )}

      {/* ── Numeric Column Summary — skip year columns ── */}
      {numericCols.length > 0 && (
        <CollapsibleSection
          title="Numeric Column Summary"
          badge={`${numericCols.length} column${numericCols.length > 1 ? "s" : ""}`}
          defaultOpen={false}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              paddingTop: 16,
            }}
          >
            {numericCols.map((col, i) => {
              const s = stats[col];
              if (!s) return null;
              return (
                <div key={col}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: CHART_COLORS[i % CHART_COLORS.length],
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: "var(--text-primary)",
                        }}
                      >
                        {toLabel(col)}
                      </span>
                    </div>
                    <span className="badge badge-blue">{s.count} values</span>
                  </div>

                  <div className="mini-stats-grid">
                    {[
                      { label: "Sum", value: s.sum },
                      { label: "Average", value: s.mean },
                      { label: "Min", value: s.min },
                      { label: "Max", value: s.max },
                      { label: "Median", value: s.median },
                    ].map(({ label, value }) => (
                      <div className="mini-stat-box" key={label}>
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: 5,
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            fontFamily: "JetBrains Mono, monospace",
                          }}
                        >
                          {formatNumber(value)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {i < numericCols.length - 1 && (
                    <div className="divider" style={{ marginTop: 16 }} />
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* ── All Columns ────────────────────────── */}
      <CollapsibleSection
        title="All Columns"
        badge={`${columns.length} total`}
        defaultOpen={false}
      >
        <table className="data-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Column Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col, i) => (
              <tr key={col}>
                <td
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 11,
                  }}
                >
                  {i + 1}
                </td>
                <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                  {col}
                </td>
                <td>
                  <span
                    className={`badge ${
                      columnTypes[col] === "numeric"
                        ? "badge-teal"
                        : columnTypes[col] === "year"
                          ? "badge-amber"
                          : columnTypes[col] === "date"
                            ? "badge-amber"
                            : "badge-purple"
                    }`}
                  >
                    {columnTypes[col]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsibleSection>

      {/* ── CTA ────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: "rgba(14,165,233,0.04)",
          borderColor: "rgba(14,165,233,0.2)",
          textAlign: "center",
          padding: "32px 24px",
        }}
      >
        <div style={{ fontSize: 34, marginBottom: 10 }}>💬</div>
        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Ask Your Data Anything
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            marginBottom: 18,
          }}
        >
          Switch to AI Chat to get instant charts and insights using plain
          English.
        </p>
        <button className="btn btn-primary" onClick={onGoToChat}>
          Open AI Chat <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SMART CHART BUILDER
// ══════════════════════════════════════════════════════════════════════════
function buildSmartCharts(session) {
  const charts = [];

  try {
    const { columns, columnTypes, data } = session;
    if (!data || data.length === 0) return charts;

    // ── Categorize columns ─────────────────────────────────────────────
    const yearCols = columns.filter((c) => columnTypes[c] === "year");
    const numericCols = columns.filter((c) => columnTypes[c] === "numeric");
    const stringCols = columns.filter((c) => {
      if (columnTypes[c] !== "string") return false;
      const unique = new Set(data.map((r) => r[c]).filter(Boolean)).size;
      return unique >= 2 && unique <= 20;
    });

    const percentCols = numericCols.filter((c) => {
      const n = c.toLowerCase();
      return (
        n.includes("percent") ||
        n.includes("pct") ||
        n.includes("rate") ||
        n.includes("ratio")
      );
    });
    const metricCols = numericCols.filter((c) => !percentCols.includes(c));

    // ── Detect Pass/Fail result column ─────────────────────────────────
    const resultCol = stringCols.find((c) => {
      const vals = data.map((r) =>
        String(r[c] || "")
          .toLowerCase()
          .trim(),
      );
      const unique = new Set(vals.filter(Boolean));
      return (
        (unique.has("pass") && unique.has("fail")) ||
        (unique.has("yes") && unique.has("no")) ||
        (unique.has("true") && unique.has("false"))
      );
    });

    // ── Detect year column used as category (Entry Year) ───────────────
    const yearAsCategory = yearCols[0];

    // ── Detect best category columns (not result, not year-like) ───────
    const categoryCol = stringCols.find((c) => {
      if (c === resultCol) return false;
      const colLower = c.toLowerCase();
      if (
        colLower.includes("name") &&
        colLower !== "college name" &&
        colLower !== "course"
      )
        return false;
      const unique = new Set(data.map((r) => r[c]).filter(Boolean)).size;
      return unique >= 2 && unique <= 15;
    });

    const secondCategoryCol = stringCols.find(
      (c) =>
        c !== resultCol &&
        c !== categoryCol &&
        new Set(data.map((r) => r[c]).filter(Boolean)).size >= 2 &&
        new Set(data.map((r) => r[c]).filter(Boolean)).size <= 15,
    );

    // ══════════════════════════════════════════════════════════════════
    // CHART 1 — BAR CHART
    // ══════════════════════════════════════════════════════════════════

    // Priority A: Pass/Fail bar chart — count of each result
    if (resultCol) {
      const freq = countFrequency(data, resultCol);
      if (freq && freq.length >= 2) {
        // Color pass green, fail red using the value label
        charts.push({
          row: 1,
          title: `Pass vs Fail — ${toLabel(resultCol)}`,
          subtitle: `Bar Chart · total count of each result (${data.length} students)`,
          data: freq,
          chartType: "bar",
          xKey: resultCol,
          yKey: "count",
          // pass colors hint for ChartRenderer
          isResultChart: true,
        });
      }
    }
    // Priority B: Best category col vs main metric
    else if (categoryCol && metricCols.length > 0) {
      const barData = buildGrouped(data, categoryCol, metricCols[0], "sum");
      if (barData && barData.length >= 2) {
        charts.push({
          row: 1,
          title: `${toLabel(metricCols[0])} by ${toLabel(categoryCol)}`,
          subtitle: `Bar Chart · total per ${toLabel(categoryCol)}`,
          data: barData,
          chartType: "bar",
          xKey: categoryCol,
          yKey: metricCols[0],
        });
      }
    }
    // Priority C: category frequency
    else if (categoryCol) {
      const freq = countFrequency(data, categoryCol);
      if (freq && freq.length >= 2) {
        charts.push({
          row: 1,
          title: `Students by ${toLabel(categoryCol)}`,
          subtitle: `Bar Chart · count per ${toLabel(categoryCol)}`,
          data: freq,
          chartType: "bar",
          xKey: categoryCol,
          yKey: "count",
        });
      }
    }

    // ══════════════════════════════════════════════════════════════════
    // CHART 2 — PIE CHART
    // ══════════════════════════════════════════════════════════════════

    let pieAdded = false;

    // Option A: Urban/Rural % pie
    const urbanCol = percentCols.find((c) => c.toLowerCase().includes("urban"));
    const ruralCol = percentCols.find((c) => c.toLowerCase().includes("rural"));
    if (urbanCol && ruralCol) {
      const avgUrban = average(data, urbanCol);
      const avgRural = average(data, ruralCol);
      if (avgUrban > 0 || avgRural > 0) {
        charts.push({
          row: 1,
          title: "Urban vs Rural Split",
          subtitle: "Pie Chart · average across all records",
          data: [
            { segment: "Urban", value: +avgUrban.toFixed(1) },
            { segment: "Rural", value: +avgRural.toFixed(1) },
          ],
          chartType: "pie",
          xKey: "segment",
          yKey: "value",
        });
        pieAdded = true;
      }
    }

    // Option B: If result chart is bar, show second category as pie
    if (!pieAdded && secondCategoryCol) {
      const pieData = countFrequency(data, secondCategoryCol);
      if (pieData && pieData.length >= 2) {
        charts.push({
          row: 1,
          title: `Breakdown by ${toLabel(secondCategoryCol)}`,
          subtitle: `Pie Chart · student distribution by ${toLabel(secondCategoryCol)}`,
          data: pieData,
          chartType: "pie",
          xKey: secondCategoryCol,
          yKey: "count",
        });
        pieAdded = true;
      }
    }

    // Option C: First category col as pie
    if (!pieAdded && categoryCol) {
      const pieData = countFrequency(data, categoryCol);
      if (pieData && pieData.length >= 2) {
        charts.push({
          row: 1,
          title: `Distribution by ${toLabel(categoryCol)}`,
          subtitle: `Pie Chart · count per ${toLabel(categoryCol)}`,
          data: pieData,
          chartType: "pie",
          xKey: categoryCol,
          yKey: "count",
        });
      }
    }

    // ══════════════════════════════════════════════════════════════════
    // CHART 3 — LINE CHART (trend over year)
    // ══════════════════════════════════════════════════════════════════

    if (yearAsCategory) {
      // Case A: has numeric metric → sum per year
      if (metricCols.length > 0) {
        const yearGroups = {};
        data.forEach((row) => {
          const yr = row[yearAsCategory];
          const val = Number(row[metricCols[0]]);
          if (yr == null || isNaN(val)) return;
          yearGroups[yr] = (yearGroups[yr] || 0) + val;
        });

        const lineData = Object.entries(yearGroups)
          .map(([k, v]) => ({
            year: Number(k),
            [metricCols[0]]: +v.toFixed(2),
          }))
          .sort((a, b) => a.year - b.year);

        if (lineData.length >= 2) {
          charts.push({
            row: 2,
            title: `${toLabel(metricCols[0])} Growth (${lineData[0].year} → ${lineData[lineData.length - 1].year})`,
            subtitle: `Line Chart · total ${toLabel(metricCols[0])} per year`,
            data: lineData,
            chartType: "line",
            xKey: "year",
            yKey: metricCols[0],
          });
        }
      }
      // Case B: NO numeric → count records per year (enrollment trend)
      else {
        const yearCount = {};
        data.forEach((row) => {
          const yr = row[yearAsCategory];
          if (yr == null) return;
          yearCount[yr] = (yearCount[yr] || 0) + 1;
        });

        const lineData = Object.entries(yearCount)
          .map(([k, v]) => ({ year: Number(k), students: v }))
          .sort((a, b) => a.year - b.year);

        if (lineData.length >= 2) {
          charts.push({
            row: 2,
            title: `Student Enrollment Growth (${lineData[0].year} → ${lineData[lineData.length - 1].year})`,
            subtitle: `Line Chart · number of students joined per year`,
            data: lineData,
            chartType: "line",
            xKey: "year",
            yKey: "students",
          });
        }
      }
    }

    // Fallback line: 2 numeric cols
    if (!yearAsCategory && metricCols.length >= 2) {
      const lineData = data
        .filter((r) => r[metricCols[0]] != null && r[metricCols[1]] != null)
        .map((r) => ({
          [metricCols[0]]: Number(r[metricCols[0]]),
          [metricCols[1]]: Number(r[metricCols[1]]),
        }))
        .filter((r) => !isNaN(r[metricCols[0]]) && !isNaN(r[metricCols[1]]))
        .slice(0, 20);

      if (lineData.length >= 3) {
        charts.push({
          row: 2,
          title: `${toLabel(metricCols[1])} vs ${toLabel(metricCols[0])}`,
          subtitle: "Line Chart",
          data: lineData,
          chartType: "line",
          xKey: metricCols[0],
          yKey: metricCols[1],
        });
      }
    }
  } catch (err) {
    console.error("Chart builder error:", err);
  }

  return charts;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function buildGrouped(data, groupCol, metricCol, operation = "sum") {
  try {
    const groups = {};
    data.forEach((row) => {
      const key = row[groupCol];
      const val = Number(row[metricCol]);
      if (key == null || key === "" || isNaN(val)) return;
      if (!groups[String(key)]) groups[String(key)] = [];
      groups[String(key)].push(val);
    });

    return Object.entries(groups)
      .map(([key, values]) => {
        if (values.length === 0) return null;
        let result;
        if (operation === "sum") result = values.reduce((a, b) => a + b, 0);
        if (operation === "avg")
          result = values.reduce((a, b) => a + b, 0) / values.length;
        if (operation === "count") result = values.length;
        if (operation === "max") result = Math.max(...values);
        if (operation === "min") result = Math.min(...values);
        return { [groupCol]: key, [metricCol]: +result.toFixed(2) };
      })
      .filter(Boolean)
      .sort((a, b) => b[metricCol] - a[metricCol])
      .slice(0, 8);
  } catch {
    return null;
  }
}

function countFrequency(data, col) {
  try {
    const freq = {};
    data.forEach((row) => {
      const v = row[col];
      if (v != null && v !== "") {
        freq[String(v)] = (freq[String(v)] || 0) + 1;
      }
    });
    return Object.entries(freq)
      .map(([k, v]) => ({ [col]: k, count: v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  } catch {
    return null;
  }
}

function average(data, col) {
  const vals = data.map((r) => Number(r[col])).filter((v) => !isNaN(v));
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
