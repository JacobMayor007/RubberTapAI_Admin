import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const sessionId = localStorage.getItem("sessionId");
  return sessionId ? <>{children}</> : <Navigate to="/login" replace />;
}
