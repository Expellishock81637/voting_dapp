// frontend/src/components/VotingDurationInput.jsx
import React from "react";

export default function VotingDurationInput({ duration, onChange }) {
  return (
    <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
      <label>投票時間（分鐘）：</label>
      <input
        type="number"
        min="1"
        value={duration}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
