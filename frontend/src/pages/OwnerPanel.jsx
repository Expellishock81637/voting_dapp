// frontend/src/pages/OwnerPanel.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingDurationInput from "../components/VotingDurationInput";
import CandidateManagerPanel from "../components/CandidateManagerPanel";
import PrimaryButton from "../components/PrimaryButton";
import VoteStatusQuery from "../components/VoteStatusQuery";
import VotingInfoPanel from "../components/VotingInfoPanel";


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
      setCandidates(
        list.map((item, index) => ({
          id: index,
          name: item.name,
          isActive: item.isActive,
          isEditing: false,
        }))
      );
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
    setCandidates(
      list.map((item, index) => ({
        id: index,
        name: item.name,
        isActive: item.isActive,
        isEditing: false,
      }))
    );
  };

  const toggleEditing = (id) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, isEditing: !c.isEditing }
          : { ...c, isEditing: false }
      )
    );
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
        <CandidateManagerPanel
          candidates={candidates}
          newCandidate={newCandidate}
          editNames={editNames}
          setEditNames={setEditNames}
          setNewCandidate={setNewCandidate}
          onAdd={handleAddCandidate}
          onEdit={handleEditCandidate}
          onDisable={handleDisableCandidate}
          toggleEditing={toggleEditing}
        />
        <div style={{ marginTop: "1rem" }}>
          <PrimaryButton onClick={handleEndVoting}>⛔ 提前結束投票</PrimaryButton>
        </div>
      </section>


      {/* 延長投票時間區塊 */}
      <section style={{ marginTop: "2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>⏱️ 延長投票時間（分鐘）</h3>
        <VotingDurationInput duration={extendMinutes} onChange={setExtendMinutes} />
        <PrimaryButton onClick={handleExtendVoting}>➕ 延長 {extendMinutes} 分鐘</PrimaryButton>
      </section>

      {/* 查詢功能區塊 */}
      <section style={{ marginTop: "2rem" }}>
        <VoteStatusQuery
          queryAddress={queryAddress}
          setQueryAddress={setQueryAddress}
          queryResult={queryResult}
          onQuery={handleQuery}
        />
      </section>

      {/* 投票資訊區塊 */}
      <section style={{ marginTop: "2rem" }}>
        <VotingInfoPanel
          totalVotes={totalVotes}
          isAnonymous={isAnonymous}
          votingEnd={votingEnd}
          blockTime={blockTime}
        />
      </section>
    </div>
  );
}