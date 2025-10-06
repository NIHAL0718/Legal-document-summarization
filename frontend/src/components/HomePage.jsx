// App.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/homepage.css';

function Home() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [profileImage, setProfileImage] = useState('/profile.png');
  const [isContentVisible, setIsContentVisible] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) setProfileImage(savedImage);
    
    // Animation trigger
    setTimeout(() => setIsContentVisible(true), 100);
  }, []);

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview('/document-icon.png');
    }

    setFile(selectedFile);
    setUploadError("");
  };

  const handleSummarizeClick = async () => {
    if (!file) {
      alert("Please upload a document first.");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          content: reader.result,
          isImage: file.type.startsWith('image/'),
        };
        localStorage.setItem('uploadedFile', JSON.stringify(fileData));
        navigate("/summarize");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadError("Failed to prepare file for summarization.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChatbotClick = () => {
    const fileData = JSON.parse(localStorage.getItem("uploadedFile"));
    if (!fileData) {
      alert("Please upload and summarize a document first.");
      return;
    }
    const summary = localStorage.getItem("summary") || '';
    const extractedText = localStorage.getItem("extractedText") || '';
    navigate("/chatbot", { state: { summary, extractedText } });
  };

  const handleProfileClick = () => {
    setShowLogout((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerProfileImageInput = () => {
    document.getElementById('profileImageInput').click();
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="logo animate-logo">LEGALSUMMERIZER</div>
        <nav className="nav">
          <Link to="/about" className="nav-link">ABOUT US</Link>
          <div className="profile" ref={profileRef}>
            <img
              src={profileImage}
              alt="User"
              className="profile-img"
              onClick={triggerProfileImageInput}
              style={{ cursor: "pointer" }}
              title="Click to change profile image"
            />

            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfileImageChange}
            />

            {showLogout && (
              <div className="logout-dropdown animate-dropdown">
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className={`main-content ${isContentVisible ? 'visible' : ''}`}>
        <div className="hero-text">
          <h1 className="main-title animate-title">Doc Summarize AI</h1>
          <h2 className="main-subtitle animate-subtitle">Summarize legal documents instantly with AI</h2>
          <p className="main-description animate-description">
            Save time and simplify legal review with our AI-powered summarization tool.
            Upload your legal documents and get concise, accurate summaries in seconds—
            making legal analysis faster and more efficient.
          </p>
        </div>

        <div className="feature-section">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Instant Summarization</h3>
            <p className="feature-description">Transform lengthy documents into concise summaries with AI precision</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Secure & Private</h3>
            <p className="feature-description">Your documents are processed securely with end-to-end encryption</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3 className="feature-title">AI Assistant</h3>
            <p className="feature-description">Chat with your documents to get answers to specific questions</p>
          </div>
        </div>

        <div className="upload-section">
          <div className="button-group">
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            <button
              className="upload-btn animate-button"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? "Processing..." : "Upload Document"}
            </button>
            <button
              className="summarize-btn animate-button"
              onClick={handleSummarizeClick}
              disabled={!file || isUploading}
            >
              Summarize
            </button>
          </div>

          {uploadError && <p className="error-message">{uploadError}</p>}

          {filePreview && (
            <div className="file-preview animate-preview">
              <img
                src={filePreview}
                alt="Document preview"
                className="preview-image"
              />
              <p className="file-name">{file?.name}</p>
            </div>
          )}
        </div>

        <section className="process-section">
          <h3 className="process-title">HOW IT WORKS</h3>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Upload Document</h4>
                <p>Select your legal document from your device</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>AI Processing</h4>
                <p>Our AI analyzes and extracts key information</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Get Summary</h4>
                <p>Receive a concise summary of your document</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/policy">Policy</Link>
          <Link to="/terms">Terms</Link>
        </div>
        <div className="footer-copy">LEGALSUMMERIZER</div>
        <div className="footer-icons">
          <Link to="/faq" className="footer-icon">
            <img src="/faq.jpg" alt="FAQ" title="FAQ" />
          </Link>
          <Link to="/contact" className="footer-icon">
            <img src="/contact.png" alt="Contact" title="Contact" />
          </Link>
          <Link to="/feedback" className="footer-icon">
            <img src="/feedback.jpg" alt="Feedback" title="Feedback" />
          </Link>
        </div>
      </footer>

      {/* Chatbot Floating Button */}
      <button
        className="chatbot-icon animate-chatbot"
        onClick={handleChatbotClick}
        aria-label="Open Chatbot"
      >
        <img
          src="/chatbot.jpg"
          alt="Chatbot"
          className="chatbot-icon-img"
        />
      </button>
    </div>
  );
}

export default Home;