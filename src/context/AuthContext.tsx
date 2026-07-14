import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import UserService from '../services/userService';

export interface AuthUser {
  id: string;
  username: string;
  name?: string;
  role?: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = 'auth_user';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const value = localStorage.getItem(STORAGE_KEY);

    if (value) {
      setUser(JSON.parse(value));
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await UserService.login(data.username, data.password);

    // First-time setup
    if (response.adminCreated) {
      alert(response.message);
      return;
    }

    if (!response.user) {
      throw new Error('Login failed.');
    }

    const authUser: AuthUser = {
      id: response.user.id,
      username: response.user.username,
      name: response.user.name ?? '',
      role: response.user.role ?? '',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));

    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
