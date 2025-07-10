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
    <div>
      <h2>My Bookings</h2>
      {bookings.length === 0 && <div>No bookings found.</div>}
      <ul>
        {bookings.map((b) => (
          <li key={b.id} className="event-item">
            <strong>{b.event_name}</strong>
            <span>Tickets Booked: {b.tickets_booked}</span>
            <span>Booked At: {new Date(b.booked_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
