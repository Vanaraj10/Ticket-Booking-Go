import { useState } from "react";
import './SignupPage.css'
export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const HandleSubmit = async (e) => {
    console.log("Signing up with:", { username, password });
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/signup", {
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
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={HandleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
         className="input-field"
        />
        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
