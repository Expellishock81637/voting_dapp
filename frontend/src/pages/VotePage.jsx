import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function VotePage() {
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const [status, setStatus] = useState("🔍 檢查中...");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const setup = async () => {
      let rawAddr = new URLSearchParams(window.location.search).get("addr");
      if (!rawAddr) {
        setStatus("❌ 錯誤：缺少合約地址參數");
        return;
      }

      const contractAddress = rawAddr.trim();

      // 🧼 加上格式驗證
      if (!ethers.isAddress(contractAddress)) {
        setStatus("❌ 錯誤：合約地址格式不正確");
        return;
      }

      if (!window.ethereum) {
        setStatus("❌ 請先安裝 MetaMask 錢包");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();

        const abiRes = await fetch("/contract/Voting.json");
        const abiJson = await abiRes.json();

        const c = new ethers.Contract(contractAddress, abiJson.abi, signer);
        setContract(c);

        const candidateList = await c.getCandidateList();
        const formatted = candidateList
          .map((item, index) => ({ id: index, name: item.name, disabled: !item.isActive }))
          .filter((item) => !item.disabled);
        setCandidates(formatted);

        const hasVoted = await c.hasVoted(await signer.getAddress());
        setVoted(hasVoted);

        setStatus("✅ 錢包連接成功");
      } catch (err) {
        console.error(err);
        setStatus("❌ 錢包初始化失敗：" + (err?.message || "未知錯誤"));
      }
    };

    setup();
  }, []);

  const handleVote = async () => {
    try {
      const tx = await contract.vote(selectedId);
      await tx.wait();
      setVoted(true);
      setStatus("✅ 投票成功！");
    } catch (err) {
      console.error(err);
      setStatus("❌ 投票失敗：" + (err?.message || "未知錯誤"));
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🗳️ 投票頁面</h2>
      <p>{status}</p>

      {voted ? (
        <p>✅ 你已經投過票了</p>
      ) : (
        <>
          <div style={{ marginTop: "1rem" }}>
            {candidates.map((c) => (
              <div key={c.id}>
                <input
                  type="radio"
                  name="candidate"
                  value={c.id}
                  onChange={() => setSelectedId(c.id)}
                />
                {c.name}
              </div>
            ))}
          </div>
          <button
            onClick={handleVote}
            disabled={selectedId === null}
            style={{ marginTop: "1rem" }}
          >
            🗳️ 確認投票
          </button>
        </>
      )}
    </div>
  );
}
