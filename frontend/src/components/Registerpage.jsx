import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_CONFIG } from "../config";
import "../styles/Registerpage.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINT}/register`,
        {
          username,
          email,
          password,
        }
      );

      if (response.data.message) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError(
        error.response?.data?.error ||
          "Registration failed! Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="left-panel">
        <div className="branding">
          <h1>Legal Doc Summarizer</h1>
          <p>Simplify Legal Documents Instantly</p>
        </div>
        <div className="form-container">
          <h2>Registration</h2>
          {error && <p className="error-message">{error}</p>}

          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
            <span className="icon">👤</span>
          </div>

          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <span className="icon">📧</span>
          </div>

          <div className="input-wrapper">
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      disabled={isLoading}
    />
    <span className="icon">🔒</span>
  </div>

  <button onClick={handleRegister} disabled={isLoading}>
    {isLoading ? "Registering..." : "Register"}
  </button>
</div>

      </div>

      <div className="right-panel">
        <h2>Welcome Back!</h2>
        <p>Already have an account?</p>
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
