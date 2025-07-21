import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      const token = localStorage.getItem('golf_auth_token');
      const userData = localStorage.getItem('golf_user_data');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setAuthState({
            isAuthenticated: true,
            user,
            isLoading: false,
          });
        } catch (error) {
          // Invalid stored data, clear it
          localStorage.removeItem('golf_auth_token');
          localStorage.removeItem('golf_user_data');
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const user: User = {
        id: '1',
        email,
        name: 'John Pro',
        avatar: '/avatars/01.png'
      };
      
      const token = 'mock_jwt_token_' + Date.now();
      
      // Store auth data
      localStorage.setItem('golf_auth_token', token);
      localStorage.setItem('golf_user_data', JSON.stringify(user));
      
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('golf_auth_token');
    localStorage.removeItem('golf_user_data');
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};