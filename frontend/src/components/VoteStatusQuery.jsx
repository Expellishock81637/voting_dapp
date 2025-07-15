import React from "react";
import { MdSearch } from "react-icons/md";

export default function VoteStatusQuery({
  queryAddress,
  setQueryAddress,
  queryResult,
  onQuery,
}) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ marginBottom: "1rem", color: "#333" }}>🔍 查詢投票狀態</h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          padding: "0.5rem 1rem",
          width: "fit-content",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="text"
          placeholder="輸入地址"
          value={queryAddress}
          onChange={(e) => setQueryAddress(e.target.value)}
          style={{
            width: "300px",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            marginRight: "0.5rem",
          }}
        />
        <MdSearch
          size={24}
          style={{ cursor: "pointer", color: "#3498db" }}
          onClick={onQuery}
          title="查詢"
        />
      </div>

      {queryResult !== null && (
        <p style={{ marginTop: "1rem", fontWeight: "500", color: queryResult ? "#2ecc71" : "#e74c3c" }}>
          {queryResult ? "✅ 此地址已投票" : "❌ 此地址尚未投票"}
        </p>
      )}
    </div>
  );
}
