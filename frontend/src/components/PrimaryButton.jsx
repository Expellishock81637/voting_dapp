import React from "react";

export default function PrimaryButton({ children, onClick, style = {}, ...props }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#3498db",
        color: "#fff",
        border: "none",
        padding: "0.6rem 1.2rem",
        borderRadius: "8px",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        ...style,
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2980b9")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3498db")}
      {...props}
    >
      {children}
    </button>
  );
}
