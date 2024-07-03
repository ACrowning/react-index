import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { users } from "../api/users";
import { localStorageService } from "../api/localStorageService";

interface User {
  username: string;
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
      const token = localStorageService.getToken();
      if (token) {
        try {
          const user = await users.getUserByToken(token);
          if (user) {
            setUser({ username: user.username, token });
          }
        } catch (error) {
          console.error("Failed to fetch user by token:", error);
          localStorageService.removeToken();
        }
      }
    };
    fetchUser();
  }, []);

  const setUserAndStoreToken = (user: User | null) => {
    setUser(user);
    if (user) {
      localStorageService.setToken(user.token);
    } else {
      localStorageService.removeToken();
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
