import React from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { role } = useAuth(); // Make sure this returns the correct role like "user" or "admin"
  const navigate = useNavigate();
  console.log("Dashboard role:", role);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {role === "user" && (
          <>
            <button
              onClick={() => navigate("/tickets")}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create/View Tickets
            </button>
          </>
        )}

        {role === "agent" && (
          <>
            <button
              onClick={() => navigate("/agent/tickets")}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Agent Dashboard
            </button>
          </>
        )}

        {role === "admin" && (
          <>
            <button
              onClick={() => navigate("/admin/kb")}
              className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Manage KB Articles
            </button>
            <button
              onClick={() => navigate("/admin/config")}
              className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Manage Config Settings
            </button>
          </>
        )}
      </div>
    </div>
  );
}
