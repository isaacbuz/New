import React, { useState } from 'react';
import './Dashboard.css'; // Import the CSS file

type Provider = 'auth0' | 'okta' | 'azure' | 'shibboleth';

const Dashboard: React.FC = () => {
  const [provider, setProvider] = useState<Provider>('shibboleth');

  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProvider(event.target.value as Provider);
  };

  const handleSave = () => {
    // Save the provider configuration to localStorage or a backend service
    localStorage.setItem('authProvider', provider);
    alert(`Provider configuration saved: ${provider}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Authentication Provider Dashboard</h1>
      <div className="dashboard-content">
        <div className="form-group">
          <label htmlFor="provider" className="form-label">
            Select Authentication Provider:
          </label>
          <select
            id="provider"
            value={provider}
            onChange={handleProviderChange}
            className="form-select"
          >
            <option value="auth0">Auth0</option>
            <option value="okta">Okta</option>
            <option value="azure">Azure</option>
            <option value="shibboleth">Shibboleth</option>
          </select>
        </div>
        <button className="save-button" onClick={handleSave}>
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default Dashboard;