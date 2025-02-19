import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SamlCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const samlResponse = urlParams.get('SAMLResponse');
      
      if (samlResponse) {
        // Store authentication state
        localStorage.setItem('isAuthenticated', 'true');
        // Store the SAML response or necessary user data
        localStorage.setItem('saml-session', samlResponse);
        
        // Redirect to the main application
        navigate('/', { replace: true });
      } else {
        console.error('No SAML response found');
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return <div>Processing authentication...</div>;
};

export default SamlCallback;