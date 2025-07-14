// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./logic/VotingAdmin.sol";
import "./logic/CandidateManager.sol";
import "./logic/VotingPublic.sol";
import "./logic/VotingAnonymous.sol";
import "./interfaces/IVotingMode.sol";

/// @title 主投票合約
/// @notice 管理整個投票流程、投票模式選擇、時間控制等邏輯
contract Voting is VotingAdmin {
    CandidateManager public candidateManager;   // 候選人資料合約
    IVotingMode public votingMode;              // 投票邏輯合約（匿名 or 公開）
    bool public isAnonymous;                    // 是否為匿名模式

    constructor(
        string[] memory candidateNames,
        uint _durationInMinutes,
        bool _isAnonymous
    ) {
        _initializeVoting(msg.sender, _durationInMinutes);
        isAnonymous = _isAnonymous;

        // 建立候選人合約並加入候選人
        CandidateManager cm = new CandidateManager();
        for (uint i = 0; i < candidateNames.length; i++) {
            cm.addCandidate(candidateNames[i]);
        }
        candidateManager = cm;

        // 建立投票邏輯合約
        if (_isAnonymous) {
            VotingAnonymous va = new VotingAnonymous(address(candidateManager), address(this));
            votingMode = IVotingMode(address(va));
        } else {
            votingMode = new VotingPublic(address(candidateManager));
        }
    }

    // === 投票邏輯 ===

    function vote(uint candidateId) public onlyDuringVoting {
        votingMode.vote(candidateId, msg.sender);
    }

    function voteByName(string memory name) public onlyDuringVoting {
        uint candidateId = candidateManager.getCandidateIdByName(name);
        vote(candidateId);
    }

    // === 查詢投票資訊 ===

    function isVotingActive() public view returns (bool) {
        return block.timestamp >= votingStart && block.timestamp <= votingEnd;
    }

    function hasVotingEnded() public view returns (bool) {
        return block.timestamp > votingEnd;
    }

    function totalVotes() public view returns (uint) {
        return votingMode.getTotalVoters();
    }

    function getVotesBreakdown() public view returns (uint[] memory, string[] memory, uint[] memory) {
        return votingMode.getVotesBreakdown();
    }

    function getVotePercentages() public view returns (uint[] memory, string[] memory, uint[] memory) {
        return votingMode.getVotePercentages();
    }

    function winnerList() public view returns (uint[] memory) {
        return votingMode.winnerList();
    }

    // === 前端輔助 ===

    function getCandidateList() public view returns (CandidateManager.Candidate[] memory) {
        return candidateManager.getAllCandidates();
    }

    function didVote(address user) public view returns (bool) {
        if (isAnonymous) {
            return VotingAnonymous(address(votingMode)).hasVoted(user);
        } else {
            return VotingPublic(address(votingMode)).hasVoted(user);
        }
    }

    // === Owner 功能：候選人管理 ===

    function addCandidate(string memory name) external onlyOwner {
        candidateManager.addCandidate(name);
    }

    function editCandidate(uint id, string memory newName) external onlyOwner {
        candidateManager.editCandidate(id, newName);
    }

    function disableCandidate(uint id) external onlyOwner {
        candidateManager.disableCandidate(id);
    }
}
