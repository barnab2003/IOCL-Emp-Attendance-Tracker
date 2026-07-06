import React, { useState } from 'react';
import axios from 'axios';
import './DataUpload.css';

const DataUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus({ message: '', type: '' });
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus({ message: 'Please select a file first.', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/data/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus({ message: response.data.message, type: 'success' });
      setFile(null); // Clear after success
    } catch (error) {
      setStatus({ 
        message: error.response?.data?.message || 'Failed to upload data.', 
        type: 'error' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        🏠 Home / <strong>Data Upload</strong>
      </div>
      <h2>Bulk Data Import</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
        Upload an Excel (.xlsx) file to batch insert or update employee records. Ensure your columns include EmpID, Name, Email, Department, CardNo, and Type.
      </p>

      <div className="upload-container">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
        <label className="upload-label">
          {file ? file.name : "Select Excel File"}
          <input 
            type="file" 
            className="file-input" 
            accept=".xlsx, .csv" 
            onChange={handleFileChange} 
          />
        </label>
        
        <div style={{ marginTop: '1rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            style={{ minWidth: '150px' }}
          >
            {isUploading ? 'Processing...' : 'Upload Data'}
          </button>
        </div>

        {status.message && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            borderRadius: '8px',
            backgroundColor: status.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: status.type === 'success' ? '#065f46' : '#991b1b'
          }}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUpload;