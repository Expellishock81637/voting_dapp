import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CandidateCard from "../components/CandidateCard";
import CountdownTimer from "../components/CountdownTimer";
import { useNavigate } from "react-router-dom";

export default function VotePage() {
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState("🔍 檢查中...");
  const [voted, setVoted] = useState(false);
  const [endTime, setEndTime] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const setup = async () => {
      try {
        const rawAddr = new URLSearchParams(window.location.search).get("addr");
        if (!rawAddr) return setStatus("❌ 錯誤：缺少合約地址參數");

        const contractAddress = rawAddr.trim();
        if (!ethers.isAddress(contractAddress)) return setStatus("❌ 錯誤：合約地址格式不正確");

        if (!window.ethereum) return setStatus("❌ 請先安裝 MetaMask 錢包");

        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();

        // === ① 載入 Voting 主合約 ===
        const votingABI = (await (await fetch("/contract/Voting.json")).json()).abi;
        const voting = new ethers.Contract(contractAddress, votingABI, signer);
        setContract(voting); // 用於投票與結果頁跳轉

        // === ② 判斷是匿名或公開模式 ===
        const isAnonymous = await voting.isAnonymous();

        // === ③ 根據模式載入對應子合約 ABI ===
        const votingModeABI = (
          await (await fetch(
            isAnonymous
              ? "/contract/VotingAnonymous.json"
              : "/contract/VotingPublic.json"
          )).json()
        ).abi;

        // === ④ 抓子合約地址並初始化 ===
        const votingModeAddr = await voting.votingMode();
        const votingMode = new ethers.Contract(votingModeAddr, votingModeABI, signer);

        // === ⑤ 取得候選人清單 ===
        const list = await votingMode.getCandidateList();
        const active = list
          .map((item, index) => ({ id: index, name: item.name, disabled: !item.isActive }))
          .filter((item) => !item.disabled);
        setCandidates(active);

        // === ⑥ 取得結束時間與投票狀態 ===
        const end = await voting.votingEnd();
        setEndTime(Number(end));

        const userAddress = await signer.getAddress();
        const hasVoted = await votingMode.hasVoted(userAddress);
        setVoted(hasVoted);

        setStatus("✅ 錢包連接成功");
      } catch (err) {
        console.error(err);
        setStatus("❌ 初始化失敗：" + (err?.message || "未知錯誤"));
      }
    };

    setup();
  }, []);


  const handleVote = async (id) => {
    try {
      setStatus("⏳ 發送交易中...");
      const tx = await contract.vote(id);
      await tx.wait();
      setStatus("✅ 投票成功！即將跳轉...");
      setTimeout(() => navigate(`/result?addr=${contract.target}`), 1500);
    } catch (err) {
      console.error(err);
      setStatus("❌ 投票失敗：" + (err?.message || "未知錯誤"));
    }
  };

  const handleCountdownEnd = () => {
    setStatus("⏳ 投票時間已結束，自動前往結果頁...");
    setTimeout(() => navigate(`/result?addr=${contract.target}`), 1500);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🗳️ 投票頁面</h2>
      <p>{status}</p>

      {endTime > 0 && (
        <CountdownTimer endTime={endTime} onEnd={handleCountdownEnd} />
      )}

      {voted ? (
        <p>✅ 你已經投過票了</p>
      ) : (
        candidates.map((c) => (
          <CandidateCard
            key={c.id}
            id={c.id}
            name={c.name}
            disabled={c.disabled}
            onVote={handleVote}
          />
        ))
      )}
    </div>
  );
}
