// frontend/src/App.jsx
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import OwnerSetup from "./pages/OwnerSetup";
import VotingPage from "./pages/VotingPage";
import ResultPage from "./pages/ResultPage";
import OwnerPanel from "./pages/OwnerPanel"; // ✅ 新的整合管理頁面
import VotePage from "./pages/VotePage"; // ✅ 外部投票人用頁面

// 🎯 管理員完整流程頁面邏輯
function OwnerFlow() {
  const [contractInfo, setContractInfo] = useState(null);
  const [view, setView] = useState("setup"); // setup | vote | result | panel

  // ✅ 一開始進入會顯示部署頁
  if (!contractInfo || view === "setup") {
    return (
      <OwnerSetup
        onDeployed={(info) => {
          setContractInfo(info);
          setView("vote");
        }}
      />
    );
  }

  const renderView = () => {
    switch (view) {
      case "vote":
        return (
          <VotingPage
            contractInfo={contractInfo}
            onViewResult={() => setView("result")}
          />
        );
      case "result":
        return <ResultPage contractInfo={contractInfo} />;
      case "panel":
        return <OwnerPanel contractInfo={contractInfo} />;
      default:
        return <div>未知頁面</div>;
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <nav style={{ marginBottom: "1rem" }}>
        <button onClick={() => setView("vote")}>🗳️ 投票</button>
        <button onClick={() => setView("result")}>📊 結果</button>
        <button onClick={() => setView("panel")}>🛠️ 管理/查詢</button>
      </nav>
      {renderView()}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 管理員頁面（部署合約 → 控制整個流程） */}
        <Route path="/" element={<OwnerFlow />} />

        {/* 🌐 分享連結進來的投票頁 */}
        <Route path="/vote" element={<VotePage />} />
      </Routes>
    </Router>
  );
}
