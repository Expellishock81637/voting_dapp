// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IVotingMode.sol";
import "./CandidateManager.sol";

/// @title 公開投票模式邏輯
/// @notice 會即時記錄並顯示每位候選人的得票數，並記錄每位投票者的狀態
contract VotingPublic is IVotingMode {
    CandidateManager public candidateManager;

    mapping(uint => uint) public votesReceivedById;
    mapping(address => bool) public hasVoted;
    uint public totalVoters;

    constructor(address candidateManagerAddress) {
        candidateManager = CandidateManager(candidateManagerAddress);
    }

    function vote(uint candidateId, address sender) external override {
        require(candidateManager.isCandidateActive(candidateId), "Candidate not active");
        require(!hasVoted[sender], "Already voted");

        votesReceivedById[candidateId]++;
        hasVoted[sender] = true;
        totalVoters++;
    }

    function getTotalVoters() external view override returns (uint) {
        return totalVoters;
    }

    function getVotesBreakdown() external view override returns (
        uint[] memory ids,
        string[] memory names,
        uint[] memory votes
    ) {
        uint len = candidateManager.candidateCount();
        ids = new uint[](len);
        names = new string[](len);
        votes = new uint[](len);

        for (uint i = 0; i < len; i++) {
            ids[i] = i;
            names[i] = candidateManager.getCandidateName(i);
            votes[i] = votesReceivedById[i];
        }

        return (ids, names, votes);
    }

    function getVotePercentages() external view override returns (
        uint[] memory ids,
        string[] memory names,
        uint[] memory percentages
    ) {
        uint len = candidateManager.candidateCount();
        uint total = totalVoters;
        ids = new uint[](len);
        names = new string[](len);
        percentages = new uint[](len);

        for (uint i = 0; i < len; i++) {
            ids[i] = i;
            names[i] = candidateManager.getCandidateName(i);
            percentages[i] = (total == 0) ? 0 : (votesReceivedById[i] * 100) / total;
        }

        return (ids, names, percentages);
    }

    function winnerList() external view override returns (uint[] memory) {
        uint len = candidateManager.candidateCount();
        uint highest = 0;
        uint count = 0;

        for (uint i = 0; i < len; i++) {
            if (!candidateManager.isCandidateActive(i)) continue;
            uint votes = votesReceivedById[i];
            if (votes > highest) {
                highest = votes;
                count = 1;
            } else if (votes == highest) {
                count++;
            }
        }

        uint[] memory winners = new uint[](count);
        uint index = 0;

        for (uint i = 0; i < len; i++) {
            if (!candidateManager.isCandidateActive(i)) continue;
            if (votesReceivedById[i] == highest) {
                winners[index++] = i;
            }
        }

        return winners;
    }

    /// @notice 公開投票模式永遠視為已結束（因為即時計票）
    function hasVotingEnded() external pure override returns (bool) {
        return true;
    }
}
