// frontend/src/pages/VotingPage.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { handleContractError } from "../utils/handleContractError";
import CountdownTimer from "../components/CountdownTimer";
import CandidateCard from "../components/CandidateCard";
import ShareLink from "../components/ShareLink";


export default function VotingPage({ contractInfo, onViewResult }) {
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState("");
  const [endTime, setEndTime] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hasStarted, setHasStarted] = useState(true);

  useEffect(() => {
    const load = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = new ethers.Contract(contractInfo.address, contractInfo.abi, signer);
      setContract(c);

      const rawCandidates = await c.getCandidateList(); // [{name, isActive}, ...]
      const list = rawCandidates
        .map((item, index) => ({
          id: index,
          name: item.name,
          disabled: !item.isActive
        }));
      setCandidates(list);


      const end = await c.votingEnd();
      const isAnon = await c.isAnonymous();
      const start = await c.votingStart();
      const now = Math.floor(Date.now() / 1000);

      setEndTime(Number(end));
      setIsAnonymous(isAnon);
      setHasStarted(now >= Number(start));
    };

    load();
  }, [contractInfo]);

  const handleVote = async (id) => {
    try {
      setStatus("⏳ 發送交易中...");

      const now = Math.floor(Date.now() / 1000);
      const start = await contract.votingStart();
      const end = await contract.votingEnd();

      if (now < Number(start)) throw new Error("Voting has not started yet.");
      if (now > Number(end)) throw new Error("Voting has already ended.");

      const tx = await contract.vote(id);
      await tx.wait();

      setStatus("✅ 投票成功！即將跳轉至結果頁...");
      setTimeout(onViewResult, 1500); // ✅ 投票成功後跳轉
    } catch (err) {
      const msg = handleContractError(err);
      setStatus(msg);

      // 若錯誤內容提到已結束，仍跳轉到結果頁
      if (msg.includes("投票已結束")) {
        setTimeout(onViewResult, 2000);
      }
    }
  };

  const handleCountdownEnd = () => {
    setStatus("⏳ 投票時間已結束，正在前往結果頁...");
    setTimeout(onViewResult, 1500); // ✅ 倒數結束後自動跳轉
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🗳️ 投票頁面</h2>

      <section style={{ marginTop: "2rem" }}>
        {contractInfo?.address && (
          <ShareLink contractAddress={contractInfo.address} />
        )} 
      </section>
     
      <section style={{ marginTop: "2rem" }}>
        {endTime > 0 && (
          <CountdownTimer endTime={endTime} onEnd={handleCountdownEnd} />
        )}
      </section>

      <section style={{ marginTop: "1rem" }}>
        {candidates.map((c) => (
          <CandidateCard
            key={c.id}
            id={c.id}
            name={c.name}
            onVote={handleVote}
            disabled={c.disabled}/>
      ))}
      </section>


      <p>{status}</p>
    </div>
  );
}
