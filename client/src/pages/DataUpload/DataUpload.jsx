import React, { useState } from 'react';
import axios from 'axios';
import './DataUpload.css';

const DataUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadType, setUploadType] = useState('employees'); // Default to employees
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setStatus({ message: 'Please select a file first.', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);

    // Determine correct endpoint based on dropdown
    const endpoint = uploadType === 'employees' 
      ? 'http://localhost:5000/api/data/upload'
      : 'http://localhost:5000/api/data/upload-attendance';

    try {
      const response = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus({ message: response.data.message, type: 'success' });
      setFile(null);
    } catch (error) {
      setStatus({ message: error.response?.data?.message || 'Upload failed.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>🏠 Home / <strong>Data Upload</strong></div>
      <h2>Bulk Data Import</h2>

      <div className="upload-container">
        <select 
          value={uploadType} 
          onChange={(e) => setUploadType(e.target.value)}
          style={{ marginBottom: '1.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '250px' }}
        >
          <option value="employees">Upload Employee Directory</option>
          <option value="attendance">Upload Attendance Logs</option>
        </select>
        
        <br />
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
        <label className="upload-label">
          {file ? file.name : "Select Excel File"}
          <input type="file" className="file-input" accept=".xlsx, .csv" onChange={(e) => { setFile(e.target.files[0]); setStatus({}); }} />
        </label>
        
        <div style={{ marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? 'Processing...' : 'Upload Data'}
          </button>
        </div>

        {status.message && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '8px', backgroundColor: status.type === 'success' ? '#d1fae5' : '#fee2e2', color: status.type === 'success' ? '#065f46' : '#991b1b' }}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUpload;