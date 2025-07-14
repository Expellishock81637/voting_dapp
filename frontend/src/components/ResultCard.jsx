// frontend/src/components/ResultCard.jsx
import React from "react";

export default function ResultCard({ name, votes, percent }) {
  return (
    <div
      style={{
        border: "1px solid #aaa",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        maxWidth: "300px",
      }}
    >
      <h3>{name}</h3>
      <p>總票數：{votes}</p>
      <p>得票率：{percent}</p>
    </div>
  );
}
