import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    console.log("Logging in with:", { username, password });
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        console.log("Login successful:", data);
        setMessage("Login successful!");
        setUsername("");
        setPassword("");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setMessage(data.error || "Something went wrong!");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.", error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
      <button type="submit" className="submit-btn">
        Login
      </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
