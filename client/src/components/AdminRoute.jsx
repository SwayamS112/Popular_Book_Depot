import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function AdminRoute() {
  const {
    isAuthenticated,
    isAdmin,
  } = useContext(AuthContext);

  const location = useLocation();

  // Not logged in → send to login and remember where they wanted to go
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // Logged in but not an admin → block access
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;