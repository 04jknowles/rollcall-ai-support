import React from "react";

const buttonStyle = {
  backgroundColor: "orange",
  border: "none",
  color: "white",
  padding: "15px 32px",
  textAlign: "center",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "16px",
  margin: "4px 2px",
  cursor: "pointer",
};

const SendTicketButton = ({ onClick }) => (
  <button onClick={onClick} style={buttonStyle}>
    Send Ticket
  </button>
);

export default SendTicketButton;
