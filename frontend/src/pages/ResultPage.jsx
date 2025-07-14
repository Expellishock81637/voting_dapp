import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ResultCard from "../components/ResultCard";
import TotalVoterCard from "../components/TotalVoterCard";
import CountdownTimer from "../components/CountdownTimer";
import ShareLink from "../components/ShareLink";
import WinnerCard from "../components/WinnerCard";
import PieChart from "../components/VotePieChart";

export default function ResultPage({ contractInfo }) {
  const [contract, setContract] = useState(null);
  const [results, setResults] = useState([]);
  const [totalVoters, setTotalVoters] = useState(0);
  const [status, setStatus] = useState("載入中...");
  const [endTime, setEndTime] = useState(0);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [winners, setWinners] = useState([]);
  const [candidateList, setCandidateList] = useState([]);

  // 每秒更新現在時間
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

const fetchResults = async (c) => {
  try {
    const total = await c.totalVotes();
    setTotalVoters(Number(total));

    console.log("[DEBUG] 呼叫 getVotePercentages...");
    const [ids, names, percentages] = await c.getVotePercentages();

    console.log("[DEBUG] 呼叫 getVotesBreakdown...");
    const [_, __, votes] = await c.getVotesBreakdown();

    const list = names.map((name, i) => ({
      id: i.toString(),
      name,
      voteCount: votes[i].toString(),
      percent: percentages[i].toString() + "%",
    }));

    setResults(list);

    const winnerIds = await c.winnerList();
    const fullList = await c.getCandidateList();
    const winnerNames = winnerIds.map((id) => fullList[id]?.name);
    setWinners(winnerNames);

    setStatus("✅ 結果載入成功");
  } catch (err) {
    console.error("[❌ 錯誤偵測] fetchResults 發生錯誤");

    if (err.reason === "Voting not ended") {
      console.warn("⚠️ 嘗試提早讀取票數，但投票尚未結束");
      setStatus("⚠️ 系統偵測到投票尚未結束，稍後將自動重新嘗試");
    } else {
      console.error(err);
      setStatus("❌ 結果載入失敗：" + err.message);
    }
  }
};


  useEffect(() => {
    let intervalId;

    const setup = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const c = new ethers.Contract(contractInfo.address, contractInfo.abi, signer);
        setContract(c);

        const isAnon = await c.isAnonymous();
        setIsAnonymous(isAnon);

        const end = await c.votingEnd();
        setEndTime(Number(end));

        const rawCandidates = await c.getCandidateList();
        setCandidateList(rawCandidates);

        if (isAnon) {
          // 匿名模式
          const ended = await c.hasVotingEnded();
          setHasEnded(ended);

          if (ended) {
            await fetchResults(c);
          } else {
            // 顯示假的結果
            const placeholder = rawCandidates.map((item, i) => ({
              id: i.toString(),
              name: item.name,
              voteCount: "0",
              percent: "0%",
            }));
            setResults(placeholder);
            setStatus("⏳ 匿名模式尚未結束，結果將於投票截止後公開");

            intervalId = setInterval(async () => {
              const endedNow = await c.hasVotingEnded();
              if (endedNow) {
                clearInterval(intervalId);
                setHasEnded(true);
                await fetchResults(c);
              }
            }, 5000);
          }
        } else {
          // 公開模式
          await fetchResults(c);
          const ended = await c.hasVotingEnded();
          setHasEnded(ended);

          intervalId = setInterval(async () => {
            await fetchResults(c);
            const endedNow = await c.hasVotingEnded();
            setHasEnded(endedNow);
          }, 5000);
        }
      } catch (err) {
        console.error(err);
        setStatus("❌ 初始化失敗：" + err.message);
      }
    };

    setup();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [contractInfo]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 投票結果</h2>

      {contractInfo?.address && (
        <ShareLink contractAddress={contractInfo.address} />
      )}

      <p>{status}</p>

      {endTime > 0 && now <= endTime && (
        <CountdownTimer endTime={endTime} />
      )}

      {hasEnded && <TotalVoterCard total={totalVoters} />}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {results.map((r) => (
          <ResultCard
            key={r.id}
            name={r.name}
            votes={r.voteCount}
            percent={r.percent}
          />
        ))}
      </div>

      {isAnonymous && !hasEnded && (
        <div style={{ marginTop: "1rem", color: "gray" }}>
          ⚠️ 本投票為匿名模式，投票期間不公開票數，結果將於投票結束後統一顯示。
        </div>
      )}

      {(!isAnonymous || hasEnded) && winners.length > 0 && <WinnerCard winners={winners} />}

      {(!isAnonymous || hasEnded) && results.length > 0 && (
        <PieChart
          data={results.map((r) => ({
            name: r.name,
            value: parseFloat(r.percent),
          }))}
        />
      )}
    </div>
  );
}
