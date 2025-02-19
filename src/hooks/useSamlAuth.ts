import { useState, useCallback } from 'react';
import { SamlAuth } from '../auth/SamlAuth';

export function useSamlAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const auth = new SamlAuth();

  const login = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await auth.login();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    auth.logout();
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, isLoading, error, login, logout };
}
