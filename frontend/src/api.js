import axios from 'axios';

const API_URL = 'http://localhost:5001/api'; // For Node/Express APIs
const FASTAPI_URL = 'http://localhost:8000'; // For FastAPI services

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Server error' };
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    // Store token in localStorage if login successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Server error' };
  }
};

// Process and Summarize Document
export const processDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Sending file to backend:', file.name, file.type);

    // Send directly to FastAPI backend for processing
    const response = await axios.post(`${FASTAPI_URL}/api/summarize/process`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    console.log('Backend response:', response.data);

    if (response.data.status === 'success') {
      return {
        extractedText: response.data.extracted_text || '',
        summary: response.data.summary || ''
      };
    } else {
      throw new Error(response.data.detail || 'Failed to process document');
    }
  } catch (error) {
    console.error('Error processing document:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.detail || error.response.data.error || 'Failed to process document');
    }
    if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      throw new Error('Server not responding. Please check if the backend server is running.');
    }
    throw new Error('Failed to connect to the server. Please try again later.');
  }
};

// Translate Extracted Text and Summary
export const translateDocument = async (summary, extractedText, targetLanguage) => {
  try {
    const response = await axios.post(`${FASTAPI_URL}/api/translate`, {
      summary,
      extracted_text: extractedText,
      target_language: targetLanguage
    });

    console.log('Translation response:', response.data);

    return {
      translatedSummary: response.data.translated_summary,
      translatedText: response.data.translated_text
    };
  } catch (error) {
    console.error('Error translating document:', error);
    if (error.response) {
      throw new Error(error.response.data.detail || error.response.data.error || 'Translation failed');
    }
    if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      throw new Error('Translation service not responding. Please try again later.');
    }
    throw new Error('Failed to connect to the translation service. Please check your connection.');
  }
};
