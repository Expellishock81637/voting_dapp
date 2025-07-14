// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title 候選人資料管理合約
/// @notice 提供新增、修改、停用候選人功能，使用 ID 作為穩定識別碼
contract CandidateManager {
    
    /// @dev 候選人資料結構
    struct Candidate {
        string name;   // 候選人名稱
        bool isActive; // 是否為有效候選人（被停用則不可投票）
    }

    // === 儲存區 ===
    Candidate[] public candidates;                         // 候選人清單（用 index 當 ID）
    mapping(string => uint) public nameToId;               // 快速查詢：由名字找到 ID（方便用名字投票）
    
    address public owner;                                  // 擁有者地址

    // === 修飾器 ===
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // === 建構子 ===
    constructor() {
        owner = msg.sender;
    }

    // === 候選人管理功能 ===

    /// @notice 新增候選人（只能在投票前）
    /// @param name 候選人名字（需唯一）
    function addCandidate(string memory name) public onlyOwner {
        // 防止重複名稱：若是 ID=0 的人叫這個名，也要另外驗證
        require(nameToId[name] == 0 && (candidates.length == 0 || keccak256(bytes(candidates[0].name)) != keccak256(bytes(name))), "Name exists");

        candidates.push(Candidate(name, true));
        nameToId[name] = candidates.length - 1;
    }

    /// @notice 修改候選人名稱（例如名字拼錯）
    /// @param id 候選人 ID
    /// @param newName 新名稱（也會更新 nameToId 映射）
    function editCandidate(uint id, string memory newName) public onlyOwner {
        require(id < candidates.length, "Invalid ID");

        string memory oldName = candidates[id].name;
        delete nameToId[oldName];                  // 清除舊名對應
        candidates[id].name = newName;
        nameToId[newName] = id;                    // 設定新名對應
    }

    /// @notice 停用候選人（軟刪除）
    /// @param id 候選人 ID
    function disableCandidate(uint id) public onlyOwner {
        require(id < candidates.length, "Invalid ID");
        candidates[id].isActive = false;
    }

    // === 查詢功能 ===

    /// @notice 取得候選人完整資訊
    function getCandidate(uint id) public view returns (Candidate memory) {
        require(id < candidates.length, "Invalid ID");
        return candidates[id];
    }

    /// @notice 回傳全部候選人陣列（前端可用來渲染清單）
    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    /// @notice 候選人總數
    function candidateCount() public view returns (uint) {
        return candidates.length;
    }

    /// @notice 檢查某個候選人是否仍有效（可投票）
    function isCandidateActive(uint id) public view returns (bool) {
        require(id < candidates.length, "Invalid ID");
        return candidates[id].isActive;
    }

    /// @notice 用 ID 取得候選人名字
    function getCandidateName(uint id) public view returns (string memory) {
        require(id < candidates.length, "Invalid ID");
        return candidates[id].name;
    }

    /// @notice 用名字找出候選人 ID
    /// @dev 若找不到，會拋錯
    function getCandidateIdByName(string memory name) public view returns (uint) {
        uint id = nameToId[name];
        require(id < candidates.length, "Name not found");
        require(keccak256(bytes(candidates[id].name)) == keccak256(bytes(name)), "Name mismatch");
        return id;
    }
}
