import React from "react";
import { MdEdit, MdDelete, MdCheck, MdClose } from "react-icons/md";
import PrimaryButton from "./PrimaryButton";

export default function CandidateManagerPanel({
  candidates,
  newCandidate,
  editNames,
  setEditNames,
  setNewCandidate,
  onAdd,
  onEdit,
  onDisable,
  toggleEditing,
}) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{ color: "#333", marginBottom: "1rem" }}>📋 候選人管理</h3>
      {candidates.map((c) =>
        c.isEditing ? (
          <div
            key={c.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <input
              type="text"
              value={editNames[c.id] || ""}
              onChange={(e) =>
                setEditNames({ ...editNames, [c.id]: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") onEdit(c.id);
                if (e.key === "Escape") toggleEditing(c.id);
              }}
              autoFocus
              style={{
                flex: 1,
                marginRight: "1rem",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <MdCheck
                size={22}
                style={{ cursor: "pointer", color: "#27ae60" }}
                onClick={() => onEdit(c.id)}
                title="確認修改"
              />
              <MdClose
                size={22}
                style={{ cursor: "pointer", color: "#c0392b" }}
                onClick={() => toggleEditing(c.id)}
                title="取消修改"
              />
            </div>
          </div>
        ) : (
          <div
            key={c.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              textDecoration: !c.isActive ? "line-through" : "none",
              opacity: !c.isActive ? 0.6 : 1,
            }}
          >
            <p style={{ margin: 0, flex: 1 }}>ID {c.id}：{c.name}</p>
            <div>
              <MdEdit
                onClick={() => toggleEditing(c.id)}
                style={{ cursor: "pointer", marginRight: "0.5rem", color: "#2980b9" }}
              />
              <MdDelete
                onClick={() => onDisable(c.id)}
                style={{ cursor: "pointer", color: "#c0392b" }}
              />
            </div>
          </div>
        )
      )}

      <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="新增候選人名稱"
          value={newCandidate}
          onChange={(e) => setNewCandidate(e.target.value)}
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <PrimaryButton onClick={onAdd} style={{ marginLeft: "1rem" }}>
          ➕ 新增候選人
        </PrimaryButton>
      </div>
    </div>
  );
}
