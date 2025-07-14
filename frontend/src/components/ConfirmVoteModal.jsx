export default function ConfirmVoteModal({ candidate, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h2>請確認你的選擇</h2>
        <p>你即將投票給：<strong>{candidate}</strong></p>
        <div style={{ marginTop: "1rem" }}>
          <button onClick={onConfirm} style={{ marginRight: "1rem" }}>
            ✅ 確認送出
          </button>
          <button onClick={onCancel}>取消</button>
        </div>
      </div>
    </div>
  );
}
