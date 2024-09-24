import { apiInstance } from "./index";
import { Role } from "../constants";

const authRoot = "auth";

export interface UserRegisterPayload {
  username: string;
  password: string;
  email: string;
  role: Role;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  money: number;
  token: string;
}

export const users = {
  registerUser: async (
    user: UserRegisterPayload
  ): Promise<{ user: User; token: string }> => {
    try {
      const response = await apiInstance.post(`/${authRoot}/signup`, user);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.message || "Registration failed");
    }
  },

  loginUser: async (
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    try {
      const response = await apiInstance.post(`/${authRoot}/login`, {
        email,
        password,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.message || "Login failed");
    }
  },

  getUserByToken: async (token: string): Promise<User> => {
    try {
      const response = await apiInstance.get(`/${authRoot}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.message || "Failed to retrieve user");
    }
  },

  getProtectedRoute: async (token: string): Promise<any> => {
    try {
      const response = await apiInstance.get(`/${authRoot}/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.message || "Access denied");
    }
  },

  getAdminOnlyRoute: async (token: string): Promise<any> => {
    try {
      const response = await apiInstance.get(`/${authRoot}/adminOnly`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.message || "Admin access denied");
    }
  },
};
