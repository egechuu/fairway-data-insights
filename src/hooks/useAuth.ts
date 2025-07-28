import { useState, useEffect } from 'react';

export interface User {
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
    console.log('🧠 [useAuth.login] called with:', { email, password, rememberMe });
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useremail: email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('✅ Login response data:', data);

      const user: User = {
        id: data.user?.id ?? 'unknown',
        email: data.user?.email ?? email,
        name: data.user?.name ?? 'Unknown User',
        avatar: '/avatars/01.png',
      };

      localStorage.setItem('golf_auth_token', data.access_token);
      localStorage.setItem('golf_user_data', JSON.stringify(user));

      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
      });
      console.log('✅ User state set:', user);
      return { success: true };
    
    } catch (error: any) {
      console.error('❌ Login error:', error.message);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message };
    }
  };


  const logout = () => {
    localStorage.removeItem('golf_auth_token');
    localStorage.removeItem('golf_user_data');
    sessionStorage.setItem('isAuthenticated', 'false');
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