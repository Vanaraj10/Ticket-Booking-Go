import { Route, Routes, useLocation, Link } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import NavBar from "./components/NavBar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminQRScanner from "./pages/AdminQRScanner";
import AdminLayout from "./pages/AdminLayout";

export default function App() {
  const location = useLocation();
  const hideNavBar =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  // Add a simple persistent header for navigation (visible on all pages except login/signup/admin)
  // Optionally, you can move this to NavBar.jsx for more control
  return (
    <>
      {!hideNavBar && <NavBar />}
      {/* Quick navigation bar for admin pages */}
      {location.pathname.startsWith("/admin") && (
        <nav
          style={{
            background: "#222",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Link
              to="/admin"
              style={{
                color: "#4caf50",
                fontWeight: 700,
                marginRight: 24,
                textDecoration: "none",
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/qr-scanner"
              style={{
                color: "#4caf50",
                fontWeight: 700,
                marginRight: 24,
                textDecoration: "none",
              }}
            >
              QR Scanner
            </Link>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              window.location.href = "/login";
            }}
            style={{
              background: "#ff5252",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </nav>
      )}
      <Routes>
        {/* User routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        {/* Admin routes (protected and grouped) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="qr-scanner" element={<AdminQRScanner />} />
        </Route>
      </Routes>
    </>
  );
}
