import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginApi, registerApi, getMeApi } from "../apis/auth.api";
import { initializeAuthToken, persistAuthToken } from "../apis/axiosInstance";
import type { IUser } from "../types";

interface AuthContextType {
  user: IUser | null;
  role: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const applyUserState = (nextUser: IUser | null) => {
    setUser(nextUser);
    setRole(nextUser?.role || null);
    setIsSignedIn(Boolean(nextUser));
  };

  const fetchUser = async () => {
    try {
      const res = await getMeApi();
      const userData = res?.data?.data as IUser | undefined;
      applyUserState(userData || null);
    } catch {
      persistAuthToken(null);
      applyUserState(null);
    }
  };

  useEffect(() => {
    const boot = async () => {
      const token = initializeAuthToken();
      if (!token) {
        applyUserState(null);
        setIsLoading(false);
        return;
      }

      await fetchUser();
      setIsLoading(false);
    };

    boot();
  }, []);

  const refreshUser = async () => {
    setIsLoading(true);
    await fetchUser();
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    const res = await loginApi({ email, password });
    const token = res?.data?.data?.token as string;
    const userData = res?.data?.data?.user as IUser;

    persistAuthToken(token);
    applyUserState(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await registerApi({ name, email, password });
    const token = res?.data?.data?.token as string;
    const userData = res?.data?.data?.user as IUser;

    persistAuthToken(token);
    applyUserState(userData);
  };

  const logout = () => {
    persistAuthToken(null);
    applyUserState(null);
  };

  const value = useMemo(
    () => ({
      user,
      role,
      isLoading,
      isSignedIn,
      refreshUser,
      login,
      register,
      logout,
    }),
    [user, role, isLoading, isSignedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAppAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAppAuth must be used within an AuthProvider");
  }
  return context;
};
