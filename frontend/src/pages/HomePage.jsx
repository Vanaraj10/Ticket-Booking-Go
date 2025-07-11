import { useEffect, useState } from "react";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingEventId, setBookingEventId] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [bookingMessage, setBookingMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleBookClick = (evenId) => {
    setBookingEventId(evenId);
    setBookingMsg("");
    setTickets(1);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingMsg("");
    const token = localStorage.getItem("token");
    if (!token) {
      setBookingMsg("Please login to book tickets.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/user/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: bookingEventId,
          tickets_booked: Number(tickets),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookingMsg("successfully Boooked Tickets");
        setBookingEventId(null);
      } else {
        setBookingMsg(
          data.error || "Failed to book tickets. Please try again."
        );
      }
    } catch (err) {
      console.error("Error booking tickets:", err);
      setBookingMsg("Failed to book tickets. Please try again later.");
    }
  };

  if (loading) return <div>Loading Events...</div>;
  if (error) return <div className="error">{error}</div>;

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
      }}
    >
      <h2
        style={{
          color: "#4caf50",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        Events
      </h2>
      {events.length === 0 && <p>No Events Found</p>}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          maxWidth: 700,
          margin: "2rem auto",
        }}
      >
        {events.map((event) => (
          <li
            key={event.id}
            style={{
              background: "#23272f",
              border: "1px solid #333",
              borderRadius: 12,
              marginBottom: "1.5rem",
              padding: "1.5rem 2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "box-shadow 0.2s, border 0.2s",
            }}
          >
            <strong
              style={{
                fontSize: "1.3rem",
                color: "#4caf50",
                letterSpacing: "0.5px",
              }}
            >
              {event.name}
            </strong>
            <br />
            {event.description}
            <br />
            <span
              style={{
                display: "block",
                marginTop: "0.5rem",
                color: "#bdbdbd",
                fontSize: "0.98rem",
              }}
            >
              Available Tickets :{event.available_tickets}
            </span>
            <span
              style={{
                display: "block",
                marginTop: "0.5rem",
                color: "#bdbdbd",
                fontSize: "0.98rem",
              }}
            >
              Date: {new Date(event.event_date).toLocaleString()}
            </span>
            <button
              style={{
                marginTop: 10,
                padding: "8px 18px",
                borderRadius: 8,
                border: "none",
                background: "#1976d2",
                color: "#fff",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onClick={() => handleBookClick(event.id)}
            >
              Book Tickets
            </button>
            {bookingEventId === event.id && (
              <form
                onSubmit={handleBooking}
                style={{
                  marginTop: 12,
                  background: "#23272f",
                  padding: "12px 16px",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <input
                  type="number"
                  min={1}
                  max={event.available_tickets}
                  value={tickets}
                  onChange={(e) => setTickets(e.target.value)}
                  required
                  style={{
                    width: 70,
                    padding: 6,
                    borderRadius: 5,
                    border: "1px solid #555",
                    background: "#181818",
                    color: "#fff",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 16px",
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "background 0.2s",
                  }}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  style={{
                    background: "#888",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 16px",
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "background 0.2s",
                  }}
                  onClick={() => setBookingEventId(null)}
                >
                  Cancel
                </button>
                {bookingMessage && (
                  <div
                    style={{
                      marginTop: 8,
                      color: "#ffd600",
                      fontSize: "1rem",
                      fontWeight: 500,
                      letterSpacing: "0.2px",
                    }}
                  >
                    {bookingMessage}
                  </div>
                )}
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
