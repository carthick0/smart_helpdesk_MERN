import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to login or home page after logout
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="font-bold text-lg">
          Smart Helpdesk
        </Link>

        {role === "user" && (
          <>
            <Link to="/tickets" className="hover:underline">
              My Tickets
            </Link>
            {/* Add more user links here */}
          </>
        )}

        {role === "agent" && (
          <>
            <Link to="/agent/dashboard" className="hover:underline">
              Agent Dashboard
            </Link>
            {/* Add more agent links here */}
          </>
        )}

        {role === "admin" && (
          <>
            <Link to="/admin/kb" className="hover:underline">
              KB Articles
            </Link>
            <Link to="/admin/config" className="hover:underline">
              Config Settings
            </Link>
            {/* Add more admin links here */}
          </>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
}
