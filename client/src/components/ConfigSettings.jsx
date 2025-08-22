import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";

export default function ConfigSettings() {
  const { token } = useAuth();
  const backendUrl =import.meta.env.VITE_BACKEND_URL 
  const [autoCloseEnabled, setAutoCloseEnabled] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.78);
  const [slaHours, setSlaHours] = useState(24);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Fetch current config on mount
  useEffect(() => {
    async function fetchConfig() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${backendUrl}/api/config`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch config");
        const data = await res.json();
        setAutoCloseEnabled(data.autoCloseEnabled);
        setConfidenceThreshold(data.confidenceThreshold);
        setSlaHours(data.slaHours);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchConfig();
  }, [backendUrl, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    try {
      const res = await fetch(`${backendUrl}/api/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          autoCloseEnabled,
          confidenceThreshold: Number(confidenceThreshold),
          slaHours: Number(slaHours),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update config");
      }
      setInfoMessage("Configuration updated successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading configuration...</p>;

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow bg-white mt-8">
      <h2 className="text-2xl font-semibold mb-4">Agent Configuration</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
          {error}
        </div>
      )}
      {infoMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded">
          {infoMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoCloseEnabled}
              onChange={(e) => setAutoCloseEnabled(e.target.checked)}
              className="form-checkbox h-5 w-5 text-green-600"
            />
            <span>Enable Auto Close</span>
          </label>
        </div>
        <div>
          <label className="block mb-1 font-medium">Confidence Threshold (0–1)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">SLA Hours</label>
          <input
            type="number"
            min="0"
            value={slaHours}
            onChange={(e) => setSlaHours(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
}
