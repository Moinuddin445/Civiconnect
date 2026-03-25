import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (!userId || !role) {
    // Not logged in
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Logged in but wrong role, redirect to their dashboard
    if (role === "ROLE_ADMIN") return <Navigate to="/admin" replace />;
    if (role === "ROLE_OFFICER") return <Navigate to="/officer/dashboard" replace />;
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default RoleBasedRoute;
