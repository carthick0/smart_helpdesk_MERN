import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
export default function TicketList() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      setError("");
      try {
  const res = await fetch("http://localhost:8000/api/tickets?status=waiting_human", {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error("Fetch error response:", text);
    throw new Error("Failed to fetch tickets");
  }

  const data = await res.json();
  setTickets(data);
} catch (err) {
  setError(err.message);
}

      setLoading(false);
    }
    fetchTickets();
  }, [token]);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Tickets Awaiting Your Review</h2>
      {tickets.length === 0 ? (
        <p>No tickets to review.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li
              key={ticket._id}
              className="border p-3 mb-2 cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/agent/tickets/${ticket._id}`)}
            >
              <strong>{ticket.title}</strong> — Status: {ticket.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
