import React, { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div>
      {showRegister ? (
        <Register onSuccess={() => setShowRegister(false)} />
      ) : (
        <Login />
      )}
      <div className="text-center mt-4">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setShowRegister((v) => !v)}
        >
          {showRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}
