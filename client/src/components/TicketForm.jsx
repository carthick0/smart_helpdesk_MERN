import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";

export default function TicketForm() {
  const { token, logout } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("billing");
  const [aiReply, setAiReply] = useState("");
  const [kbArticles, setKbArticles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [userTickets, setUserTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketsError, setTicketsError] = useState("");
  const [expandedTicketIds, setExpandedTicketIds] = useState(new Set());

  // Fetch user tickets on component mount
  useEffect(() => {
    async function fetchUserTickets() {
      setLoadingTickets(true);
      setTicketsError("");
      try {
        const res = await fetch("http://localhost:8000/api/tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();
        setUserTickets(data);
      } catch (err) {
        setTicketsError(err.message);
      }
      setLoadingTickets(false);
    }
    fetchUserTickets();
  }, [token]);

  const toggleExpand = (ticketId) => {
    setExpandedTicketIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ticketId)) {
        newSet.delete(ticketId);
      } else {
        newSet.add(ticketId);
      }
      return newSet;
    });
  };

  // Submit ticket handler with bug fix: uses updated ticket returned after triage
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAiReply("");
    setKbArticles([]);

    try {
      const res = await fetch("http://localhost:8000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, category }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Failed to create ticket");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // AI draft reply and KB articles from agent suggestion
      setAiReply(data.agentSuggestion?.draftReply || "");
      setKbArticles(data.agentSuggestion?.articleIds || []);

      // Use updated ticket returned after triage with correct status
      setUserTickets((prev) => [data.ticket, ...prev]);

      // Clear form inputs
      setTitle("");
      setDescription("");
      setCategory("billing");
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Ticket Creation Form */}
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Create Ticket
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Title:</label>
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description:</label>
          <textarea
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="billing">Billing</option>
            <option value="tech">Tech</option>
            <option value="shipping">Shipping</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>

      {/* Error message */}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {/* AI Draft Reply */}
      {aiReply && (
        <div className="mt-8 p-4 border border-gray-300 rounded bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">AI Draft Reply</h3>
          <pre className="whitespace-pre-wrap">{aiReply}</pre>
          {kbArticles.length > 0 && (
            <>
              <h4 className="mt-4 font-medium">Referenced KB Articles</h4>
              <ul className="list-disc list-inside">
                {kbArticles.map((id, i) => (
                  <li key={id}>
                    <a
                      href={`http://localhost:8080/api/kb/${id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Article #{i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* User's Ticket List */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Your Submitted Tickets</h2>
        {loadingTickets ? (
          <p>Loading tickets...</p>
        ) : ticketsError ? (
          <p className="text-red-600">{ticketsError}</p>
        ) : userTickets.length === 0 ? (
          <p>No tickets submitted yet.</p>
        ) : (
          <ul className="space-y-4">
            {userTickets.map((ticket) => (
              <li
                key={ticket._id}
                className="border border-gray-300 rounded p-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{ticket.title}</h3>
                  <button
                    onClick={() => toggleExpand(ticket._id)}
                    className="text-blue-600 hover:underline"
                  >
                    {expandedTicketIds.has(ticket._id)
                      ? "Hide Details"
                      : "Show Details"}
                  </button>
                </div>
                <p>
                  Status: <span className="font-semibold">{ticket.status}</span>
                </p>
                <p>Category: {ticket.category}</p>
                <p>
                  Created On: {new Date(ticket.createdAt).toLocaleDateString()}
                </p>

                {expandedTicketIds.has(ticket._id) && (
                  <div className="mt-3 bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold mb-2">Replies:</h4>
                    {ticket.replies && ticket.replies.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {ticket.replies.map((reply, i) => (
                          <li key={i}>
                            <p className="whitespace-pre-wrap">{reply.message}</p>
                            <p className="text-xs text-gray-600">
                              By:{" "}
                              {reply.author?.name || reply.author || "Unknown"} on{" "}
                              {new Date(reply.date).toLocaleString()}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No replies yet.</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
