/**
 * 統一處理所有來自 ethers.js、MetaMask 或合約的錯誤物件
 * 回傳適合給使用者看的訊息
 */

export function handleContractError(err) {
  // 🧹 清理錯誤輸出：過濾過長的 data（避免一大串 hex）
  const cleanErr = JSON.parse(JSON.stringify(err, (key, value) => {
    if (key === "data" && typeof value === "string" && value.length > 200) {
      return "[binary data omitted]";
    }
    return value;
  }));
  console.error("[❌ 合約錯誤偵測]", cleanErr);

  // 🧠 嘗試提取錯誤文字
  const raw =
    err?.error?.message ||
    err?.error?.data?.message ||
    err?.reason ||
    err?.message ||
    "";

  const lower = raw.toLowerCase();

  // ✅ 使用者取消交易 / 簽名（MetaMask 拒絕）
    if (
    err?.code === 4001 ||
    err?.error?.code === 4001 ||
    err?.info?.error?.code === 4001 || // ✅ 這是你的錯誤結構
    err?.shortMessage?.toLowerCase?.().includes("user rejected") ||
    err?.reason === "rejected" || // ethers 6 特有格式
    lower.includes("user rejected") ||
    lower.includes("user denied") ||
    lower.includes("tx signature") ||
    lower.includes("ethers-user-denied") ||
    lower.includes("request rejected")
    ) {
    return "⚠️ 你取消了交易（未送出）";
    }

  // ✅ 投票尚未開始
  if (lower.includes("voting has not started") || lower.includes("not started")) {
    return "⚠️ 投票尚未開始，請稍後再試";
  }

  // ✅ 投票已結束
  if (lower.includes("voting has already ended") || lower.includes("already ended")) {
    return "⚠️ 投票已結束，無法再投票";
  }

  // ✅ 結果尚未可讀（匿名模式）
  if (lower.includes("voting not ended")) {
    return "⚠️ 投票尚未結束，結果尚未開放查詢";
  }

  // ✅ 未安裝錢包
  if (lower.includes("please install metamask") || lower.includes("no ethereum provider")) {
    return "❌ 請先安裝或啟用 MetaMask 錢包";
  }

  // ✅ 網路 / RPC 問題
  if (lower.includes("network error") || lower.includes("rpc")) {
    return "⚠️ 網路異常或 RPC 連線問題，請稍後再試";
  }

  // ✅ 餘額不足 / 油費不足
  if (lower.includes("insufficient funds")) {
    return "⚠️ 錢包餘額不足，無法發送交易";
  }

  // ✅ 合約 revert，但訊息較乾淨
  if (lower.includes("execution reverted")) {
    const match = raw.match(/reverted(?: with reason string)?[:\s"]+(.+)/i);
    if (match && match[1]) {
      return "❌ 交易失敗：" + match[1].replace(/["']$/, "");
    }
    return "❌ 交易失敗，可能被合約拒絕";
  }

  // ✅ fallback：不要顯示過長或雜訊
  if (raw.startsWith("execution reverted") || raw.startsWith("0x")) {
    return "❌ 交易失敗，請確認操作或聯絡開發者";
  }

  // ✅ 最終 fallback
  return "❌ 發生未知錯誤，請稍後再試";
}
