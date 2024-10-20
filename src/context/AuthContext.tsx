import React, { createContext, useState, useEffect, ReactNode } from "react";
import { users } from "../api/users";
import { storage } from "../api/storage";
import { User } from "../pages/Item/types";

const TOKEN_KEY = "authToken";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = storage.get(TOKEN_KEY);
      if (token) {
        try {
          const user = await users.getUserByToken(token);
          if (user) {
            setUser({ ...user, token });
          }
        } catch (error: any) {
          console.error(
            "Failed to fetch user by token:",
            error.message || error
          );
          storage.set(TOKEN_KEY, null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const setUserAndStoreToken = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      storage.set(TOKEN_KEY, newUser.token);
    } else {
      storage.set(TOKEN_KEY, null);
    }
  };

  const logout = () => {
    setUserAndStoreToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser: setUserAndStoreToken, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
