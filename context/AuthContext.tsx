import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  uuid: string | null;
  role: string | null;
  setAuthInfo: (token: string, uuid: string, role: string) => void;
  clearAuthInfo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  let timeoutId: NodeJS.Timeout | null = null;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUuid = await AsyncStorage.getItem('uuid');

        if (storedToken) {
          const decodedToken: DecodedToken = jwtDecode<DecodedToken>(storedToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp > currentTime) {
            setToken(storedToken);
            setUuid(storedUuid);
            setRole(decodedToken.role);
            setIsAuthenticated(true);

            // Schedule the next check just before the token expires
            const timeout = (decodedToken.exp - currentTime - 60) * 1000; // 60 seconds before expiration
            timeoutId = setTimeout(checkAuthStatus, timeout);
          } else {
            clearAuthInfo();
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error retrieving auth info:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // Set loading to false once done
      }
    };

    checkAuthStatus();

    // Clear the timeout on component unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const setAuthInfo = (token: string, uuid: string, role: string) => {
    setToken(token);
    setUuid(uuid);
    setRole(role);
    setIsAuthenticated(true);
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('uuid', uuid);
    AsyncStorage.setItem('role', role);
  };

  const clearAuthInfo = () => {
    setToken(null);
    setUuid(null);
    setRole(null);
    setIsAuthenticated(false);
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('uuid');
    AsyncStorage.removeItem('role');

    console.log('Auth Info Cleared');
  };

  if (isLoading) {
    return null; // Return null while loading
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, uuid, role, setAuthInfo, clearAuthInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
