// Format number: 1200 → 1.2K
export function formatNumber(val) {
  if (val === null || val === undefined) return "—";
  if (typeof val !== "number") return val;
  if (Math.abs(val) >= 1_000_000) return (val / 1_000_000).toFixed(1) + "M";
  if (Math.abs(val) >= 1_000) return (val / 1_000).toFixed(1) + "K";
  return val % 1 === 0 ? val.toString() : val.toFixed(2);
}

// Format file size: 1024 → 1 KB
export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// "total_revenue" → "Total Revenue"
export function toLabel(str) {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Truncate long strings
export function truncate(str, n = 20) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "…" : str;
}

// Chart color palette
export const CHART_COLORS = [
  "#0ea5e9",
  "#2dd4bf",
  "#a78bfa",
  "#fbbf24",
  "#fb7185",
  "#34d399",
  "#f97316",
  "#60a5fa",
];
