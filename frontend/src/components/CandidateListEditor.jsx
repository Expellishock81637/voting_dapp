import React, { useState } from "react";
import { MdEdit, MdDelete, MdCheck, MdClose } from "react-icons/md";

export default function CandidateListEditor({ candidates, onChange, onAdd, onRemove }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditValue(candidates[index]);
  };

  const handleConfirmEdit = () => {
    onChange(editingIndex, editValue.trim());
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{ color: "#333", marginBottom: "1rem" }}>👥 候選人清單</h3>
      {candidates.map((name, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            color: "#333",
          }}
        >
          {editingIndex === i ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                flex: 1,
                marginRight: "1rem",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                color: "#333",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
              }}
            />
          ) : (
            <p style={{ flex: 1 }}>{name}</p>
          )}

          <div style={{ display: "flex", alignItems: "center" }}>
            {editingIndex === i ? (
              <>
                <MdCheck
                  size={22}
                  style={{ cursor: "pointer", marginRight: "0.5rem", color: "#27ae60" }}
                  onClick={handleConfirmEdit}
                />
                <MdClose
                  size={22}
                  style={{ cursor: "pointer", color: "#c0392b" }}
                  onClick={handleCancelEdit}
                />
              </>
            ) : (
              <>
                <MdEdit
                  size={22}
                  style={{ cursor: "pointer", marginRight: "0.5rem", color: "#2980b9" }}
                  onClick={() => handleEdit(i)}
                />
                {candidates.length > 1 && (
                  <MdDelete
                    size={22}
                    style={{ cursor: "pointer", color: "#c0392b" }}
                    onClick={() => onRemove(i)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={onAdd}
        style={{
          backgroundColor: "#3498db",
          color: "#fff",
          border: "none",
          padding: "0.6rem 1.2rem",
          borderRadius: "8px",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        ➕ 新增候選人
      </button>
    </div>
  );
}
