// frontend/src/components/VoterStatusChecker.jsx
import { useState } from "react";

export default function VoterStatusChecker({ contract }) {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");

  const checkStatus = async () => {
    if (!address) return;
    try {
      const voted = await contract.didVote(address);
      setResult(voted);
      setStatus("");
    } catch (err) {
      setStatus("❌ 查詢失敗：" + (err.reason || err.message));
      setResult(null);
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3>🔍 查詢投票人狀態</h3>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="輸入帳戶地址"
        style={{ width: "300px" }}
      />
      <button onClick={checkStatus} style={{ marginLeft: "1rem" }}>
        查詢
      </button>
      {status && <p>{status}</p>}
      {result !== null && (
        <p>此地址是否已投票：{result ? "✅ 是" : "❌ 否"}</p>
      )}
    </div>
  );
}
