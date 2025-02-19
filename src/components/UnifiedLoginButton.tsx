import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMsal } from '@azure/msal-react';
import { SamlAuth } from '../auth/SamlAuth';

interface UnifiedLoginButtonProps {
  provider: 'auth0' | 'azure' | 'okta' | 'shibboleth';
  authProvider?: any;
}

const UnifiedLoginButton: React.FC<UnifiedLoginButtonProps> = ({ provider, authProvider }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithRedirect: auth0Login } = useAuth0();
  const { instance: msalInstance } = useMsal();
  const samlAuth = new SamlAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      switch (provider) {
        case 'auth0':
          await auth0Login();
          break;
        case 'azure':
          await msalInstance.loginRedirect();
          break;
        case 'okta':
          if (authProvider) {
            await authProvider.signInWithRedirect();
          }
          break;
        case 'shibboleth':
          await samlAuth.login();
          break;
        default:
          console.error('Unknown provider:', provider);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
    >
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  );
};

export default UnifiedLoginButton;