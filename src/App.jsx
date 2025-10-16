import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import AccountSettings from "./pages/AccountSettings";
import Analytics from "./pages/Analytics"; // ⬅️ ADD THIS LINE
import ProtectedRoute from "./components/ProtectedRoute";
import { account } from "./lib/appwrite";
import { useEffect, useState } from "react";

export default function App() {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    (async () => {
      try {
        const session = await account.getSession({ sessionId: "current" });
        setUser(session); // user is logged in
      } catch (err) {
        setUser(false); // not logged in
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
