import Papa from "papaparse";

// ── Parse CSV string into structured data ──────────────────────────────────
export function parseCSV(csvString) {
  const result = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    transformHeader: (h) => h.trim(), // remove whitespace from headers
  });

  // Clean each row — trim string values
  const data = result.data.map((row) => {
    const cleaned = {};
    Object.entries(row).forEach(([k, v]) => {
      cleaned[k] = typeof v === "string" ? v.trim() : v;
    });
    return cleaned;
  });

  return {
    data,
    columns: result.meta.fields?.map((f) => f.trim()) || [],
    rowCount: data.length,
  };
}

export function inferColumnTypes(data, columns) {
  const types = {};

  columns.forEach((col) => {
    const sample = data
      .slice(0, 30)
      .map((r) => r[col])
      .filter((v) => v !== null && v !== undefined && v !== "");

    if (sample.length === 0) {
      types[col] = "string";
      return;
    }

    const colLower = col.toLowerCase();

    // ── Year column detection ──────────────────────────────────────────
    // Column name suggests year OR all numeric values look like years
    const numericVals = sample.filter(
      (v) => typeof v === "number" && !isNaN(v),
    );
    const looksLikeYear =
      (colLower.includes("year") || colLower.includes("yr")) &&
      numericVals.length > 0 &&
      numericVals.every((v) => v >= 1900 && v <= 2200);

    if (looksLikeYear) {
      types[col] = "year";
      return;
    }

    // ── ID column detection ────────────────────────────────────────────
    // Column name suggests it's an ID — treat as string
    if (
      colLower === "id" ||
      colLower.endsWith("_id") ||
      colLower.startsWith("id_")
    ) {
      types[col] = "string";
      return;
    }

    const numericCount = sample.filter(
      (v) => typeof v === "number" && !isNaN(v),
    ).length;
    const dateCount = sample.filter((v) => {
      if (typeof v !== "string") return false;
      return (
        /^\d{4}-\d{2}-\d{2}/.test(v) ||
        /^\d{2}\/\d{2}\/\d{4}/.test(v) ||
        /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(v) ||
        (!isNaN(Date.parse(v)) && v.length > 4)
      );
    }).length;

    if (numericCount > sample.length * 0.7) types[col] = "numeric";
    else if (dateCount > sample.length * 0.5) types[col] = "date";
    else types[col] = "string";
  });

  return types;
}

// ── Calculate statistics for a numeric column ──────────────────────────────
export function calculateStats(data, column) {
  const values = data
    .map((r) => r[column])
    .filter((v) => typeof v === "number" && !isNaN(v));

  if (values.length === 0) return null;

  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  return {
    sum: +sum.toFixed(2),
    mean: +mean.toFixed(2),
    min,
    max,
    median: +median.toFixed(2),
    count: values.length,
  };
}

// ── Group data by a column and aggregate metric ────────────────────────────
export function groupBy(data, groupCol, metricCol, operation = "sum") {
  const groups = {};

  data.forEach((row) => {
    const key = row[groupCol];
    if (key === null || key === undefined || key === "") return;

    const strKey = String(key);
    if (!groups[strKey]) groups[strKey] = [];

    const val = Number(row[metricCol]);
    if (!isNaN(val)) groups[strKey].push(val);
  });

  return Object.entries(groups)
    .map(([key, values]) => {
      if (values.length === 0) return null;

      let result;
      if (operation === "sum") result = values.reduce((a, b) => a + b, 0);
      else if (operation === "avg")
        result = values.reduce((a, b) => a + b, 0) / values.length;
      else if (operation === "count") result = values.length;
      else if (operation === "max") result = Math.max(...values);
      else if (operation === "min") result = Math.min(...values);
      else result = values.reduce((a, b) => a + b, 0);

      return { [groupCol]: key, [metricCol]: +result.toFixed(2) };
    })
    .filter(Boolean)
    .sort((a, b) => b[metricCol] - a[metricCol]);
}

// ── Get top N rows sorted by a column ─────────────────────────────────────
export function topN(data, column, n = 5, order = "desc") {
  return [...data]
    .filter(
      (r) =>
        r[column] !== null &&
        r[column] !== undefined &&
        !isNaN(Number(r[column])),
    )
    .sort((a, b) =>
      order === "desc"
        ? Number(b[column]) - Number(a[column])
        : Number(a[column]) - Number(b[column]),
    )
    .slice(0, n);
}
