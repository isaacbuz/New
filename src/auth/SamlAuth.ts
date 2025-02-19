import { deflateRaw } from 'pako';
import authConfig from '../auth_config.json';

export class SamlAuth {
  private config: any;

  constructor() {
    this.config = authConfig.shibboleth;
  }

  async login() {
    try {
      // Generate SAML request
      const samlRequest = await this.buildSAMLRequest();
      
      // Create the redirect URL with parameters
      const params = new URLSearchParams({
        SAMLRequest: samlRequest,
        RelayState: window.location.origin
      });

      // Redirect to IdP using GET method
      window.location.href = `${this.config.idpUrl}?${params.toString()}`;
    } catch (error) {
      console.error('SAML login error:', error);
      throw error;
    }
  }

  private async buildSAMLRequest(): Promise<string> {
    const now = new Date();
    const id = '_' + Math.random().toString(36).substr(2, 9);
    
    const samlRequest = `<?xml version="1.0"?>
      <samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
                         xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                         ID="${id}"
                         Version="2.0"
                         IssueInstant="${now.toISOString()}"
                         Destination="${this.config.idpUrl}"
                         AssertionConsumerServiceURL="${this.config.assertionConsumerService}"
                         ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect">
        <saml:Issuer>${this.config.entityId}</saml:Issuer>
        <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
                           AllowCreate="true"/>
      </samlp:AuthnRequest>`;

    const deflated = deflateRaw(new TextEncoder().encode(samlRequest));
    return btoa(String.fromCharCode.apply(null, deflated as unknown as number[]));
  }

  logout() {
    localStorage.removeItem('saml-session');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/';
  }
}