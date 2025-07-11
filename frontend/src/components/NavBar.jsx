import { useNavigate,Link } from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

     return (
    <nav style={{
      background: "#222", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between"
    }}>
      <div>
        <Link to="/" style={{ color: "#4caf50", fontWeight: 700, marginRight: 24, textDecoration: "none" }}>Home</Link>
       {token && <Link to="/my-bookings" style={{ color: "#4caf50", fontWeight: 700, marginRight: 24, textDecoration: "none" }}>My Bookings</Link>}
      </div>
      <div>
        {token ? (
          <button onClick={handleLogout} style={{
            background: "#ff5252", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer"
          }}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={{ color: "#fff", marginRight: 16, textDecoration: "none" }}>Login</Link>
            <Link to="/signup" style={{ color: "#fff", textDecoration: "none" }}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}