import React from 'react';
import '../styles/terms.css';
import { ScrollText, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="terms-container animate-fade-in">
      <div className="terms-header">
        <h1 className="terms-title">Terms of Service</h1>
      </div>

      <div className="terms-content">
        <div className="terms-section">
          <div className="flex items-center mb-4">
            <ScrollText className="mr-3" size={24} />
            <h2 className="section-title">Use of Service</h2>
          </div>
          <p className="section-text">
            LEGALSUMMERIZER provides an AI-powered legal document summarization service. By accessing
            or using our service, you agree to be bound by these Terms of Service.
          </p>
        </div>

        <div className="terms-section">
          <div className="flex items-center mb-4">
            <Shield className="mr-3" size={24} />
            <h2 className="section-title">Content Ownership</h2>
          </div>
          <p className="section-text">
            You retain all rights to the documents you submit to our service. We do not claim ownership
            over your content. However, you grant us a license to use your content for the purpose of
            providing our service.
          </p>
        </div>

        <div className="terms-highlight">
          <div className="flex items-center mb-3">
            <AlertCircle className="mr-3" size={24} />
            <h3 className="text-xl font-semibold">Important Notice</h3>
          </div>
          <p>
            LEGALSUMMERIZER is not a substitute for professional legal advice. Always consult with
            a qualified legal professional before making important legal decisions.
          </p>
        </div>

        <div className="terms-section">
          <div className="flex items-center mb-4">
            <CheckCircle className="mr-3" size={24} />
            <h2 className="section-title">User Responsibilities</h2>
          </div>
          <ul className="terms-list">
            <li>Use the service only for lawful purposes</li>
            <li>Maintain the confidentiality of your account</li>
            <li>Provide accurate information</li>
            <li>Not misuse or attempt to exploit the service</li>
          </ul>
        </div>

        <p className="last-updated">Last updated: May 1, 2025</p>
      </div>
    </div>
  );
};

export default TermsPage;
