import React, { createContext, useState, useEffect, ReactNode } from "react";
import { users } from "../api/users";
import { storage } from "../api/storage";

const TOKEN_KEY = "authToken";

interface User {
  username: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = storage.get(TOKEN_KEY);
      if (token) {
        try {
          const user = await users.getUserByToken(token);
          if (user) {
            setUser({ username: user.username, role: user.role, token });
          }
        } catch (error) {
          console.error("Failed to fetch user by token:", error);
          storage.set(TOKEN_KEY, null);
        }
      }
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
      value={{
        user,
        setUser: setUserAndStoreToken as React.Dispatch<
          React.SetStateAction<User | null>
        >,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
