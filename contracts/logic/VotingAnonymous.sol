// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IVotingMode.sol";
import "./CandidateManager.sol";

/// @title 匿名投票模式（即時記票，但投票期間不揭露結果）
contract VotingAnonymous is IVotingMode {
    CandidateManager public candidateManager;

    mapping(uint => uint) public votesReceivedById;  // 候選人 ID → 得票數
    mapping(address => bool) public hasVoted;        // 投票者 → 是否已投票
    uint public totalVoters;                         // 投票總人數

    address public votingContract;

    modifier onlyVotingContract() {
        require(msg.sender == votingContract, "Only main contract can call.");
        _;
    }

    constructor(address candidateManagerAddress, address votingContractAddress) {
        candidateManager = CandidateManager(candidateManagerAddress);
        votingContract = votingContractAddress;
    }


    function vote(uint candidateId, address sender) external override onlyVotingContract {
        require(candidateManager.isCandidateActive(candidateId), "Invalid candidate.");
        require(!hasVoted[sender], "Already voted.");

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
        uint count = candidateManager.candidateCount();
        ids = new uint[](count);
        names = new string[](count);
        votes = new uint[](count);

        for (uint i = 0; i < count; i++) {
            ids[i] = i;
            names[i] = candidateManager.getCandidateName(i);
            votes[i] = _hasVotingEnded() ? votesReceivedById[i] : 0;
        }
    }

    function getVotePercentages() external view override returns (
        uint[] memory ids,
        string[] memory names,
        uint[] memory percentages
    ) {
        uint count = candidateManager.candidateCount();
        ids = new uint[](count);
        names = new string[](count);
        percentages = new uint[](count);

        if (!_hasVotingEnded() || totalVoters == 0) {
            return (ids, names, percentages);
        }

        for (uint i = 0; i < count; i++) {
            ids[i] = i;
            names[i] = candidateManager.getCandidateName(i);
            percentages[i] = (votesReceivedById[i] * 100) / totalVoters;
        }
    }

    function winnerList() external view override returns (uint[] memory) {
        if (!_hasVotingEnded()) {
            return new uint[](0);
        }

        uint count = candidateManager.candidateCount();
        uint highest = 0;
        for (uint i = 0; i < count; i++) {
            if (votesReceivedById[i] > highest) {
                highest = votesReceivedById[i];
            }
        }

        uint numWinners = 0;
        for (uint i = 0; i < count; i++) {
            if (votesReceivedById[i] == highest) {
                numWinners++;
            }
        }

        uint[] memory winners = new uint[](numWinners);
        uint index = 0;
        for (uint i = 0; i < count; i++) {
            if (votesReceivedById[i] == highest) {
                winners[index++] = i;
            }
        }

        return winners;
    }

    function hasVotingEnded() external view override returns (bool) {
        return _hasVotingEnded();
    }

    function _hasVotingEnded() internal view returns (bool) {
        (bool success, bytes memory result) = votingContract.staticcall(
            abi.encodeWithSignature("hasVotingEnded()")
        );
        require(success, "Voting status check failed.");
        return abi.decode(result, (bool));
    }
}
