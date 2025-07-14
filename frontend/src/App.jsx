import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import OwnerSetup from "./pages/OwnerSetup";
import VotingPage from "./pages/VotingPage";
import ResultPage from "./pages/ResultPage";
import OwnerPanel from "./pages/OwnerPanel";
import VotePage from "./pages/VotePage";
import VotingJson from "./contract/Voting.json";

// ⭐ 外部使用者進入結果頁（從網址取合約位址）
function ResultPageWrapper() {
  const addr = new URLSearchParams(window.location.search).get("addr");
  if (!addr) return <p>❌ 無效的合約地址</p>;
  const contractInfo = { address: addr, abi: VotingJson.abi };
  return <ResultPage contractInfo={contractInfo} />;
}

// 🎯 管理員完整流程
function OwnerFlow() {
  const [contractInfo, setContractInfo] = useState(null);
  const [view, setView] = useState("setup");

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
        <Route path="/" element={<OwnerFlow />} />
        <Route path="/vote" element={<VotePage />} />
        <Route path="/result" element={<ResultPageWrapper />} />
      </Routes>
    </Router>
  );
}
