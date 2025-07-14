// frontend/src/components/TotalVoterCard.jsx
import React from "react";

export default function TotalVoterCard({ total }) {
  return (
    <div
      style={{
        border: "2px dashed #444",
        padding: "1rem",
        borderRadius: "10px",
        marginBottom: "2rem",
        maxWidth: "320px",
        backgroundColor: "#f5f5f5",
        fontWeight: "bold",
      }}
    >
      🧾 總投票人數：{total} 人
    </div>
  );
}
