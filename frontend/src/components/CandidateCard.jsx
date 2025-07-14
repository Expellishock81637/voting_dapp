// frontend/src/components/CandidateCard.jsx
export default function CandidateCard({ id, name, onVote, disabled }) {
  return (
    <div
      style={{
        marginBottom: "1.5rem",
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "10px",
        maxWidth: "300px",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <h3>{name}</h3>
      <button onClick={() => onVote(id)} disabled={disabled}>
        {`🗳️ 投票給 ${name}`}
      </button>
    </div>
  );
}
