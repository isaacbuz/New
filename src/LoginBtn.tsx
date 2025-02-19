import React from 'react';
import { useSamlAuth } from './hooks/useSamlAuth';

export const LoginButton: React.FC = () => {
  const { isAuthenticated, isLoading, error, login, logout } = useSamlAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button 
        onClick={isAuthenticated ? logout : login}
        disabled={isLoading}
      >
        {isAuthenticated ? 'Logout' : 'Login with SAML'}
      </button>
    </div>
  );
};