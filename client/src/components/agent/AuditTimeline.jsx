import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";

export default function AuditTimeline({ ticketId }) {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  const backendUrl =import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchAudit() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${backendUrl}/api/${ticketId}/audit`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch audit logs");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchAudit();
  }, [backendUrl, ticketId, token]);

  if (loading) return <p>Loading audit timeline...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Audit Timeline</h3>
      <ul className="border-l-2 border-gray-300 pl-4 space-y-3">
        {events.map((e) => (
          <li key={e._id} className="relative pb-3">
            <span className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-blue-600" />
            <p>
              <strong>{e.action.replace(/_/g, " ")}</strong> by{" "}
              {e.actor.charAt(0).toUpperCase() + e.actor.slice(1)} at{" "}
              {new Date(e.timestamp).toLocaleString()}
            </p>
            {e.meta && (
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(e.meta, null, 2)}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
