import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/upload.css'; // Make sure this CSS file exists

function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Unsupported file type. Please upload a PDF, TXT, or image file.');
      return;
    }

    setFile(selectedFile);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const isImage = file.type.startsWith('image/');
    const fileData = {
      name: file.name,
      type: file.type,
      content: preview,
      isImage: isImage
    };

    localStorage.setItem('uploadedFile', JSON.stringify(fileData));
    navigate('/summarize');
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">Upload Legal Document</h1>

      <div className="upload-box">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.txt,.jpeg,.jpg,.png"
          className="file-input"
        />

        {error && <p className="error-message">{error}</p>}

        {preview && (
          <div className="preview-box">
            {file && file.type.startsWith('image/') ? (
              <img src={preview} alt="Preview" className="image-preview" />
            ) : (
              <p className="file-name">📄 {file.name}</p>
            )}
          </div>
        )}

        <button onClick={handleUpload} className="upload-button">
          Summarize Document
        </button>
      </div>
    </div>
  );
}

export default Upload;
