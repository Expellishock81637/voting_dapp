export default function WinnerCard({ winners }) {
  if (!Array.isArray(winners) || winners.length === 0) {
    return <p>目前沒有贏家資訊。</p>;
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>🏆 得票最高者</h3>
      <ul>
        {winners.map((name, index) => (
          <li key={index}>🥇 {name}</li>
        ))}
      </ul>
    </div>
  );
}
