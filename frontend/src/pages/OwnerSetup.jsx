// frontend/src/pages/OwnerSetup.jsx
import { useState } from "react";
import { ethers } from "ethers";
import { handleContractError } from "../utils/handleContractError";
import CandidateListEditor from "../components/CandidateListEditor";
import VotingDurationInput from "../components/VotingDurationInput";
import AnonymousToggle from "../components/AnonymousToggle";
import PrimaryButton from "../components/PrimaryButton";
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
      setStatus(handleContractError(err));
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 建立投票合約</h2>

      <AnonymousToggle
        isAnonymous={isAnonymous}
        onToggle={() => setIsAnonymous((prev) => !prev)}
      />

      <CandidateListEditor
        candidates={candidates}
        onChange={handleCandidateChange}
        onAdd={addCandidate}
        onRemove={removeCandidate}
      />
      <h3 style={{ marginBottom: "1rem" }}>⏱️ 設定投票時間（分鐘）</h3>
      <VotingDurationInput duration={duration} onChange={setDuration} />
      <PrimaryButton onClick={deployContract} style={{ marginTop: "1rem" }}>
        🚀 部署合約
      </PrimaryButton>
      <p>{status}</p>
    </div>
  );
}
