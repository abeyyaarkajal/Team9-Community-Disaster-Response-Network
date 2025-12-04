import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("Please fill all fields correctly.");
      return;
    }

    setError("");
    alert("Login Successful! (Connect this to your backend API)");
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h2>CDRN Login</h2>

        {error && <div className="error-message">{error}</div>}

        <label>Select Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="citizen">Citizen</option>
          <option value="volunteer">Volunteer</option>
          <option value="authority">Authority</option>
          <option value="ngo">NGO</option>
        </select>

        <label>Email</label>
        <input
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <div className="links">
          <a href="/register">Create Account</a>
        </div>

      </div>
    </div>
  );
}
