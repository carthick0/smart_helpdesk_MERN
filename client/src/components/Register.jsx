import React, { useState } from "react";
import { useAuth } from "../context/useAuth"; // Import your auth hook

export default function Register({ onSuccess }) {
  const { login } = useAuth(); // Access login method from context

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto-login after successful registration
      const loginRes = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        throw new Error("Auto-login failed");
      }

      const data = await loginRes.json();

      login(data.token, data.user.role); // Set auth context

      onSuccess && onSuccess(); // Optional callback
    } catch (err) {
      setError(err.message || "An error occurred");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
        
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name:</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email:</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            type="email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password:</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Role:</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
