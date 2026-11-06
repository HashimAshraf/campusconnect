import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function ProtectedRoute({ roles, children }) {
  const { user } = useApp();
  const { pathname } = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ returnTo: pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/events" replace />;
  return children;
}