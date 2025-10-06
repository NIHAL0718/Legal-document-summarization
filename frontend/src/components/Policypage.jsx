import React from 'react';
import '../styles/policy.css';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PolicyPage = () => {
  return (
    <div className="policy-container animate-fade-in">
      <div className="policy-header">
        <h1 className="policy-title">Privacy Policy</h1>
      </div>

      <div className="policy-content">
        <div className="policy-section">
          <div className="flex items-center mb-4">
            <Shield className="mr-3" size={24} />
            <h2 className="section-title">Information Security</h2>
          </div>
          <p className="section-text">
            At LEGALSUMMERIZER, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, and protect your personal information when you use our service.
          </p>
        </div>

        <div className="policy-section">
          <div className="flex items-center mb-4">
            <FileText className="mr-3" size={24} />
            <h2 className="section-title">Information We Collect</h2>
          </div>
          <p className="section-text">
            We collect information you provide directly to us, including:
          </p>
          <ul className="policy-list">
            <li>Account information (name, email, etc.)</li>
            <li>Documents uploaded for summarization</li>
            <li>Usage data and preferences</li>
            <li>Communication with our support team</li>
          </ul>
        </div>

        <div className="policy-section">
          <div className="flex items-center mb-4">
            <Eye className="mr-3" size={24} />
            <h2 className="section-title">How We Use Your Information</h2>
          </div>
          <p className="section-text">
            We use the information we collect to:
          </p>
          <ul className="policy-list">
            <li>Provide and improve our services</li>
            <li>Develop new features</li>
            <li>Protect LEGALSUMMERIZER and our users</li>
            <li>Send important updates and notifications</li>
          </ul>
        </div>

        <div className="policy-section">
          <div className="flex items-center mb-4">
            <Lock className="mr-3" size={24} />
            <h2 className="section-title">Data Security</h2>
          </div>
          <p className="section-text">
            We implement appropriate security measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction.
          </p>
        </div>

        <p className="last-updated">Last updated: May 1, 2025</p>
      </div>
    </div>
  );
};

export default PolicyPage;
