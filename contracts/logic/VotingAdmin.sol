// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title VotingAdmin - 投票管理員功能模組（給 owner 用）
/// @notice 提供設定、控制投票時間、修改擁有者等功能
abstract contract VotingAdmin {
    
    // === 狀態變數 ===
    address public owner;         // 擁有者地址
    uint public votingStart;     // 投票開始時間（timestamp）
    uint public votingEnd;       // 投票結束時間（timestamp）

    // === 修飾器 ===

    /// @notice 限定只有 owner 可操作的 function
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    /// @notice 檢查投票已經開始
    modifier hasVotingStarted() {
        require(block.timestamp >= votingStart, "Voting has not started");
        _;
    }

    /// @notice 檢查投票尚未結束
    modifier hasVotingNotEnded() {
        require(block.timestamp <= votingEnd, "Voting already ended");
        _;
    }

    modifier onlyDuringVoting() {
        require(block.timestamp >= votingStart && block.timestamp <= votingEnd, "Voting not active");
        _;
    }

    modifier onlyAfterVoting() {
        require(block.timestamp > votingEnd, "Voting not ended");
        _;
    }


    // === 初始化（只能由主合約 constructor 呼叫） ===

    /// @notice 初始化擁有者與投票起止時間
    /// @param _owner 擁有者地址
    /// @param _durationInMinutes 投票持續時間（以分鐘計）
    function _initializeVoting(address _owner, uint _durationInMinutes) internal {
        owner = _owner;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    // === 擁有者控制操作 ===

    /// @notice 更換合約擁有者
    /// @param newOwner 新的擁有者地址
    function setOwner(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        owner = newOwner;
    }

    /// @notice 提前結束投票
    /// @dev 只能在投票期間執行
    function endVotingEarly() public onlyOwner hasVotingStarted hasVotingNotEnded {
        votingEnd = block.timestamp - 10000;
    }

    /// @notice 延長投票時間
    /// @param additionalMinutes 要增加的分鐘數
    function extendVoting(uint additionalMinutes) public onlyOwner hasVotingStarted hasVotingNotEnded {
        votingEnd += additionalMinutes * 1 minutes;
    }
}
