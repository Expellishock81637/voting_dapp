import React from "react";

function formatUnixTime(unix) {
  const date = new Date(unix * 1000);
  return date.toLocaleString(); // 你也可以改成其他格式
}

export default function VotingInfoPanel({ totalVotes, isAnonymous, votingEnd, blockTime }) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ marginBottom: "1rem", color: "#333" }}>📊 投票資訊</h3>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "1rem",
          color: "#333",
        }}
      >
        <li style={{ marginBottom: "0.5rem" }}>🧮 總投票人數：<strong>{totalVotes}</strong></li>
        <li style={{ marginBottom: "0.5rem" }}>
          🛡️ 投票模式：<strong>{isAnonymous ? "匿名投票" : "公開投票"}</strong>
        </li>
        <li style={{ marginBottom: "0.5rem" }}>
          ⌛ 投票結束時間：<strong>{formatUnixTime(votingEnd)}</strong>
        </li>
        <li>
          🕒 區塊鏈目前時間：<strong>{formatUnixTime(blockTime)}</strong>
        </li>
      </ul>
    </div>
  );
}
