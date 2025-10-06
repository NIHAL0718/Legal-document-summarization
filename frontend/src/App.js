import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/LoginPage";
import Register from "./components/Registerpage";
import Home from "./components/HomePage";
import AboutPage from './components/AboutPage';
import TermsPage from './components/TermsPage';
import PolicyPage from './components/Policypage';
import SummarizationPage from "./components/summarize";
import Chatbot from "./components/Chatbot";
import TranslatePage from "./components/translate";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // DEV ONLY: Always clear token on app start
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("summary");
    setIsAuthenticated(false);
    window.location.href = '/'; // Force redirect to login page
  };

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/summarize" element={isAuthenticated ? <SummarizationPage /> : <Navigate to="/" />} />
        <Route path="/translate" element={isAuthenticated ? <TranslatePage /> : <Navigate to="/" />} />
        <Route path="/chatbot" element={isAuthenticated ? <Chatbot /> : <Navigate to="/" />} />
        <Route path="*" element={<div className="text-center text-white mt-10 text-2xl">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
