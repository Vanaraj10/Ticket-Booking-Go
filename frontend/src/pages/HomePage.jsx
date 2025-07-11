import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingEventId, setBookingEventId] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [bookingMessage, setBookingMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
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
        setBookingMsg(`successfully Boooked ${tickets} Tickets`);
        setEvents(events.map(event =>
          event.id === bookingEventId
          ? {...event,available_tickets:event.available_tickets - tickets}
          : event
        ))
        setTimeout(() => {
          setBookingEventId(null);
          setBookingMsg("");
          setTickets(1);
        }, 3000);
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
          wordBreak: "break-word",
        }}
      >
        Events
      </h2>
      {events.length === 0 && (
        <p
          style={{
            fontSize: "1.1rem",
            color: "#bdbdbd",
            textAlign: "center",
            width: "100%",
          }}
        >
          No Events Found
        </p>
      )}
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
        {events.map((event) => (
          <li
            key={event.id}
            style={{
              background: "#23272f",
              border: "1px solid #333",
              borderRadius: 12,
              marginBottom: "1.5rem",
              padding: "1.5rem 1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "box-shadow 0.2s, border 0.2s",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <strong
              style={{
                fontSize: "1.3rem",
                color: "#4caf50",
                letterSpacing: "0.5px",
                wordBreak: "break-word",
                width: "100%",
              }}
            >
              {event.name}
            </strong>
            <span
              style={{
                color: "#bdbdbd",
                fontSize: "1rem",
                wordBreak: "break-word",
                width: "100%",
              }}
            >
              {event.description}
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
              Available Tickets :{event.available_tickets}
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
              Date: {new Date(event.event_date).toLocaleString()}
            </span>
            <button
              style={{
                marginTop: 10,
                padding: "10px 18px",
                borderRadius: 8,
                border: "none",
                background: "#1976d2",
                color: "#fff",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.2s",
                fontSize: "1rem",
                width: "100%",
                maxWidth: "220px",
                alignSelf: "center",
              }}
              onClick={() => handleBookClick(event.id)}
            >
              Book Tickets
            </button>
            {bookingMessage && bookingEventId===event.id && (
                  <div
                    style={{
                      marginTop: 8,
                      color: bookingMessage.includes("✅")
                        ? "#4caf50"
                        : "#ff5252",
                      fontSize: "1rem",
                      fontWeight: 500,
                      letterSpacing: "0.2px",
                      textAlign: "center",
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      background: bookingMessage.includes("✅")
                        ? "rgba(76, 175, 80, 0.1)"
                        : "rgba(255, 82, 82, 0.1)",
                      border: `1px solid ${
                        bookingMessage.includes("✅") ? "#4caf50" : "#ff5252"
                      }`,
                    }}
                  >
                    {bookingMessage}
                  </div>
                )}
            {bookingEventId === event.id && (
              <form
                onSubmit={handleBooking}
                style={{
                  marginTop: 12,
                  background: "#23272f",
                  padding: "12px 8px",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  boxSizing: "border-box",
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
                    width: "100%",
                    maxWidth: 90,
                    padding: 8,
                    borderRadius: 5,
                    border: "1px solid #555",
                    background: "#181818",
                    color: "#fff",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    width: "100%",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
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
                      fontSize: "1rem",
                      width: "100%",
                      maxWidth: 120,
                      marginBottom: 8,
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
                      fontSize: "1rem",
                      width: "100%",
                      maxWidth: 120,
                      marginBottom: 8,
                    }}
                    onClick={() => setBookingEventId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
