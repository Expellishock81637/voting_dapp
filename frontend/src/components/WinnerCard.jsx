import React from "react";

export default function WinnerCard({ winners }) {
  if (!Array.isArray(winners) || winners.length === 0) {
    return (
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f8f8f8",
          borderRadius: "8px",
          textAlign: "center",
          color: "#999",
        }}
      >
        🎯 目前沒有贏家資訊。
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "2rem",
        backgroundColor: "#f0f8ff",
        padding: "1.5rem",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "1rem", textAlign: "center", color: "#2c3e50" }}>
        🏆 得票最高者
      </h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {winners.map((name, index) => (
          <li
            key={index}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #ddd",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontWeight: "500",
              color: "#34495e",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>
              {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎖️"}
            </span>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
