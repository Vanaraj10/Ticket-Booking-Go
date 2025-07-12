import { useState } from "react";
export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const HandleSubmit = async (e) => {
    console.log("Signing up with:", { username, password });
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("https://ticket-booking-go.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Successfully signed up!");
        setUsername("");
        setPassword("");
      } else {
        setMessage(data.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: 20,
        background: "#23272f",
        borderRadius: 12,
        color: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        width: "95%",
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
        }}
      >
        Sign Up
      </h2>
      <form onSubmit={HandleSubmit} style={{ width: "100%" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 10,
            margin: "10px 0",
            borderRadius: 5,
            border: "1px solid #555",
            background: "#181818",
            color: "#fff",
            fontSize: "1rem",
            boxSizing: "border-box",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 10,
            margin: "10px 0",
            borderRadius: 5,
            border: "1px solid #555",
            background: "#181818",
            color: "#fff",
            fontSize: "1rem",
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 12,
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            marginTop: 10,
            cursor: "pointer",
            transition: "background 0.2s",
            fontSize: "1rem",
          }}
        >
          Sign Up
        </button>
      </form>
      {message && (
        <p
          style={{
            color: "#ff5252",
            marginTop: 16,
            textAlign: "center",
            fontSize: "1rem",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
