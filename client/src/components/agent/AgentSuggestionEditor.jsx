import React, { useState } from "react";
import { useAuth } from "../../context/useAuth";
export default function AgentSuggestionEditor({ suggestion, ticketId }) {
  const { token } = useAuth();
  const [draft, setDraft] = useState(suggestion.draftReply);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const backendUrl =import.meta.env.VITE_BACKEND_URL;

  const handleSend = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${backendUrl}/api/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply: draft }),
      });
      if (!res.ok) throw new Error("Failed to send reply");
      setMessage("Reply sent successfully.");
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="border p-4 rounded space-y-3 bg-gray-50">
      <h2 className="text-xl font-semibold">Agent Suggestion</h2>
      <p><strong>Confidence:</strong> {(suggestion.confidence * 100).toFixed(1)}%</p>
      <div>
        <strong>Cited KB articles:</strong>
        <ul className="list-disc list-inside">
          {suggestion.articleIds.map((id, i) => (
            <li key={id}>
              <a href={`/kb/${id}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                Article #{i + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="w-full h-40 p-2 border rounded"
        disabled={saving}
      />
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <div className="flex space-x-4">
        <button
          onClick={handleSend}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Send Reply
        </button>
        {/* Add save draft / reject buttons if needed */}
      </div>
    </div>
  );
}
