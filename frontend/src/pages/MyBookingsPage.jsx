import { useEffect, useState } from "react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to view your bookings.");
      setLoading(false);
      return;
    }
    fetch("http://localhost:8080/api/user/bookings", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load bookings. Please try again later.");
        setLoading(false);
      });
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        padding: "2rem",
        background: "#23272f",
        borderRadius: 12,
        color: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        width: "95%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          color: "#4caf50",
          textAlign: "center",
          marginBottom: "1.5rem",
          fontSize: "2rem",
          letterSpacing: "1px",
          width: "100%",
        }}
      >
        My Bookings
      </h2>
      {loading ? (
        <div>Loading Bookings...</div>
      ) : error ? (
        <div
          style={{
            color: "#ff5252",
            marginTop: 16,
            textAlign: "center",
            fontSize: "1rem",
          }}
        >
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <p
          style={{
            fontSize: "1.1rem",
            color: "#bdbdbd",
            textAlign: "center",
            width: "100%",
          }}
        >
          No Bookings Found
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            maxWidth: 700,
            margin: "2rem auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {bookings.map((booking) => (
            <li
              key={booking.id}
              style={{
                background: "#23272f",
                border: "1px solid #333",
                borderRadius: 12,
                marginBottom: "1.5rem",
                padding: "1.5rem 2rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "box-shadow 0.2s, border 0.2s",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <strong
                style={{
                  fontSize: "1.3rem",
                  color: "#4caf50",
                  letterSpacing: "0.5px",
                  width: "100%",
                }}
              >
                {booking.event_name}
              </strong>
              <span
                style={{
                  display: "block",
                  marginTop: "0.5rem",
                  color: "#bdbdbd",
                  fontSize: "0.98rem",
                  width: "100%",
                }}
              >
                Tickets Booked: {booking.tickets_booked}
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: "0.5rem",
                  color: "#bdbdbd",
                  fontSize: "0.98rem",
                  width: "100%",
                }}
              >
                Date:{" "}
                {new Date(booking.booking_date).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
