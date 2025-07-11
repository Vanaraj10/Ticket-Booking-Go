import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [view, setView] = useState("events");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEventBookings, setSelectedEventBookings] = useState([]);  const [showBookingsForEventId, setShowBookingsForEventId] = useState(null);

  const handleDeleteEvent = (eventId) => async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const token = localStorage.getItem("token"); // Get fresh token
      const res = await fetch(
        `http://localhost:8080/api/admin/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("Delete Event Response:", data);
      if (res.ok) {
        setEvents(events.filter((e) => e.id !== eventId));
        alert("Event deleted successfully!");
      } else {
        if (data.error && data.error.includes("violates foreign key constraint")) {
          alert("Cannot delete event: there are bookings for this event.");
        } else {
          alert("Failed to delete event. Please try again.");
        }
      }
    } catch {
      alert("Failed to delete event. Please try again later.");
    }
  };  const handleShowBookings = async (eventId) => {
    setShowBookingsForEventId(eventId);
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Get fresh token
      const res = await fetch(
        `http://localhost:8080/api/admin/events/${eventId}/bookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      console.log("Bookings Response:", data.bookings);
      setSelectedEventBookings(data.bookings || []);
      setLoading(false);
    } catch {
      alert("Failed to load bookings. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "events") {
      setLoading(true);
      fetch("http://localhost:8080/events")
        .then((res) => res.json())
        .then((data) => {
          setEvents(data.events || []);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load events. Please try again later.");
          setLoading(false);
        });
    }
  }, [view]);

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
        }}
      >
        Admin Dashboard
      </h2>
      <nav
        style={{
          marginBottom: "2rem",
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            background: view === "events" ? "#4caf50" : "#1976d2",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: "1rem",
            minWidth: 120,
          }}
          onClick={() => setView("events")}
        >
          View Events
        </button>
        <button
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            background: view === "create" ? "#4caf50" : "#1976d2",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: "1rem",
            minWidth: 120,
          }}
          onClick={() => setView("create")}
        >
          Create Events
        </button>
        <button
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            background: view === "bookings" ? "#4caf50" : "#1976d2",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: "1rem",
            minWidth: 120,
          }}
          onClick={() => setView("bookings")}
        >
          View Bookings
        </button>
      </nav>
      {view === "events" && (
        <div>
          {loading ? (
            <div>Loading Events...</div>
          ) : error ? (
            <div style={{ color: "#ff5252" }}>{error}</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
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
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <strong style={{ fontSize: "1.3rem", color: "#4caf50" }}>
                    {event.name}
                  </strong>
                  <span style={{ color: "#bdbdbd" }}>{event.description}</span>
                  <span style={{ color: "#bdbdbd" }}>
                    Available Tickets: {event.available_tickets}
                  </span>
                  <span style={{ color: "#bdbdbd" }}>
                    Date: {new Date(event.event_date).toLocaleString()}
                  </span>                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    <button 
                      onClick={handleDeleteEvent(event.id)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "none",
                        background: "#ff5252",
                        color: "#fff",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontSize: "1rem",
                        flex: 1,
                        minWidth: 120,
                      }}
                    >
                      Delete Event
                    </button>
                    <button 
                      onClick={() => handleShowBookings(event.id)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "none",
                        background: "#1976d2",
                        color: "#fff",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontSize: "1rem",
                        flex: 1,
                        minWidth: 120,
                      }}
                    >
                      View Bookings
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}      {view === "create" && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setLoading(true);
            const token = localStorage.getItem("token"); // Get fresh token
            const formData = new FormData(e.target);
            const body = {
              name: formData.get("name"),
              description: formData.get("description"),
              total_tickets: Number(formData.get("total_tickets")),
              event_date: new Date(formData.get("event_date")).toISOString(),
            };
            try {
              const res = await fetch(
                "http://localhost:8080/api/admin/events",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(body),
                }
              );
              const data = await res.json();
              console.log("Create Event Response:", data);
              if (res.ok) {
                setView("events");
                setLoading(false);
                // Refresh events list
                window.location.reload();
              } else {
                setError(
                  data.error || "Failed to create event. Please try again."
                );
                setLoading(false);
              }
            } catch {
              setError("Failed to create event. Please try again later.");
              setLoading(false);
            }
          }}
          style={{
            background: "#23272f",
            padding: "1.5rem",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            maxWidth: 400,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          <h3 style={{ color: "#4caf50", textAlign: "center" }}>
            Create Event
          </h3>
          <input
            name="name"
            type="text"
            placeholder="Event Name"
            required
            style={{
              padding: 10,
              borderRadius: 5,
              border: "1px solid #555",
              background: "#181818",
              color: "#fff",
            }}
          />
          <textarea
            name="description"
            placeholder="Description"
            required
            style={{
              padding: 10,
              borderRadius: 5,
              border: "1px solid #555",
              background: "#181818",
              color: "#fff",
            }}
          />
          <input
            name="total_tickets"
            type="number"
            min={1}
            placeholder="Total Tickets"
            required
            style={{
              padding: 10,
              borderRadius: 5,
              border: "1px solid #555",
              background: "#181818",
              color: "#fff",
            }}
          />
          <input
            name="event_date"
            type="datetime-local"
            required
            style={{
              padding: 10,
              borderRadius: 5,
              border: "1px solid #555",
              background: "#181818",
              color: "#fff",
            }}
          />
          <button
            type="submit"
            style={{
              padding: 10,
              borderRadius: 8,
              background: "#4caf50",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Create Event
          </button>
          {error && (
            <div style={{ color: "#ff5252", marginTop: 8 }}>{error}</div>
          )}
        </form>
      )}      {showBookingsForEventId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowBookingsForEventId(null)}
        >
          <div
            style={{
              background: "#23272f",
              borderRadius: 12,
              padding: "2rem",
              maxWidth: 500,
              width: "90vw",
              maxHeight: "80vh",
              overflowY: "auto",
              color: "#fff",
              boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
              position: "relative",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ color: "#ffd600", textAlign: "center", marginBottom: "1rem" }}>
              Bookings for Event {selectedEventBookings[0]?.event_name}
            </h3>
            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>Loading bookings...</div>
            ) : selectedEventBookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#bdbdbd" }}>No bookings found.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, maxHeight: "400px", overflowY: "auto" }}>
                {selectedEventBookings.map((booking) => (
                  <li
                    key={booking.id}
                    style={{
                      background: "#181818",
                      border: "1px solid #555",
                      borderRadius: 8,
                      marginBottom: "1rem",
                      padding: "1rem",
                      color: "#fff",
                    }}
                  >
                    <strong>User Name:</strong> {booking.username} <br />
                    <strong>Tickets Booked:</strong> {booking.tickets_booked} <br />
                    <strong>Booked At:</strong> {new Date(booking.booked_at).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
            <button
              style={{
                marginTop: 20,
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                background: "#888",
                color: "#fff",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: "1rem",
                width: "100%",
              }}
              onClick={() => setShowBookingsForEventId(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
