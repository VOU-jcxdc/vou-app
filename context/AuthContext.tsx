import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUuid = await AsyncStorage.getItem('uuid');
        const storedRole = await AsyncStorage.getItem('role');
        console.log('Auth Info from AsyncStorage:', { storedToken, storedUuid, storedRole });

        if (storedToken && storedUuid && storedRole) {
          setToken(storedToken);
          setUuid(storedUuid);
          setRole(storedRole);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error retrieving auth info:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
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
  };

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
