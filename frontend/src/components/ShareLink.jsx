import { useState } from "react";
import QRCode from "react-qr-code";
import PrimaryButton from "../components/PrimaryButton";

export default function ShareLink({ contractAddress }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!contractAddress) return null;

  const voteUrl = `${window.location.origin}/vote?addr=${encodeURIComponent(contractAddress)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(voteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ 複製失敗", err);
    }
  };

  return (
    <div>
      <PrimaryButton onClick={() => setShow(true)}>🔗 分享連結</PrimaryButton>
      {show && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 9999,
            textAlign: "center",
            width: "300px",
          }}
        >
          {/* 右上角關閉按鈕 */}
          <button
            onClick={() => setShow(false)}
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              background: "transparent",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            ❌
          </button>

          <h3>📤 分享投票連結</h3>
          <QRCode value={voteUrl} size={160} style={{ margin: "1rem auto" }} />

          <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#888" }}>
            📱 手機投票功能尚未支援，請使用電腦投票。
          </p>          

          <p style={{ wordBreak: "break-all" }}>{voteUrl}</p>
          <PrimaryButton onClick={handleCopy}>📋 複製連結</PrimaryButton>
          {copied && <p style={{ color: "green", marginTop: "0.5rem" }}>✅ 已複製</p>}
        </div>
      )}
    </div>
  );
}
