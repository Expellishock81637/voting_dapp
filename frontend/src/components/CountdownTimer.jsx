// frontend/src/components/CountdownTimer.jsx
import { useEffect, useState } from "react";

export default function CountdownTimer({ endTime, onEnd }) {
  const [remaining, setRemaining] = useState(endTime - Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = endTime - now;

      setRemaining(diff > 0 ? diff : 0);

      if (diff <= 0 && typeof onEnd === "function") {
        clearInterval(interval);
        onEnd(); // ✅ 呼叫投票結束回呼
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onEnd]);

  const formatTime = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  return (
    <div style={{ margin: "1rem 0", fontWeight: "bold", fontSize: "1.2rem" }}>
      ⏳ 投票倒數：{remaining > 0 ? formatTime(remaining) : "投票已結束"}
    </div>
  );
}
