// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title IVotingMode - 投票邏輯的共用介面
/// @notice 不論是公開投票還是匿名投票，都要實作以下功能
interface IVotingMode {
    
    /// @notice 投票功能（不記錄 msg.sender，由主合約處理）
    /// @param candidateId 被投票的候選人 ID
    /// @param sender 投票者地址（由主合約提供）
    function vote(uint candidateId, address sender) external;

    /// @notice 查詢目前已經有多少人投票
    /// @return 投票人數
    function getTotalVoters() external view returns (uint);

    /// @notice 回傳所有候選人目前的票數
    /// @dev 匿名模式下會在投票期間回傳空值（直到投票結束才開放）
    /// @return ids 候選人 ID 陣列
    /// @return names 候選人名字陣列
    /// @return votes 每位候選人的票數
    function getVotesBreakdown() external view returns (
        uint[] memory ids, 
        string[] memory names, 
        uint[] memory votes
    );

    /// @notice 回傳每位候選人佔總票數的百分比（整數百分比）
    /// @dev 匿名模式下可能在投票期間回傳 0 值
    /// @return ids 候選人 ID 陣列
    /// @return names 候選人名字陣列
    /// @return percentages 每位候選人的票數百分比（例如 25 表示 25%）
    function getVotePercentages() external view returns (
        uint[] memory ids, 
        string[] memory names, 
        uint[] memory percentages
    );

    /// @notice 回傳得票數最高者的 ID 陣列（可支援多人平手）
    /// @dev 僅在投票結束後才會有意義
    function winnerList() external view returns (uint[] memory);

    function hasVotingEnded() external view returns (bool);

}
