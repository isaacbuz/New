import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useIsAuthenticated, useAccount, useMsal } from '@azure/msal-react';
import UnifiedLoginButton from './components/UnifiedLoginButton';
import './style.css';


type AppProps = {
  provider: 'okta' | 'auth0' | 'azure' | 'shibboleth';
  authProvider?: any;
};

const App: React.FC<AppProps> = ({ provider, authProvider }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [showVoterWidget, setShowVoterWidget] = useState(true); // State to control voter widget visibility

  const {
    isAuthenticated: auth0IsAuthenticated,
    user: auth0User,
    logout: auth0Logout,
  } = useAuth0();

  const isAzureAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();

  const redirect = () => {
    const partnerId = '123456';
    const campaignCode = '654321';
    let url = 'https://register.vote.org/';
    if (partnerId || campaignCode) {
      url += '?';
      if (partnerId) url += `partnerId=${partnerId}`;
      if (campaignCode) url += `&campaignCode=${campaignCode}`;
    }
    window.location.href = url;
  };

  const handleCloseVoterWidget = () => {
    setShowVoterWidget(false); // Close the voter widget
  };

  useEffect(() => {
    if (provider === 'shibboleth') {
      const checkShibbolethAuth = async () => {
        try {
          // Check URL parameters for authentication
          const urlParams = new URLSearchParams(window.location.search);
          const isAuthenticatedFromCallback = urlParams.get('authenticated') === 'true';
          const samlResponse = urlParams.get('samlResponse');
          
          if (isAuthenticatedFromCallback && samlResponse) {
            // Store authentication state
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('saml-session', samlResponse);
            
            setIsAuthenticated(true);
            setShowLoginPopup(false);
            setUserInfo({ 
              name: 'Authenticated User',
              email: 'user@example.com'
            });
            
            // Clean up URL
            window.history.replaceState({}, document.title, '/');
          }
        } catch (err) {
          console.error('Error during Shibboleth authentication:', err);
        } finally {
          setAuthChecked(true);
        }
      };
  
      checkShibbolethAuth();
    }
  }, [provider]);

  useEffect(() => {
    if (provider === 'okta' && authProvider) {
      const checkOktaAuthentication = async () => {
        try {
          if (window.location.search.includes('code=')) {
            await authProvider.handleRedirect();
          }

          const isOktaAuthenticated = await authProvider.isAuthenticated();
          setIsAuthenticated(isOktaAuthenticated);
          setShowLoginPopup(!isOktaAuthenticated);

          if (isOktaAuthenticated) {
            const user = await authProvider.getUser();
            setUserInfo(user);
          }
        } catch (err) {
          console.error('Error during Okta authentication:', err);
        } finally {
          setAuthChecked(true);
        }
      };

      checkOktaAuthentication();
    }
  }, [provider, authProvider]);

  useEffect(() => {
    if (provider === 'auth0') {
      setAuthChecked(false);
      if (auth0IsAuthenticated) {
        setIsAuthenticated(true);
        setUserInfo(auth0User);
        setShowLoginPopup(false);
      }
      setAuthChecked(true);
    }
  }, [provider, auth0IsAuthenticated, auth0User]);

  useEffect(() => {
    if (provider === 'azure') {
      setIsAuthenticated(isAzureAuthenticated);
      setUserInfo(accounts.length ? accounts[0] : null);
      setShowLoginPopup(!isAzureAuthenticated);
      setAuthChecked(true);
    }
  }, [provider, isAzureAuthenticated, accounts]);

  const handleLogout = async () => {
    try {
      if (provider === 'auth0') {
        auth0Logout({ logoutParams: { returnTo: window.location.origin } });
      } else if (provider === 'okta' && authProvider) {
        await authProvider.signOut();
      } else if (provider === 'azure' && authProvider) {
        const { instance } = authProvider;
        await instance.logoutRedirect();
      } else if (provider === 'shibboleth' && authProvider) {
        await authProvider.logout();
      }

      setIsAuthenticated(false);
      setUserInfo(null);
      setShowLoginPopup(true);
      setAuthChecked(true);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      {showLoginPopup && !isAuthenticated && (
        <div className="popup-container">
          <div className="popup-content">
            <h2>Login to Continue</h2>
            <UnifiedLoginButton provider={provider} authProvider={authProvider} />
          </div>
        </div>
      )}
      {!showLoginPopup && isAuthenticated && showVoterWidget && (
        <div className="voter-widget-popup">
          <div className="voter-widget-content">
            <button className="close-button" onClick={handleCloseVoterWidget}>
              &times;
            </button>
            <div className="voter-widget-header">You can register to vote.</div>
            <div className="voter-widget-image">
              <img src="/assets/y.svg" alt="Voter Registration" />
            </div>
            <div className="voter-widget-footer">It only takes two minutes.</div>
            <div className="voter-button-container">
              <button
                className="voter-button voter-button-primary"
                onClick={redirect}
                aria-label="Register to vote"
              >
                Register to Vote
              </button>
            </div>
          </div>
        </div>
      )}
      {isAuthenticated && userInfo && (
        <div className="user-info">
          <p>Welcome, {userInfo?.name || userInfo?.nickname || 'User'}!</p>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;