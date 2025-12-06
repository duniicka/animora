import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../utils/api';

interface AuthResponse {
  success: boolean;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  [key: string]: any;
}

type RegisterData = {
  email: string;
  password: string;
  role?: string;
  firstName?: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch (err) {
        console.error("Session expired:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { user: u, token } = await loginUser(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
      return { success: true };
    } catch (e: any) {
      return {
        success: false,
        error:
          e?.response?.data?.message ||
          e?.message ||
          "Login failed",
      };
    }
  };

  const register = async (data: RegisterData) => {
  try {
    const { user: u, token } = await registerUser(data);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    return { success: true };
  } catch (e: any) {
    return {
      success: false,
      error: e?.response?.data?.message || e?.message || "Registration failed",
    };
  }
};


  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch (err) {
      console.error("Failed to refresh user:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const value: AuthContextType = { user, login, register, logout, refreshUser, loading };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

