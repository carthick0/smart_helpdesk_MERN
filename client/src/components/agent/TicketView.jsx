import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import AgentSuggestionEditor from "./AgentSuggestionEditor";
import AuditTimeline from "./AuditTimeline";

export default function TicketView() {
  const { id } = useParams();
  const { token } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    async function fetchTicketAndSuggestion() {
      setLoading(true);
      setError("");

      try {
        //  ticket detail
        const res = await fetch(`${backendUrl}/api/tickets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch ticket");
        const data = await res.json();
        setTicket(data);

        // agent suggestion
        const sugRes = await fetch(`${backendUrl}/api/agent/suggestion/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (sugRes.ok) {
          const sugData = await sugRes.json();
          setSuggestion(sugData);
        } else {
          setSuggestion(null);
        }
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    }

    fetchTicketAndSuggestion();
  }, [backendUrl, id, token]);

  if (loading) return <p>Loading ticket...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!ticket) return <p>Ticket not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{ticket.title}</h1>
      <p><strong>Category:</strong> {ticket.category}</p>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p>{ticket.description}</p>

      {suggestion ? (
        <AgentSuggestionEditor suggestion={suggestion} ticketId={id} />
      ) : (
        <p>No agent suggestion available.</p>
      )}

      <AuditTimeline ticketId={id} />
    </div>
  );
}
