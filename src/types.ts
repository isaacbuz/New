export type Provider = "auth0" | "okta" | "azure";

export interface ShibbolethConfig {
    entityId: string;
    assertionConsumerService: string;
    idpUrl: string;
    type: 'shibboleth';
  }


  // types.ts
export type AuthConfig = {
  provider: 'auth0' | 'okta' | 'azure' | 'shibboleth';
  auth0?: {
    domain: string;
    clientId: string;
    redirectUri: string;
    scopes: string[];
  };
  okta?: {
    clientId: string;
    domain: string;
  };
  azure?: {
    clientId: string;
    tenantId: string;
    redirectUri: string;
  };
  shibboleth?: {
    entityId: string;
    assertionConsumerService: string;
    idpUrl: string;
  };
};