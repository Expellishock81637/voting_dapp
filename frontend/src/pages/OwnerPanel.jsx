// frontend/src/pages/OwnerPanel.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingDurationInput from "../components/VotingDurationInput";

export default function OwnerPanel({ contractInfo }) {
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState("");
  const [status, setStatus] = useState("");
  const [queryAddress, setQueryAddress] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [votingEnd, setVotingEnd] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [blockTime, setBlockTime] = useState(0);
  const [extendMinutes, setExtendMinutes] = useState(5);
  const [editNames, setEditNames] = useState({});

  useEffect(() => {
    const load = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const c = new ethers.Contract(contractInfo.address, contractInfo.abi, signer);
      setContract(c);

      // 基礎資訊
      const list = await c.getCandidateList();
      setCandidates(list.map((item, index) => ({ id: index, name: item.name, isActive: item.isActive })));
      setTotalVotes(Number(await c.totalVotes()));
      setVotingEnd(Number(await c.votingEnd()));
      setIsAnonymous(await c.isAnonymous());

      const block = await provider.getBlock("latest");
      setBlockTime(block.timestamp);
    };
    load();
  }, [contractInfo]);

  const refreshCandidates = async () => {
    const list = await contract.getCandidateList();
    setCandidates(list.map((item, index) => ({ id: index, name: item.name, isActive: item.isActive })));
  };

  const handleAddCandidate = async () => {
    try {
      const tx = await contract.addCandidate(newCandidate);
      await tx.wait();
      setStatus(`✅ 已新增候選人: ${newCandidate}`);
      setNewCandidate("");
      await refreshCandidates();
    } catch (err) {
      console.error(err);
      setStatus("❌ 新增失敗: " + err.message);
    }
  };

  const handleEditCandidate = async (id) => {
    try {
      const newName = editNames[id];
      const tx = await contract.editCandidate(id, newName);
      await tx.wait();
      setStatus(`✅ 已修改候選人 ${id} 名稱為 ${newName}`);
      await refreshCandidates();
    } catch (err) {
      console.error(err);
      setStatus("❌ 修改失敗: " + err.message);
    }
  };

  const handleDisableCandidate = async (id) => {
    try {
      const tx = await contract.disableCandidate(id);
      await tx.wait();
      setStatus(`✅ 已停用候選人 ID: ${id}`);
      await refreshCandidates();
    } catch (err) {
      console.error(err);
      setStatus("❌ 停用失敗: " + err.message);
    }
  };

  const handleEndVoting = async () => {
    try {
      const tx = await contract.endVotingEarly();
      await tx.wait();
      setStatus("✅ 已提前結束投票");
    } catch (err) {
      console.error(err);
      setStatus("❌ 結束投票失敗: " + err.message);
    }
  };

  const handleExtendVoting = async () => {
    try {
      const tx = await contract.extendVoting(BigInt(extendMinutes));
      await tx.wait();
      const newEnd = Number(await contract.votingEnd());
      setVotingEnd(newEnd);
      setStatus(`✅ 已延長 ${extendMinutes} 分鐘`);
    } catch (err) {
      console.error(err);
      setStatus("❌ 延長失敗: " + err.message);
    }
  };

  const handleQuery = async () => {
    try {
      const voted = await contract.didVote(queryAddress);
      setQueryResult(voted);
    } catch (err) {
      console.error(err);
      setQueryResult(null);
      setStatus("❌ 查詢失敗: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛠️ Owner 管理後台</h2>
      <p>{status}</p>

      {/* 候選人管理區塊 */}
      <section>
        <h3>📋 候選人列表</h3>
        <ul>
          {candidates.map((c) => (
            <li key={c.id}>
              ID {c.id}: {c.name} {c.isActive ? "✅" : "❌ 停用"}
              <input
                type="text"
                placeholder="新名稱"
                value={editNames[c.id] || ""}
                onChange={(e) => setEditNames({ ...editNames, [c.id]: e.target.value })}
                style={{ marginLeft: "1rem" }}
              />
              <button onClick={() => handleEditCandidate(c.id)} style={{ marginLeft: "0.5rem" }}>✏️ 修改</button>
              <button onClick={() => handleDisableCandidate(c.id)} style={{ marginLeft: "0.5rem" }}>🗑️ 停用</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="新增候選人名稱"
          value={newCandidate}
          onChange={(e) => setNewCandidate(e.target.value)}
        />
        <button onClick={handleAddCandidate} style={{ marginLeft: "0.5rem" }}>➕ 新增候選人</button>
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleEndVoting}>⏹️ 提前結束投票</button>
        </div>
      </section>

      {/* 延長投票時間區塊 */}
      <section style={{ marginTop: "2rem" }}>
        <h3>⏱️ 延長投票時間</h3>
        <VotingDurationInput duration={extendMinutes} onChange={setExtendMinutes} />
        <button onClick={handleExtendVoting}>➕ 延長 {extendMinutes} 分鐘</button>
      </section>

      {/* 查詢功能區塊 */}
      <section style={{ marginTop: "2rem" }}>
        <h3>🔍 查詢投票狀態</h3>
        <input
          type="text"
          placeholder="輸入地址"
          value={queryAddress}
          onChange={(e) => setQueryAddress(e.target.value)}
          style={{ width: "320px" }}
        />
        <button onClick={handleQuery} style={{ marginLeft: "0.5rem" }}>查詢</button>
        {queryResult !== null && (
          <p>{queryResult ? "✅ 此地址已投票" : "❌ 此地址尚未投票"}</p>
        )}
      </section>

      {/* 投票資訊區塊 */}
      <section style={{ marginTop: "2rem" }}>
        <h3>📊 投票資訊</h3>
        <ul>
          <li>總投票人數：{totalVotes}</li>
          <li>是否匿名投票：{isAnonymous ? "✅ 是" : "❌ 否"}</li>
          <li>投票結束時間（Unix）：{votingEnd}</li>
          <li>目前區塊時間（Unix）：{blockTime}</li>
        </ul>
      </section>
    </div>
  );
}