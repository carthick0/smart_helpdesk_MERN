import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

export default function ConfigSettings() {
  const { token } = useAuth();
  const [autoCloseEnabled, setAutoCloseEnabled] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchConfig() {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:8000/api/config", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError("Failed to fetch config");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setAutoCloseEnabled(data.autoCloseEnabled);
      setConfidenceThreshold(data.confidenceThreshold);
      setLoading(false);
    }
    fetchConfig();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("http://localhost:8000/api/config", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ autoCloseEnabled, confidenceThreshold }),
    });
    if (res.ok) setSuccess("Settings updated.");
    else setError("Failed to update settings.");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white border rounded">
      <h2 className="text-2xl font-semibold mb-4">Agent Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Auto-Close Enabled</label>
          <input
            type="checkbox"
            checked={autoCloseEnabled}
            onChange={e => setAutoCloseEnabled(e.target.checked)}
            className="ml-2"
          /> Enable
        </div>
        <div>
          <label className="block font-medium">Confidence Threshold</label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={confidenceThreshold}
            onChange={e => setConfidenceThreshold(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-800 text-white rounded">
          Save Settings
        </button>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </form>
    </div>
  );
}
