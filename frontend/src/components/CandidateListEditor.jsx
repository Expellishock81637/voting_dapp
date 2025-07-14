// frontend/src/components/CandidateListEditor.jsx
import React from "react";

export default function CandidateListEditor({ candidates, onChange, onAdd, onRemove }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label>候選人清單：</label>
      {candidates.map((name, i) => (
        <div key={i} style={{ marginBottom: "0.5rem" }}>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange(i, e.target.value)}
          />
          {candidates.length > 1 && (
            <button onClick={() => onRemove(i)} style={{ marginLeft: "0.5rem" }}>
              移除
            </button>
          )}
        </div>
      ))}
      <button onClick={onAdd}>➕ 新增候選人</button>
    </div>
  );
}
