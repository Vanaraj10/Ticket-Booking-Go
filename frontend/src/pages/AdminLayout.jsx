import { Outlet, Navigate } from "react-router-dom";

export default function AdminLayout() {
  const isAdmin = localStorage.getItem("role") === "admin";
  if (!isAdmin) return <Navigate to="/login" replace />;
  return (
    <div>
      {/* Optionally add an AdminNavBar here */}
      <Outlet />
    </div>
  );
}
