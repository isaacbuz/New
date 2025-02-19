import OktaAuth from '@okta/okta-auth-js';
import { PublicClientApplication } from '@azure/msal-browser';
import authConfig from './auth_config.json';
import { Provider as ExternalProvider } from './types';

// Update the Provider type to include Shibboleth
type LocalProvider = 'auth0' | 'azure' | 'okta' | 'shibboleth';

type Auth0Config = {
  domain: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
};

type AzureConfig = {
  clientId: string;
  authority: string;
  redirectUri: string;
  scopes: string[];
};

type OktaConfig = OktaAuth;

type ShibbolethConfig = {
  entityId: string;
  assertionConsumerService: string;
  idpUrl: string;
  type: 'shibboleth';
};

const getAuthProvider = (
  provider: LocalProvider
): Auth0Config | AzureConfig | OktaConfig | ShibbolethConfig => {
  const { okta, auth0, azure, shibboleth } = authConfig;

  if (provider === 'auth0') {
    return {
      domain: auth0.domain,
      clientId: auth0.clientId,
      redirectUri: 'http://127.0.0.1:3000',
      scopes: ['openid', 'profile', 'email'],
    };
  }

  if (provider === 'okta') {
    return new OktaAuth({
      clientId: okta.clientId,
      issuer: `${okta.domain}/oauth2/default`,
      redirectUri: 'http://127.0.0.1:3000',
      scopes: ['openid', 'profile', 'email'],
      pkce: true,
    });
  }

  if (provider === 'azure') {
    return {
      clientId: azure.clientId,
      authority: `https://login.microsoftonline.com/${azure.tenantId}`,
      redirectUri: azure.redirectUri,
      scopes: ['openid', 'profile', 'email'],
    };
  }

  if (provider === 'shibboleth') {
    return {
      entityId: shibboleth.entityId,
      assertionConsumerService: shibboleth.assertionConsumerService,
      idpUrl: shibboleth.idpUrl,
      type: 'shibboleth',
    };
  }

  throw new Error(`Unknown provider: ${provider}`);
};

export default getAuthProvider;