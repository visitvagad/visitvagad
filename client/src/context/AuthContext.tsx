import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../apis/axiosInstance";
import type { IUser } from "../types";

interface AuthContextType {
  user: IUser | null;
  role: string | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<IUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    if (isSignedIn) {
      try {
        const res = await api.get("/auth/me");
        const userData = res?.data?.data;
        if (userData) {
          setUser(userData);
          setRole(userData.role || "user");
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setUser(null);
      setRole(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (clerkLoaded) {
      fetchUser();
    }
  }, [isSignedIn, clerkLoaded, clerkUser]);

  const refreshUser = async () => {
    setIsLoading(true);
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAppAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAppAuth must be used within an AuthProvider");
  }
  return context;
};
