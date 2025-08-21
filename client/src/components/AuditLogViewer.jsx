import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

export default function AuditLogViewer({ ticketId }) {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAudit() {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/tickets/${ticketId}/audit`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setLogs([]);
      } else {
        const data = await res.json();
        setLogs(data);
      }
      setLoading(false);
    }
    fetchAudit();
  }, [token, ticketId]);

  if (loading) return <p>Loading audit log…</p>;
  if (!logs.length) return <p>No audit entries.</p>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-2">Audit Timeline</h3>
      <ul className="border rounded bg-gray-50">
        {logs.map(log => (
          <li key={log._id} className="p-3 border-b">
            <div>
              <span className="font-bold">{log.action}</span>
              <span className="ml-2 text-sm text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
            </div>
            <div className="text-gray-600 text-sm">
              Actor: {log.actor}, TraceID: {log.traceId}
            </div>
            {log.meta && (
              <pre className="bg-gray-100 p-2 rounded mt-1">{JSON.stringify(log.meta, null, 2)}</pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
