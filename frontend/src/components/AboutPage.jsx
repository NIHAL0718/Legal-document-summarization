import React from 'react';
import { Brain, Scale, Clock } from 'lucide-react';
import '../styles/aboutpage.css';

const AboutPage = () => {
  return (
    <div className="about-container animate-fade-in">
      <div className="about-header">
        <h1 className="about-title">About LEGALSUMMERIZER</h1>
        <p className="about-subtitle">
          Transforming complex legal documents into clear, actionable insights
        </p>
      </div>

      <div className="about-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <Brain size={32} />
          </div>
          <h3 className="feature-title">AI-Powered Analysis</h3>
          <p className="feature-description">
            Advanced algorithms process and analyze complex legal documents with high accuracy
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Scale size={32} />
          </div>
          <h3 className="feature-title">Legal Expertise</h3>
          <p className="feature-description">
            Built with input from legal professionals to ensure accuracy and relevance
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Clock size={32} />
          </div>
          <h3 className="feature-title">Time Saving</h3>
          <p className="feature-description">
            Reduce hours of document review to minutes with our efficient summarization
          </p>
        </div>
      </div>

      <div className="mission-section">
        <h2 className="mission-title">Our Mission</h2>
        <p className="mission-text">
          We're dedicated to making legal documentation more accessible and understandable
          for everyone. Through innovative technology and expert knowledge, we're
          transforming how people interact with legal documents.
        </p>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-number">100K+</div>
          <div className="stat-label">Documents Processed</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">99.9%</div>
          <div className="stat-label">Accuracy Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50K+</div>
          <div className="stat-label">Happy Users</div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
