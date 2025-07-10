import { useEffect, useState } from "react";
import "./HomePage.css"; // Assuming you have a CSS file for styling

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
    <div>
      <h2>Events</h2>
      {events.length === 0 && <p>No Events Found</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id} className="event-item">
            <strong>{event.name}</strong>
            <br />
            {event.description}
            <br />
            <span>Available Tickets :{event.available_tickets}</span>
            <span>Date: {new Date(event.event_date).toLocaleString()}</span>
            <button
              className="book-button"
              onClick={() => handleBookClick(event.id)}
            >
              Book Tickets
            </button>
            {bookingEventId === event.id && (
              <form onSubmit={handleBooking}>
                <input
                  type="number"
                  min={1}
                  max={event.available_tickets}
                  value={tickets}
                  onChange={(e) => setTickets(e.target.value)}
                  required
                />
                <button type="submit">Confirm</button>
                {bookingMessage && <div color="white">{bookingMessage}</div>}
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
