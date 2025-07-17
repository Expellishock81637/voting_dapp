# Voting DApp

這是一個基於區塊鏈技術的投票 DApp，支援 **公開投票** 和 **匿名投票** 兩種模式。使用者可以建立投票、進行投票、查看結果，整個流程皆上鏈，確保透明與不可篡改。

## 專案功能特色

- 建立投票合約（可設定候選人、投票時間與投票模式）
- 支援公開投票模式（即時顯示票數）
- 支援匿名投票模式（隱藏票數直到結束）
- 智能合約部署於 Ethereum 測試鏈（Holesky）
- React 前端 + Ethers.js 錢包互動

---

## 線上體驗網址

已部署前端於 Vercel：

👉 **[[https://voting-dapp-eight-pink.vercel.app/](https://voting-dapp-eight-pink.vercel.app/)]**  
（⚠️ 請確保瀏覽器已安裝 MetaMask 並切換至 Holesky 測試網）

---

## 使用技術

- Solidity (智能合約)
- Hardhat (合約開發與部署)
- React.js (前端框架)
- Vite (React 開發工具)
- Ethers.js (區塊鏈互動)
- MetaMask (錢包)

---

## 快速使用教學（開發環境）
```bash
### 1. 安裝依賴

# 根目錄下安裝 Hardhat 相關套件
npm install

# 進入 frontend 安裝 React 前端依賴
cd frontend
npm install

### 2. 啟動本地測試鏈與前端

```bash
# 啟動本地 Hardhat 節點
npx hardhat node

# 部署合約（可用 scripts/deploy.js 或前端按鈕）
npx hardhat run scripts/deploy.js --network localhost

# ⚠️ 請手動將 Hardhat 編譯出的 Voting.json 複製至前端
# （通常位於 artifacts/contracts/Voting.sol/Voting.json）
cp artifacts/contracts/Voting.sol/Voting.json frontend/src/contract/Voting.json

# 啟動前端開發伺服器
cd frontend
npm run dev


