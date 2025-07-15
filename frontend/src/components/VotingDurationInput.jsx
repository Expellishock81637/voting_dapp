import React from "react";
import { MdAdd, MdRemove } from "react-icons/md";

export default function VotingDurationInput({ duration, onChange }) {
  const handleAdd = () => {
    onChange((duration || 1) + 1);
  };

  const handleSubtract = () => {
    onChange((duration || 1) - 1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      onChange("");
    } else {
      onChange(Number(value));
    }
  };

  return (
    <div style={{ margin: "2rem 0", color: "#333" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          padding: "0.75rem 1rem",
          width: "fit-content",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <MdRemove
          size={24}
          style={{
            cursor: "pointer",
            color: "#333",
            marginRight: "1rem",
          }}
          onClick={handleSubtract}
        />
        <input
          type="number"
          value={duration}
          onChange={handleInputChange}
          style={{
            width: "80px",
            padding: "0.5rem",
            textAlign: "center",
            borderRadius: "6px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            color: "#333",
            fontSize: "1rem",
            appearance: "textfield",
            MozAppearance: "textfield",
          }}
          className="no-spinner"
        />
        <MdAdd
          size={24}
          style={{
            cursor: "pointer",
            color: "#333",
            marginLeft: "1rem",
          }}
          onClick={handleAdd}
        />
      </div>

      <style>
        {`
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </div>
  );
}
