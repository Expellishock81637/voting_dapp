import React from "react";

export default function AnonymousToggle({ isAnonymous, onToggle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "1rem 0" }}>
      <label style={{ marginRight: "1rem", fontWeight: "bold", color: "#333" }}>
        投票模式：
      </label>
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          cursor: "pointer",
          backgroundColor: "#f0f0f0",
          borderRadius: "20px",
          padding: "0.2rem",
          width: "160px",
          boxShadow: "inset 0 0 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "0.4rem 0",
            borderRadius: "20px",
            backgroundColor: !isAnonymous ? "#3498db" : "transparent",
            color: !isAnonymous ? "#fff" : "#333",
            transition: "all 0.2s ease",
          }}
        >
          公開
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "0.4rem 0",
            borderRadius: "20px",
            backgroundColor: isAnonymous ? "#3498db" : "transparent",
            color: isAnonymous ? "#fff" : "#333",
            transition: "all 0.2s ease",
          }}
        >
          匿名
        </div>
      </div>
    </div>
  );
}
