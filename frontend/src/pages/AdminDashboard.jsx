import { useEffect, useState } from "react";
import { Form } from "react-router-dom";

export default function AdminDashboard() {
  const [view, setView] = useState("events");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {view === "create" && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setLoading(true);
            const token = localStorage.getItem("token");
            const formData = new FormData(e.target);
            const body = {
              name: formData.get("name"),
              description: formData.get("description"),
              total_tickets: Number(formData.get("total_tickets")),
              event_date: new  Date(formData.get("event_date")).toISOString(),
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
              } else {
                setError(
                  data.error || "Failed to create event. Please try again."
                );
                setLoading(false);
              }
            } catch {
              setError("Failed to create event. Please try again later.");
            }
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
      )}
      {view === "bookings" && <div>Booking List</div>}
    </div>
  );
}
