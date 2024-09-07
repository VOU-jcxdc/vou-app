import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
  firebaseUuid: string | null;
  role: string | null;
  setAuthInfo: (token: string, firebaseUuid: string) => void;
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
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [firebaseUuid, setUuid] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUuid = await AsyncStorage.getItem('firebaseUuid');

        if (storedToken) {
          const decodedToken: DecodedToken = jwtDecode<DecodedToken>(storedToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp > currentTime) {
            setUserId(decodedToken.userId);
            setToken(storedToken);
            setUuid(storedUuid);
            setRole(decodedToken.role);
            setIsAuthenticated(true);

            // Schedule the next check just before the token expires
            const timeout = (decodedToken.exp - currentTime) * 1000;
            setTimeoutId(setTimeout(checkAuthStatus, timeout));
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

  const setAuthInfo = (token: string, uuid: string) => {
    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
    setUserId(decodedToken.userId);
    setToken(token);
    setUuid(uuid);
    setRole(decodedToken.role);
    setIsAuthenticated(true);
    AsyncStorage.setItem('userId', decodedToken.userId);
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('firebaseUuid', uuid);
    AsyncStorage.setItem('role', decodedToken.role);
  };

  const clearAuthInfo = () => {
    setUserId(null);
    setToken(null);
    setUuid(null);
    setRole(null);
    setIsAuthenticated(false);
    AsyncStorage.removeItem('userId');
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('firebaseUuid');
    AsyncStorage.removeItem('role');
  };

  if (isLoading) {
    return null; // Return null while loading
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, token, firebaseUuid, role, setAuthInfo, clearAuthInfo }}>
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
