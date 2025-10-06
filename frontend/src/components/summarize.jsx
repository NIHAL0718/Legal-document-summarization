import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { processDocument } from '../api';
import { FaRobot, FaFileDownload, FaLanguage, FaFacebook, FaTelegram, FaGoogle, FaHome, FaInfoCircle } from 'react-icons/fa';
import '../styles/summarizepage.css';
import { saveAs } from 'file-saver';

function Summarize() {
  const navigate = useNavigate();
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingStep, setProcessingStep] = useState('');

  useEffect(() => {
  const fileInfo = JSON.parse(localStorage.getItem('uploadedFile'));
  if (!fileInfo) {
    setError('No file found. Please upload a file first.');
    return;
  }

  const savedFileName = localStorage.getItem('lastFileName');
  const savedSummary = localStorage.getItem('summary');
  const savedExtractedText = localStorage.getItem('extracted_text');

  if (savedFileName === fileInfo.name && savedSummary && savedExtractedText) {
    // ✅ Same file as before, load from storage
    setSummary(savedSummary);
    setExtractedText(savedExtractedText);
    return;
  }

  // ✅ New file uploaded, clear previous summary
  localStorage.removeItem('summary');
  localStorage.removeItem('extracted_text');
  localStorage.setItem('lastFileName', fileInfo.name);

  const handleDocumentProcessing = async () => {
    setLoading(true);
    setError('');
    setProcessingStep('Processing document...');

    try {
      setProcessingStep('Reading file...');
      const base64Response = await fetch(fileInfo.content);
      const blob = await base64Response.blob();
      const file = new File([blob], fileInfo.name, { type: fileInfo.type });

      setProcessingStep(fileInfo.isImage ? 'Performing OCR...' : 'Generating summary...');
      const result = await processDocument(file);

      setExtractedText(result.extractedText);
      setSummary(result.summary);

      // Save for future visits
      localStorage.setItem('summary', result.summary);
      localStorage.setItem('extracted_text', result.extractedText);

      setProcessingStep('');
    } catch (err) {
      console.error('Error processing document:', err);
      setError(err.message || 'Failed to process document. Please try again.');
      setProcessingStep('');
    } finally {
      setLoading(false);
    }
  };

  handleDocumentProcessing();
}, []);



  const handleDownload = () => {
    if (!summary) {
      alert('Summary is not available for download yet.');
      return;
    }
    const content = `Extracted Text:\n\n${extractedText}\n\n\nSummary:\n\n${summary}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'document-analysis.txt');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-between px-4 py-6">
      {/* Header */}
      <header className="w-full max-w-7xl bg-gray-800 rounded-xl py-4 px-6 flex justify-between items-center border border-gray-700">
        <h1 className="text-2xl font-bold tracking-wide text-amber-400">
          LEGALSUMMARIZER
        </h1>
        <nav className="flex space-x-4">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-gray-300 hover:text-amber-400 font-medium transition-all duration-300 hover:scale-105"
          >
            <FaHome /> HOME
          </button>
          <button className="flex items-center gap-2 text-gray-300 hover:text-amber-400 font-medium transition-all duration-300 hover:scale-105">
            <FaInfoCircle /> ABOUT
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row w-full max-w-7xl bg-gray-800 rounded-xl overflow-hidden mt-6 mb-8 border border-gray-700">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col gap-6 p-8">
          <div className="bg-gray-700 p-4 rounded-xl border border-gray-600">
            <h2 className="text-xl font-bold text-center text-amber-400">
              DOCUMENT ANALYSIS
            </h2>
          </div>

          {loading && (
  <div className="flex flex-col items-center justify-center mt-4 py-10 bg-gray-700 rounded-xl border border-gray-600 text-center px-6">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-gray-600 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
    </div>

    <p className="mt-4 text-gray-300 font-medium animate-pulse text-lg">
      {processingStep || "⏳ Generating summary... Please wait."}
    </p>

    <p className="mt-2 text-gray-400 text-sm max-w-md">
      This process may take a few minutes — the AI is deeply analyzing your document 
      to create a high-quality and accurate summary.
    </p>
  </div>
)}


          {error && (
            <div className="text-center py-6 px-4 bg-gray-700 rounded-xl border border-red-500 mt-4">
              <p className="text-red-400 font-medium">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 bg-amber-500 text-gray-900 px-5 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors duration-300 shadow hover:shadow-md"
              >
                Back to Home
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {extractedText && (
                <div className="bg-gray-700 p-5 rounded-xl border border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/30">
                  <h3 className="text-lg font-semibold mb-3 text-amber-400 flex items-center gap-2">
                    <span className="bg-gray-600 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Extracted Text
                  </h3>
                  <div className="text-gray-300 text-sm max-h-60 overflow-y-auto bg-gray-800 p-4 rounded-lg border border-gray-600">
                    {extractedText}
                  </div>
                </div>
              )}

              {summary && (
                <div className="bg-gray-700 p-5 rounded-xl border border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/30">
                  <h3 className="text-lg font-semibold mb-3 text-amber-400 flex items-center gap-2">
                    <span className="bg-gray-600 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Generated Summary
                  </h3>
                  <div className="text-gray-300 text-sm max-h-60 overflow-y-auto bg-gray-800 p-4 rounded-lg border border-gray-600">
                    {summary}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Panel: Actions */}
        <aside className="bg-gray-700 p-8 flex flex-col justify-center gap-6 w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-600">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-amber-400">Document Actions</h3>
            <div className="w-20 h-1 bg-gray-600 rounded-full mx-auto mt-2"></div>
          </div>
          
          <button
            className="bg-gray-800 text-amber-400 flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-medium hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-400/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            onClick={() => {
              if (!summary || !extractedText) {
                alert('Please wait for the document to be processed before using the chatbot.');
                return;
              }
              navigate('/chatbot', {
                state: { summary, extractedText }
              });
            }}
            disabled={!summary || !extractedText}
          >
            <FaRobot className="text-xl" /> Chat with Document
          </button>

          <button
            className="bg-gray-800 text-amber-400 flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-medium hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-400/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            onClick={() => {
              if (!summary || !extractedText) {
                alert('Please wait for the document to be processed before translating.');
                return;
              }
              navigate('/translate', {
                state: { summary, extractedText }
              });
            }}
            disabled={!summary || !extractedText}
          >
            <FaLanguage className="text-xl" /> Translate Content
          </button>

          <button
            className="bg-gray-800 text-amber-400 flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-medium hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-400/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            onClick={handleDownload}
            disabled={!summary}
          >
            <FaFileDownload className="text-xl" /> Download Results
          </button>
        </aside>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl bg-gray-800 rounded-xl shadow py-6 px-8 text-center border border-gray-700">
        <p className="font-bold text-xl text-amber-400 mb-2">
          LEGALSUMMARIZER
        </p>
        <p className="text-gray-400 text-sm">Be sure to take a look at our <a href="#" className="text-amber-400 hover:underline">Terms of Use</a> and <a href="#" className="text-amber-400 hover:underline">Privacy Policy</a></p>
        <div className="flex justify-center gap-5 mt-4 text-gray-400">
          <a href="#" className="hover:text-amber-400 transition-colors duration-300 hover:scale-110">
            <FaFacebook />
          </a>
          <a href="#" className="hover:text-amber-400 transition-colors duration-300 hover:scale-110">
            <FaTelegram />
          </a>
          <a href="#" className="hover:text-amber-400 transition-colors duration-300 hover:scale-110">
            <FaGoogle />
          </a>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          © {new Date().getFullYear()} LegalSummarizer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Summarize;
