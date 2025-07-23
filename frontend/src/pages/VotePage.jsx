import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { handleContractError } from "../utils/handleContractError";
import { useNavigate } from "react-router-dom";
import CandidateCard from "../components/CandidateCard";
import CountdownTimer from "../components/CountdownTimer";
import ShareLink from "../components/ShareLink";


export default function VotePage() {
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState("🔍 檢查中...");
  const [voted, setVoted] = useState(false);
  const [endTime, setEndTime] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const setup = async () => {
      try {
        let rawAddr = new URLSearchParams(window.location.search).get("addr");
        if (!rawAddr) return setStatus("❌ 錯誤：缺少合約地址參數");

        const contractAddress = rawAddr.trim();
        
        if (!ethers.isAddress(contractAddress)) return setStatus("❌ 錯誤：合約地址格式不正確");

        if (!window.ethereum) return setStatus("❌ 請先安裝 MetaMask 錢包");

        setContractAddress(contractAddress);

        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();

        const abiRes = await fetch("/contract/Voting.json");
        const abiJson = await abiRes.json();

        const c = new ethers.Contract(contractAddress, abiJson.abi, signer);
        setContract(c);

        const list = await c.getCandidateList();
        const active = list
          .map((item, index) => ({ id: index, name: item.name, disabled: !item.isActive }))
          .filter((item) => !item.disabled);
        setCandidates(active);

        const end = await c.votingEnd();
        setEndTime(Number(end));

        const hasVoted = await c.didVote(address);
        setVoted(hasVoted);

        setStatus("✅ 錢包連接成功");
      } catch (err) {
        setStatus(handleContractError(err));
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
      setStatus(handleContractError(err));
    }
  };

  const handleCountdownEnd = () => {
    setStatus("⏳ 投票時間已結束，自動前往結果頁...");
    setTimeout(() => navigate(`/result?addr=${contract.target}`), 1500);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🗳️ 投票頁面</h2>

      <ShareLink contractAddress={contractAddress} />

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
