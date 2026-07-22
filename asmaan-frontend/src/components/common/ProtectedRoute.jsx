import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, isStaff, isAgent, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const authorized = role === "staff" ? isStaff : role === "agent" ? isAgent || isStaff : true;

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
