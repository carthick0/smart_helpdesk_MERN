import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";

import AuthPage from "./pages/Authpage";
import TicketForm from "./components/TicketForm";
import KBList from "./components/KBlist";
import KBArticleView from "./components/KBarticle"; 
import ConfigSettings from "./components/ConfigSettings";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import TicketList from "./components/agent/TicketList";
import TicketView from "./components/agent/TicketView";

function ProtectedRoute({ userRole, allowedRoles, children }) {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppContent() {
  const { token, role } = useAuth();

  if (!token) {
    return <AuthPage />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* KB Article view accessible to all authenticated roles */}
        <Route path="/kb/:id" element={<KBArticleView />} />

        {/* User routes */}
        {role === "user" && (
          <>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<TicketForm />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}

        {/* Agent routes */}
        {role === "agent" && (
          <>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agent/tickets" element={<TicketList />} />
            <Route path="/agent/tickets/:id" element={<TicketView />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}

        {/* Admin routes */}
        {role === "admin" && (
          <>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/kb" element={<KBList />} />
            <Route
              path="/admin/config"
              element={
                <ProtectedRoute userRole={role} allowedRoles={["admin"]}>
                  <ConfigSettings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
