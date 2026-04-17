import { useState, useRef, useCallback } from "react";
import { Upload, FileText, CheckCircle, ArrowRight } from "lucide-react";
import { uploadCSV } from "../utils/api.js";
import { formatFileSize } from "../utils/helpers.js";

const SAMPLE_QUERIES = [
  "Top 5 by highest value",
  "Show monthly trend",
  "Distribution by category",
  "Summary statistics",
];

export default function UploadPage({ onUploadSuccess }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!f.name.endsWith(".csv")) {
      setError("Please upload a .csv file only.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
      return;
    }
    setError("");
    setFile(f);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = await uploadCSV(file, setProgress);
      onUploadSuccess(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Upload failed. Make sure the backend server is running.",
      );
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Header ────────────────────────────── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 40px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "linear-gradient(135deg, #0ea5e9, #2dd4bf)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: 14,
            color: "white",
          }}
        >
          A
        </div>
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--text-primary)",
          }}
        >
          AI Data Analyst
        </span>
      </header>

      {/* ── Main ──────────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* ── Hero Text ─────────────────────── */}
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 38,
                fontWeight: 700,
                lineHeight: 1.25,
                color: "var(--text-primary)",
                marginBottom: 10,
                letterSpacing: "-0.5px",
              }}
            >
              Turn Your Data Into
              <br />
              <span
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  background: "linear-gradient(90deg, #38bdf8, #2dd4bf)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                  lineHeight: 1.5,
                  paddingBottom: 6,
                  marginBottom: -6,
                }}
              >
                Instant Insights
              </span>
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Upload a CSV · Ask in plain English · Get charts instantly
            </p>
          </div>

          {/* ── Upload Zone ───────────────────── */}
          <div
            className={`upload-zone ${dragOver ? "drag-over" : ""}`}
            style={{ padding: "28px 24px", borderRadius: 16 }}
            onClick={() => !uploading && inputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {file ? (
              <>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "rgba(45,212,191,0.1)",
                    border: "1px solid rgba(45,212,191,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle size={22} color="var(--accent-teal)" />
                </div>
                <div className="file-badge">
                  <FileText size={12} />
                  {file.name}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {formatFileSize(file.size)}
                </p>
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: 12, padding: "4px 12px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setProgress(0);
                  }}
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <div
                  className="upload-icon-wrap"
                  style={{ width: 56, height: 56 }}
                >
                  <Upload size={22} color="var(--brand)" />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    Drop your CSV file here
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    or click to browse · Max 10MB
                  </p>
                </div>
              </>
            )}

            {uploading && (
              <div className="upload-progress">
                <div
                  className="upload-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* ── Error ─────────────────────────── */}
          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          {/* ── Upload Button ─────────────────── */}
          <button
            className="btn btn-primary"
            style={{ width: "100%", height: 48, fontSize: 15 }}
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? (
              <>
                <span style={{ animation: "spin 1s linear infinite" }}>⟳</span>
                Analyzing…
              </>
            ) : (
              <>
                Analyze My Data <ArrowRight size={15} />
              </>
            )}
          </button>

          {/* ── Sample Queries ─────────────────── */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Example questions you can ask
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {SAMPLE_QUERIES.map((q) => (
                <span className="chip" key={q} style={{ fontSize: 11 }}>
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
