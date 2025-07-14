import { useState } from "react";
import QRCode from "react-qr-code";

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
      <button onClick={() => setShow(true)}>🔗 分享連結</button>
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
          <h3>📤 分享投票連結</h3>
          <QRCode value={voteUrl} size={160} style={{ margin: "1rem auto" }} />

          <img
            src="/metamask-icon.png"
            alt="MetaMask Logo"
            style={{ width: "40px", height: "40px", margin: "1rem auto" }}
          />

          <p style={{ wordBreak: "break-all" }}>{voteUrl}</p>
          <button onClick={handleCopy}>📋 複製連結</button>
          {copied && <p style={{ color: "green", marginTop: "0.5rem" }}>✅ 已複製</p>}
          <br />
          <button onClick={() => setShow(false)} style={{ marginTop: "0.5rem" }}>
            ❎ 關閉
          </button>
        </div>
      )}
    </div>
  );
}
