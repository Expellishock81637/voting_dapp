import { ethers } from "ethers";
import contractData from "../contract/Voting.json";

export async function getVotingContract() {
  if (!window.ethereum) throw new Error("請先安裝 MetaMask");

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    contractData.address,
    contractData.abi,
    signer
  );

  const address = await signer.getAddress();

  return { contract, signer, address };
}
