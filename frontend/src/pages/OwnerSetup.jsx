// frontend/src/pages/OwnerSetup.jsx
import { useState } from "react";
import { ethers } from "ethers";
import CandidateListEditor from "../components/CandidateListEditor";
import VotingDurationInput from "../components/VotingDurationInput";
import VotingJson from "../contract/Voting.json";

export default function OwnerSetup({ onDeployed }) {
  const [candidates, setCandidates] = useState(["Alice", "Bob"]);
  const [duration, setDuration] = useState(5);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [status, setStatus] = useState("");

  const handleCandidateChange = (index, value) => {
    const updated = [...candidates];
    updated[index] = value;
    setCandidates(updated);
  };

  const addCandidate = () => {
    setCandidates([...candidates, ""]);
  };

  const removeCandidate = (index) => {
    const updated = candidates.filter((_, i) => i !== index);
    setCandidates(updated);
  };

  const deployContract = async () => {
    try {
      setStatus("🚀 正在部署合約...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const deployArgs = [
        candidates,
        BigInt(duration),
        isAnonymous,
      ];

      const factory = new ethers.ContractFactory(
        VotingJson.abi,
        VotingJson.bytecode,
        signer
      );

      const contract = await factory.deploy(...deployArgs);
      await contract.waitForDeployment();

      const contractInfo = {
        address: await contract.getAddress(),
        abi: VotingJson.abi,
      };

      setStatus("✅ 合約部署完成！");
      onDeployed(contractInfo);
    } catch (err) {
      console.error(err);
      setStatus("❌ 部署失敗：" + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 建立投票合約</h2>

      <div>
        <label>是否匿名投票：</label>
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
        />
      </div>

      <CandidateListEditor
        candidates={candidates}
        onChange={handleCandidateChange}
        onAdd={addCandidate}
        onRemove={removeCandidate}
      />
      <VotingDurationInput duration={duration} onChange={setDuration} />
      <button onClick={deployContract} style={{ marginTop: "1rem" }}>
        🚀 部署合約
      </button>
      <p>{status}</p>
    </div>
  );
}
