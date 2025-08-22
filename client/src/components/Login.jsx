import React, { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Login failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      login(data.token, data.user.role);
    } catch {
      setError("Network error");
      setLoading(false);
    }
    setLoading(false);
  };

  // Autofill test credentials
  const fillTestCredentials = (role) => {
    if (role === "user") {
      setEmail("user@test.com");
      setPassword("user123");
    } else if (role === "agent") {
      setEmail("agent@test.com");
      setPassword("agent123");
    } else if (role === "admin") {
      setEmail("admin@test.com");
      setPassword("admin123");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

      {/* Test credentials buttons */}
      <div className="flex justify-between mb-4">
        <button
          type="button"
          onClick={() => fillTestCredentials("user")}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          User Test
        </button>
        <button
          type="button"
          onClick={() => fillTestCredentials("agent")}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Agent Test
        </button>
        <button
          type="button"
          onClick={() => fillTestCredentials("admin")}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Admin Test
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email:</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password:</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
