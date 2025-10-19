import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import AccountSettings from "./pages/AccountSettings";
import Analytics from "./pages/DataAnalyticsAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import { account } from "./lib/appwrite";
import { useEffect, useState } from "react";

export default function App() {
  const sessionId = localStorage.getItem("sessionId");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            sessionId ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={sessionId ? <Navigate to="/dashboard" replace /> : <Login />}
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
