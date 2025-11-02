import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, login as apiLogin, register as apiRegister } from '@/lib/api';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user and token from localStorage on mount
    const storedToken = localStorage.getItem('incordes_token');
    const storedUser = localStorage.getItem('incordes_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('incordes_token');
        localStorage.removeItem('incordes_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('incordes_token', response.token);
        localStorage.setItem('incordes_user', JSON.stringify(response.user));
        setToken(response.token);
        setCurrentUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const response = await apiRegister(email, password, username);
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('incordes_token', response.token);
        localStorage.setItem('incordes_user', JSON.stringify(response.user));
        setToken(response.token);
        setCurrentUser(response.user);
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error || response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'An error occurred during registration' };
    }
  };

  const logout = () => {
    localStorage.removeItem('incordes_token');
    localStorage.removeItem('incordes_user');
    setToken(null);
    setCurrentUser(null);
  };

  const updateUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('incordes_user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        login,
        register,
        logout,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
