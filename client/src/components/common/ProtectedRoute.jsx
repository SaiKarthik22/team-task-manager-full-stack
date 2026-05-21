import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "./Loader";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, booting, isAdmin } = useAuth();

  if (booting) return <Loader label="Checking session" />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};
