import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  toLabel,
  formatNumber,
  truncate,
  CHART_COLORS,
} from "../utils/helpers.js";

// ── Custom Tooltip ─────────────────────────────────────────────────────────
// This replaces the default ugly tooltip with our dark styled one
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "10px 14px",
        fontSize: 13,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <p style={{ color: "var(--text-muted)", marginBottom: 6, fontSize: 11 }}>
        {label}
      </p>
      {payload.map((p) => (
        <p
          key={p.name}
          style={{ color: p.color || "var(--brand)", fontWeight: 600 }}
        >
          {toLabel(p.name)}: {formatNumber(p.value)}
        </p>
      ))}
    </div>
  );
}

// ── Shared axis styles ─────────────────────────────────────────────────────
const AXIS_STYLE = {
  tick: {
    fill: "var(--text-muted)",
    fontSize: 11,
    fontFamily: "DM Sans, sans-serif",
  },
  axisLine: { stroke: "var(--border)" },
  tickLine: false,
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function ChartRenderer({ data, chartType, xKey, yKey, title }) {
  // Guard — show message if no data
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 220,
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        No data to display
      </div>
    );
  }

  // Truncate long labels so they don't overflow the axis
  const tickFormatter = (v) =>
    typeof v === "string" ? truncate(String(v), 12) : formatNumber(v);

  // ── TABLE ────────────────────────────────────────────────────────────────
  // When AI returns raw data, show it as a table instead of a chart
  if (chartType === "table") {
    const cols = Object.keys(data[0]);
    return (
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c}>{toLabel(c)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {cols.map((c) => (
                  <td
                    key={c}
                    className={typeof row[c] === "number" ? "numeric" : ""}
                  >
                    {typeof row[c] === "number"
                      ? formatNumber(row[c])
                      : String(row[c] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── PIE CHART ────────────────────────────────────────────────────────────
  // Best for: distribution, category breakdown, percentages
  if (chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey={yKey}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            paddingAngle={2}
            label={({ name, percent }) =>
              `${truncate(String(name), 10)} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(v) => (
              <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                {truncate(String(v), 16)}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // ── LINE CHART ───────────────────────────────────────────────────────────
  // Best for: trends over time, continuous data
  if (chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148,163,184,0.07)"
          />
          <XAxis dataKey={xKey} {...AXIS_STYLE} tickFormatter={tickFormatter} />
          <YAxis {...AXIS_STYLE} tickFormatter={formatNumber} width={58} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={CHART_COLORS[0]}
            strokeWidth={2.5}
            dot={{ fill: CHART_COLORS[0], r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // ── AREA CHART ───────────────────────────────────────────────────────────
  // Same as line but with filled area underneath — looks great for trends
  if (chartType === "area") {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            {/* Gradient fill under the area */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148,163,184,0.07)"
          />
          <XAxis dataKey={xKey} {...AXIS_STYLE} tickFormatter={tickFormatter} />
          <YAxis {...AXIS_STYLE} tickFormatter={formatNumber} width={58} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={CHART_COLORS[0]}
            fill="url(#areaGradient)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // ── BAR CHART (default) ──────────────────────────────────────────────────
  const isPassFail = data.some(
    (r) =>
      String(r[xKey]).toLowerCase() === "pass" ||
      String(r[xKey]).toLowerCase() === "fail",
  );

  const getBarColor = (entry, index) => {
    if (isPassFail) {
      const val = String(entry[xKey]).toLowerCase();
      if (val === "pass") return "#2dd4bf"; // teal for pass
      if (val === "fail") return "#fb7185"; // rose for fail
    }
    return CHART_COLORS[index % CHART_COLORS.length];
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" />
        <XAxis dataKey={xKey} {...AXIS_STYLE} tickFormatter={tickFormatter} />
        <YAxis
          {...AXIS_STYLE}
          tickFormatter={formatNumber}
          width={58}
          label={{
            value: yKey === "count" ? "Number of Students" : toLabel(yKey),
            angle: -90,
            position: "insideLeft",
            offset: 10,
            style: { fill: "var(--text-muted)", fontSize: 10 },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={yKey} radius={[5, 5, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getBarColor(entry, i)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
