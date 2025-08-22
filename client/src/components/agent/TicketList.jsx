import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function TicketList() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${backendUrl}/api/tickets?status=waiting_human`, {
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
  }, [backendUrl, token]);

  if (loading)
    return <p className="text-center text-gray-500 mt-8">Loading tickets...</p>;
  if (error)
    return (
      <p className="text-center text-red-600 font-semibold mt-8">{error}</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Tickets Awaiting Your Review
      </h2>
      {tickets.length === 0 ? (
        <p className="text-center text-gray-600 italic">No tickets to review.</p>
      ) : (
        <ul className="space-y-6">
          {tickets.map((ticket) => (
            <li
              key={ticket._id}
              onClick={() => navigate(`/agent/tickets/${ticket._id}`)}
              className="cursor-pointer border border-gray-300 rounded-lg p-5 transition-shadow shadow-sm hover:shadow-lg hover:bg-gray-50"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/agent/tickets/${ticket._id}`);
                }
              }}
              aria-label={`Open ticket titled ${ticket.title}`}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {ticket.title}
              </h3>
              <p className="text-gray-700">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`capitalize font-semibold ${
                    ticket.status === "waiting_human"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {ticket.status}
                </span>
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Category:</span> {ticket.category}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Created on: {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
