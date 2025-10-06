import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { User, Lock } from "lucide-react";
import { API_CONFIG } from "../config";
import "../styles/loginpage.css";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINT}/login`,
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        if (onLogin) onLogin();
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        navigate("/home");
      } else {
        setError("Login failed. No token received.");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Invalid username or password.");
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Use onKeyDown instead of deprecated onKeyPress
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container" role="main" aria-label="Login page">
      <div className="welcome-section">
        <div className="welcome-content">
          <h2>HELLO, WELCOME!</h2>
          <p>Don’t you have an account?</p>
          <Link to="/register">
            <button className="register-button" type="button">REGISTER</button>
          </Link>
        </div>
      </div>

      <div className="login-section">
        <div className="login-content">
          <h1>LOGIN</h1>

          {error && (
            <p className="error-message" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <div className="input-group">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                onKeyDown={handleKeyDown}
                className="login-input"
                autoComplete="username"
                aria-label="Username"
              />
              <User className="input-icon" size={20} aria-hidden="true" />
            </div>

            <div className="input-wrapper">
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                onKeyDown={handleKeyDown}
                className="login-input"
                autoComplete="current-password"
                aria-label="Password"
              />
              <Lock className="input-icon" size={20} aria-hidden="true" />
            </div>
          </div>

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={isLoading}
            aria-busy={isLoading}
            type="button"
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
